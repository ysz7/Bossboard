import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, CheckSquare, LogOut, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/employees', label: 'Employees', icon: Users },
  { to: '/tasks', label: 'Tasks', icon: CheckSquare },
  { to: '/finance', label: 'Finance', icon: DollarSign },
]

export function Sidebar() {
  const navigate = useNavigate()

  return (
    <aside className="flex flex-col w-56 min-h-screen border-r bg-background">
      <div className="flex items-center h-14 px-4 border-b">
        <span className="font-semibold text-sm">BossBoard</span>
      </div>

      <nav className="flex-1 px-2 py-4 flex flex-col gap-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? 'bg-secondary text-secondary-foreground font-medium'
                  : 'text-muted-foreground hover:bg-secondary hover:text-secondary-foreground'
              }`
            }
          >
            <Icon className="size-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-2 py-4">
        <Separator className="mb-4" />
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground"
          onClick={() => { localStorage.removeItem('token'); navigate('/login') }}
        >
          <LogOut className="size-4" />
          Log out
        </Button>
      </div>
    </aside>
  )
}
