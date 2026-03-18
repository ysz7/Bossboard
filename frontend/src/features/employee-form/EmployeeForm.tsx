import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { employeeApi } from '@/entities/employee/api'
import type { Employee, EmployeeStatus } from '@/entities/employee/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Props {
  onClose: () => void
  employee?: Employee
}

export function EmployeeForm({ onClose, employee }: Props) {
  const queryClient = useQueryClient()
  const isEdit = !!employee

  const [name, setName] = useState(employee?.name ?? '')
  const [role, setRole] = useState(employee?.role ?? '')
  const [email, setEmail] = useState(employee?.email ?? '')
  const [phone, setPhone] = useState(employee?.phone ?? '')
  const [description, setDescription] = useState(employee?.description ?? '')
  const [status, setStatus] = useState<EmployeeStatus>(employee?.status ?? 'ACTIVE')

  const createMutation = useMutation({
    mutationFn: employeeApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      onClose()
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: Parameters<typeof employeeApi.update>[1]) =>
      employeeApi.update(employee!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      onClose()
    },
  })

  const mutation = isEdit ? updateMutation : createMutation
  const isPending = mutation.isPending

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEdit) {
      updateMutation.mutate({ name, role, email, phone: phone || undefined, description: description || undefined, status })
    } else {
      createMutation.mutate({ name, role, email, phone: phone || undefined, description: description || undefined })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Full name</Label>
        <Input id="name" placeholder="John Smith" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="role">Job title</Label>
        <Input id="role" placeholder="Developer" value={role} onChange={(e) => setRole(e.target.value)} required />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="john@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="phone">Phone <span className="text-muted-foreground">(optional)</span></Label>
        <Input id="phone" placeholder="+1234567890" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="description">About <span className="text-muted-foreground">(optional)</span></Label>
        <Textarea
          id="description"
          placeholder="Short bio or notes about this team member..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>
      {isEdit && (
        <div className="flex flex-col gap-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as EmployeeStatus)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
              <SelectItem value="ON_LEAVE">On Leave</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      {mutation.isError && (
        <p className="text-sm text-destructive">
          {isEdit ? 'Failed to update employee' : 'Failed to create employee'}
        </p>
      )}
      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? (isEdit ? 'Saving...' : 'Creating...') : (isEdit ? 'Save changes' : 'Create employee')}
        </Button>
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  )
}
