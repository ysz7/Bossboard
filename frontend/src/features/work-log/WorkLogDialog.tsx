import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { workLogApi } from '@/entities/worklog/api'
import type { Employee } from '@/entities/employee/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ChevronLeft, ChevronRight, Trash2, Printer, Plus } from 'lucide-react'

// ── helpers ──────────────────────────────────────────────────────────────────

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function toDateStr(date: Date) {
  return date.toISOString().slice(0, 10)
}

function formatDay(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })
}

// ── Add log row form ──────────────────────────────────────────────────────────

interface AddRowProps {
  employeeId: string
  year: number
  month: number
  onSaved: () => void
}

function AddLogRow({ employeeId, year, month, onSaved }: AddRowProps) {
  const today = new Date()
  const defaultDate = today.getFullYear() === year && today.getMonth() + 1 === month
    ? toDateStr(today)
    : toDateStr(new Date(year, month - 1, 1))

  const [date, setDate] = useState(defaultDate)
  const [hours, setHours] = useState('')
  const [note, setNote] = useState('')

  const mutation = useMutation({
    mutationFn: () => workLogApi.upsert(employeeId, { date, hours: parseFloat(hours), note: note || undefined }),
    onSuccess: () => {
      onSaved()
      setHours('')
      setNote('')
    },
  })

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); mutation.mutate() }}
      className="flex items-end gap-2 pt-2"
    >
      <div className="flex flex-col gap-1 w-36">
        <Label className="text-xs">Date</Label>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-8 text-sm"
          min={toDateStr(new Date(year, month - 1, 1))}
          max={toDateStr(new Date(year, month, 0))}
          required
        />
      </div>
      <div className="flex flex-col gap-1 w-24">
        <Label className="text-xs">Hours</Label>
        <Input type="number" min="0.5" max="24" step="0.5" placeholder="8"
          value={hours} onChange={(e) => setHours(e.target.value)}
          className="h-8 text-sm" required
        />
      </div>
      <div className="flex flex-col gap-1 flex-1">
        <Label className="text-xs">Note <span className="text-muted-foreground">(optional)</span></Label>
        <Input placeholder="e.g. Remote work, overtime..."
          value={note} onChange={(e) => setNote(e.target.value)}
          className="h-8 text-sm"
        />
      </div>
      <Button type="submit" size="sm" disabled={mutation.isPending} className="h-8">
        <Plus className="size-3.5" />
        Add
      </Button>
    </form>
  )
}

// ── Report ────────────────────────────────────────────────────────────────────

interface ReportProps {
  employee: Employee
  year: number
  month: number
  onClose: () => void
}

