import { useMutation, useQueryClient } from '@tanstack/react-query'
import { taskApi } from '@/entities/task/api'
import type { TaskStatus, TaskPriority } from '@/entities/task/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Circle, Timer, CircleCheck, CircleSlash, Trash2, ArrowUp, ArrowRight, ArrowDown } from 'lucide-react'

const STATUS_OPTIONS: { value: TaskStatus; label: string; icon: React.ReactNode }[] = [
  { value: 'TODO',        label: 'Todo',        icon: <Circle className="size-3.5 text-muted-foreground" /> },
  { value: 'IN_PROGRESS', label: 'In Progress', icon: <Timer className="size-3.5 text-blue-500" /> },
  { value: 'DONE',        label: 'Done',        icon: <CircleCheck className="size-3.5 text-green-500" /> },
  { value: 'CANCELLED',   label: 'Cancelled',   icon: <CircleSlash className="size-3.5 text-muted-foreground" /> },
]

const PRIORITY_OPTIONS: { value: TaskPriority; label: string; icon: React.ReactNode }[] = [
  { value: 'HIGH',   label: 'Urgent',   icon: <ArrowUp className="size-3.5 text-destructive" /> },
  { value: 'MEDIUM', label: 'Feature',  icon: <ArrowRight className="size-3.5 text-muted-foreground" /> },
  { value: 'LOW',    label: 'Minor',    icon: <ArrowDown className="size-3.5 text-muted-foreground" /> },
]

interface Props {
  taskId: string
  currentStatus: TaskStatus
  currentPriority: TaskPriority
}

export function TaskStatusUpdate({ taskId, currentStatus, currentPriority }: Props) {
  const queryClient = useQueryClient()

  const statusMutation = useMutation({
    mutationFn: (status: TaskStatus) => taskApi.updateStatus(taskId, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  })

  const priorityMutation = useMutation({
    mutationFn: (priority: TaskPriority) => taskApi.updatePriority(taskId, priority),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: () => taskApi.delete(taskId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground">
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs text-muted-foreground">Set status</DropdownMenuLabel>
          {STATUS_OPTIONS.map((opt) => (
            <DropdownMenuItem
              key={opt.value}
              onClick={() => statusMutation.mutate(opt.value)}
              disabled={opt.value === currentStatus}
              className="flex items-center gap-2 text-sm"
            >
              {opt.icon}
              {opt.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs text-muted-foreground">Set priority</DropdownMenuLabel>
          {PRIORITY_OPTIONS.map((opt) => (
            <DropdownMenuItem
              key={opt.value}
              onClick={() => priorityMutation.mutate(opt.value)}
              disabled={opt.value === currentPriority}
              className="flex items-center gap-2 text-sm"
            >
              {opt.icon}
              {opt.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => deleteMutation.mutate()}
          className="flex items-center gap-2 text-sm text-destructive focus:text-destructive"
        >
          <Trash2 className="size-3.5" />
          Delete task
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
