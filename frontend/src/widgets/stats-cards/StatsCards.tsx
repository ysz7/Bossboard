import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/entities/user/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, CheckSquare, Clock, TrendingUp } from 'lucide-react'

export function StatsCards() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardApi.getStats,
  })

  if (isLoading) return <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{[...Array(4)].map((_, i) => <Card key={i} className="h-28 animate-pulse bg-muted" />)}</div>
  if (!data) return null

  const cards = [
    { label: 'Total Employees', value: data.employees.total, icon: Users, desc: 'All registered employees' },
    { label: 'Active', value: data.employees.active, icon: TrendingUp, desc: 'Currently working' },
    { label: 'In Progress', value: data.tasks.inProgress, icon: CheckSquare, desc: 'Tasks being worked on' },
    { label: 'Due Soon', value: data.tasks.dueSoon, icon: Clock, desc: 'Deadline within 7 days' },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map(({ label, value, icon: Icon, desc }) => (
        <Card key={label}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
            <Icon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{desc}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
