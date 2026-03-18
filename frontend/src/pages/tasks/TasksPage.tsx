import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { TaskForm } from '@/features/task-form/TaskForm'
import { TaskStatusUpdate } from '@/features/task-status-update/TaskStatusUpdate'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import {
  Plus,
  ArrowUp,
  ArrowRight,
  ArrowDown,
  Circle,
  CircleCheck,
  CircleSlash,
  Timer,
  Search,
  Trash2,
} from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { taskApi } from '@/entities/task/api'
import type { TaskPriority, TaskStatus } from '@/entities/task/types'

const PRIORITY_CONFIG: Record<TaskPriority, { icon: React.ReactNode; label: string }> = {
  HIGH:   { icon: <ArrowUp className="size-3.5 text-destructive" />,         label: 'High' },
  MEDIUM: { icon: <ArrowRight className="size-3.5 text-muted-foreground" />, label: 'Medium' },
  LOW:    { icon: <ArrowDown className="size-3.5 text-muted-foreground" />,  label: 'Low' },
}

const STATUS_CONFIG: Record<TaskStatus, { icon: React.ReactNode; label: string }> = {
  TODO:        { icon: <Circle className="size-3.5 text-muted-foreground" />,       label: 'Todo' },
  IN_PROGRESS: { icon: <Timer className="size-3.5 text-blue-500" />,               label: 'In Progress' },
  DONE:        { icon: <CircleCheck className="size-3.5 text-green-500" />,         label: 'Done' },
  CANCELLED:   { icon: <CircleSlash className="size-3.5 text-muted-foreground" />,  label: 'Cancelled' },
}

// Generate short task ID from uuid
function toTaskId(id: string) {
  return 'TASK-' + id.slice(0, 4).toUpperCase()
}

export function TasksPage() {
  const [open, setOpen] = useState(false)
  const [filter] = useState<TaskStatus | 'ALL'>('ALL')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const queryClient = useQueryClient()

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => taskApi.getAll(),
  })

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(ids.map((id) => taskApi.delete(id)))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      setSelected(new Set())
    },
  })

  const filtered = tasks
    .filter((t) => filter === 'ALL' || t.status === filter)
    .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()))

  const allSelected = filtered.length > 0 && filtered.every((t) => selected.has(t.id))

  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set())
    } else {
      setSelected(new Set(filtered.map((t) => t.id)))
    }
  }

  const toggleOne = (id: string) => {
    const next = new Set(selected)
    next.has(id) ? next.delete(id) : next.add(id)
    setSelected(next)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Here is a list of your tasks for this month.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2">
        <div className="relative max-w-xs w-full flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            placeholder="Filter tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
        <Button size="sm" className="h-8 text-xs" onClick={() => setOpen(true)}>
          <Plus className="size-3" /> Add Task
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create task</DialogTitle>
          </DialogHeader>
          <TaskForm onClose={() => setOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Table */}
      <div className="rounded-md border">
        {/* Table header */}
        <div className="flex items-center gap-3 px-4 py-2.5 border-b bg-muted/40 text-xs font-medium text-muted-foreground">
          <Checkbox
            checked={allSelected}
            onCheckedChange={toggleAll}
            className="shrink-0"
          />
          <span className="w-24 shrink-0">Task</span>
          <span className="flex-1">Title</span>
          <span className="w-36 shrink-0">Assigned to</span>
          <span className="w-32 shrink-0">Status</span>
          <span className="w-24 shrink-0">Priority</span>
          <span className="w-8 shrink-0" />
        </div>

        {/* Rows */}
        {isLoading ? (
          <div className="flex flex-col">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 border-b last:border-0">
                <div className="h-4 w-4 rounded bg-muted animate-pulse shrink-0" />
                <div className="h-3 w-20 rounded bg-muted animate-pulse" />
                <div className="h-3 flex-1 rounded bg-muted animate-pulse" />
                <div className="h-3 w-28 rounded bg-muted animate-pulse" />
                <div className="h-3 w-24 rounded bg-muted animate-pulse" />
                <div className="h-3 w-16 rounded bg-muted animate-pulse" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <p className="text-sm font-medium">No tasks found</p>
            <p className="text-xs text-muted-foreground">
              {search ? 'Try a different search term.' : 'Create your first task to get started.'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {filtered.map((task, index) => {
              const status = STATUS_CONFIG[task.status]
              const priority = PRIORITY_CONFIG[task.priority]
              const isSelected = selected.has(task.id)

              return (
                <div key={task.id}>
                  <div className={`flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors ${isSelected ? 'bg-muted/60' : ''}`}>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleOne(task.id)}
                      className="shrink-0"
                    />

                    {/* Task ID */}
                    <span className="w-24 shrink-0 text-xs font-medium text-muted-foreground">
                      {toTaskId(task.id)}
                    </span>

                    {/* Title + priority as label */}
                    <div className="flex-1 flex items-center gap-2 min-w-0">
                      <Badge variant="outline" className="text-xs shrink-0 font-normal">
                        {task.priority === 'HIGH' ? 'Urgent' : task.priority === 'MEDIUM' ? 'Feature' : 'Minor'}
                      </Badge>
                      <span className="text-sm truncate">{task.title}</span>
                    </div>

                    {/* Assigned to */}
                    <div className="w-36 shrink-0 text-sm text-muted-foreground truncate">
                      {task.employeeName}
                    </div>

                    {/* Status */}
                    <div className="w-32 shrink-0 flex items-center gap-1.5 text-sm text-muted-foreground">
                      {status.icon}
                      {status.label}
                    </div>

                    {/* Priority */}
                    <div className="w-24 shrink-0 flex items-center gap-1.5 text-sm text-muted-foreground">
                      {priority.icon}
                      {priority.label}
                    </div>

                    {/* Actions — status update */}
                    <div className="w-8 shrink-0 flex justify-end">
                      <TaskStatusUpdate taskId={task.id} currentStatus={task.status} currentPriority={task.priority} />
                    </div>
                  </div>
                  {index < filtered.length - 1 && <Separator />}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {selected.size > 0
              ? `${selected.size} of ${filtered.length} row(s) selected`
              : `${filtered.length} task${filtered.length !== 1 ? 's' : ''}`}
          </p>
          {selected.size > 0 && (
            <Button
              variant="destructive"
              size="sm"
              className="h-7 text-xs gap-1.5"
              onClick={() => bulkDeleteMutation.mutate([...selected])}
              disabled={bulkDeleteMutation.isPending}
            >
              <Trash2 className="size-3" />
              Delete {selected.size} selected
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
