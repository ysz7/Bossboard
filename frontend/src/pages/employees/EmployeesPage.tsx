import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { employeeApi } from '@/entities/employee/api'
import { EmployeeForm } from '@/features/employee-form/EmployeeForm'
import type { Employee, EmployeeStatus } from '@/entities/employee/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Trash2, Plus, Mail, Phone, Pencil, Clock } from 'lucide-react'
import { WorkLogDialog } from '@/features/work-log/WorkLogDialog'

const STATUS_VARIANT: Record<EmployeeStatus, 'default' | 'secondary' | 'outline'> = {
  ACTIVE: 'default',
  INACTIVE: 'secondary',
  ON_LEAVE: 'outline',
}

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

function getAvatarColor(name: string) {
  const colors = [
    'bg-red-100 text-red-700',
    'bg-orange-100 text-orange-700',
    'bg-amber-100 text-amber-700',
    'bg-green-100 text-green-700',
    'bg-teal-100 text-teal-700',
    'bg-blue-100 text-blue-700',
    'bg-indigo-100 text-indigo-700',
    'bg-purple-100 text-purple-700',
    'bg-pink-100 text-pink-700',
  ]
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}

export function EmployeesPage() {
  const queryClient = useQueryClient()
  const [createOpen, setCreateOpen] = useState(false)
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null)
  const [workLogEmployee, setWorkLogEmployee] = useState<Employee | null>(null)

  const { data: employees = [], isLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: () => employeeApi.getAll(),
  })

  const deleteMutation = useMutation({
    mutationFn: employeeApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['employees'] }),
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team members</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {employees.length} member{employees.length !== 1 ? 's' : ''} in your team
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="size-4" />
          Add member
        </Button>
      </div>

      {/* Create dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add team member</DialogTitle>
          </DialogHeader>
          <EmployeeForm onClose={() => setCreateOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Work log dialog */}
      {workLogEmployee && (
        <WorkLogDialog employee={workLogEmployee} onClose={() => setWorkLogEmployee(null)} />
      )}

      {/* Edit dialog */}
      <Dialog open={!!editEmployee} onOpenChange={(open) => { if (!open) setEditEmployee(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit team member</DialogTitle>
          </DialogHeader>
          {editEmployee && (
            <EmployeeForm employee={editEmployee} onClose={() => setEditEmployee(null)} />
          )}
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="h-48 animate-pulse bg-muted" />
          ))}
        </div>
      ) : employees.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
            <p className="text-sm font-medium">No team members yet</p>
            <p className="text-sm text-muted-foreground">Add your first employee to get started.</p>
            <Button variant="outline" onClick={() => setCreateOpen(true)}>
              <Plus className="size-4" />
              Add member
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {employees.map((emp) => (
            <Card key={emp.id} className="group relative">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${getAvatarColor(emp.name)}`}>
                    {getInitials(emp.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-sm truncate">{emp.name}</p>
                      <Badge variant={STATUS_VARIANT[emp.status]} className="shrink-0 text-xs">
                        {emp.status === 'ON_LEAVE' ? 'On Leave' : emp.status.charAt(0) + emp.status.slice(1).toLowerCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{emp.role}</p>
                  </div>
                </div>

                {emp.description && (
                  <p className="mt-3 text-xs text-muted-foreground line-clamp-2">{emp.description}</p>
                )}

                <Separator className="my-4" />

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Mail className="size-3 shrink-0" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                  {emp.phone && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Phone className="size-3 shrink-0" />
                      <span>{emp.phone}</span>
                    </div>
                  )}
                </div>

                {/* Action buttons — visible on hover */}
                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setWorkLogEmployee(emp)}
                    className="size-7 text-muted-foreground hover:text-foreground"
                    title="Work hours"
                  >
                    <Clock className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditEmployee(emp)}
                    className="size-7 text-muted-foreground hover:text-foreground"
                    title="Edit"
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation.mutate(emp.id)}
                    className="size-7 text-muted-foreground hover:text-destructive"
                    title="Delete"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
