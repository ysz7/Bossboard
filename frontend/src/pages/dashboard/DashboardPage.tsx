import { useQuery } from '@tanstack/react-query'
import { StatsCards } from '@/widgets/stats-cards/StatsCards'
import { taskApi } from '@/entities/task/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { TaskStatus } from '@/entities/task/types'

const STATUS_VARIANT: Record<TaskStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  TODO: 'outline',
  IN_PROGRESS: 'default',
  DONE: 'secondary',
  CANCELLED: 'destructive',
}

export function DashboardPage() {
  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => taskApi.getAll(),
  })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your team and tasks</p>
      </div>

      <StatsCards />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
            <CardDescription>Latest 5 tasks across all employees</CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            {tasks.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No tasks yet</p>
            ) : (
              <div className="flex flex-col gap-3">
                {tasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-center justify-between">
                    <span className="text-sm">{task.title}</span>
                    <Badge variant={STATUS_VARIANT[task.status]} className="text-xs">
                      {task.status.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Status</CardTitle>
            <CardDescription>Distribution by status</CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            {(['TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED'] as TaskStatus[]).map((status) => {
              const count = tasks.filter((t) => t.status === status).length
              const total = tasks.length || 1
              return (
                <div key={status} className="flex items-center gap-3 mb-3">
                  <span className="text-sm text-muted-foreground w-24">{status.replace('_', ' ')}</span>
                  <div className="flex-1 bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${(count / total) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-4 text-right">{count}</span>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