function ReportDialog({ employee, year, month, onClose }: ReportProps) {
  const { data: logs = [] } = useQuery({
    queryKey: ['worklogs', employee.id, year, month],
    queryFn: () => workLogApi.getByMonth(employee.id, year, month),
  })

  const totalHours = logs.reduce((sum, l) => sum + l.hours, 0)
  const daysWorked = logs.length

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Monthly Report</DialogTitle>
        </DialogHeader>
        <div id="report-content" className="flex flex-col gap-4">
          {/* Employee info */}
          <div className="rounded-md border p-4 flex flex-col gap-1">
            <p className="font-semibold">{employee.name}</p>
            <p className="text-sm text-muted-foreground">{employee.role}</p>
            <p className="text-sm text-muted-foreground">{MONTH_NAMES[month - 1]} {year}</p>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-md border p-3 text-center">
              <p className="text-2xl font-bold">{totalHours}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Total hours</p>
            </div>
            <div className="rounded-md border p-3 text-center">
              <p className="text-2xl font-bold">{daysWorked}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Days worked</p>
            </div>
          </div>

          <Separator />

          {/* Log table */}
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No work logs for this month.</p>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <div className="flex items-center gap-3 px-3 py-2 bg-muted/40 text-xs font-medium text-muted-foreground border-b">
                <span className="w-28">Date</span>
                <span className="w-16 text-right">Hours</span>
                <span className="flex-1">Note</span>
              </div>
              {logs.map((log) => (
                <div key={log.id} className="flex items-center gap-3 px-3 py-2 border-b last:border-0 text-sm">
                  <span className="w-28 text-muted-foreground">{formatDay(log.date)}</span>
                  <span className="w-16 text-right font-medium">{log.hours}h</span>
                  <span className="flex-1 text-muted-foreground">{log.note || '—'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <Button onClick={() => window.print()} className="w-full gap-2 mt-2">
          <Printer className="size-4" />
          Print report
        </Button>
      </DialogContent>
    </Dialog>
  )
}

// ── Main dialog ───────────────────────────────────────────────────────────────

interface Props {
  employee: Employee
  onClose: () => void
}

export function WorkLogDialog({ employee, onClose }: Props) {
  const queryClient = useQueryClient()
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [reportOpen, setReportOpen] = useState(false)

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['worklogs', employee.id, year, month],
    queryFn: () => workLogApi.getByMonth(employee.id, year, month),
  })

  const deleteMutation = useMutation({
    mutationFn: (logId: string) => workLogApi.delete(employee.id, logId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['worklogs', employee.id, year, month] }),
  })

  const totalHours = logs.reduce((sum, l) => sum + l.hours, 0)

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  return (
    <>
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Work hours — {employee.name}</DialogTitle>
          </DialogHeader>

          {/* Month navigation */}
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={prevMonth} className="size-8">
              <ChevronLeft className="size-4" />
            </Button>
            <span className="text-sm font-medium">{MONTH_NAMES[month - 1]} {year}</span>
            <Button variant="ghost" size="icon" onClick={nextMonth} className="size-8">
              <ChevronRight className="size-4" />
            </Button>
          </div>

          {/* Summary bar */}
          <div className="flex items-center justify-between rounded-md border px-4 py-2.5 bg-muted/40">
            <div className="text-sm">
              <span className="text-muted-foreground">Total: </span>
              <span className="font-semibold">{totalHours}h</span>
              <span className="text-muted-foreground ml-3">Days: </span>
              <span className="font-semibold">{logs.length}</span>
            </div>
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5" onClick={() => setReportOpen(true)}>
              <Printer className="size-3" />
              Report
            </Button>
          </div>

          {/* Log list */}
          <div className="rounded-md border">
            <div className="flex items-center gap-3 px-3 py-2 bg-muted/40 text-xs font-medium text-muted-foreground border-b">
              <span className="w-28">Date</span>
              <span className="w-16 text-right">Hours</span>
              <span className="flex-1">Note</span>
              <span className="w-7" />
            </div>

            {isLoading ? (
              <div className="flex flex-col">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-2.5 border-b last:border-0">
                    <div className="h-3 w-24 rounded bg-muted animate-pulse" />
                    <div className="h-3 w-10 rounded bg-muted animate-pulse ml-auto" />
                    <div className="h-3 w-28 rounded bg-muted animate-pulse" />
                  </div>
                ))}
              </div>
            ) : logs.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No logs for this month yet.
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="flex items-center gap-3 px-3 py-2.5 border-b last:border-0 text-sm hover:bg-muted/40 group">
                  <span className="w-28 text-muted-foreground">{formatDay(log.date)}</span>
                  <span className="w-16 text-right font-medium">{log.hours}h</span>
                  <span className="flex-1 text-muted-foreground truncate">{log.note || '—'}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                    onClick={() => deleteMutation.mutate(log.id)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              ))
            )}
          </div>

          {/* Add row */}
          <AddLogRow
            employeeId={employee.id}
            year={year}
            month={month}
            onSaved={() => queryClient.invalidateQueries({ queryKey: ['worklogs', employee.id, year, month] })}
          />
        </DialogContent>
      </Dialog>

      {reportOpen && (
        <ReportDialog
          employee={employee}
          year={year}
          month={month}
          onClose={() => setReportOpen(false)}
        />
      )}
    </>
  )
}
