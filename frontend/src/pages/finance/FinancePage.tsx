import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { transactionApi } from '@/entities/transaction/api'
import { employeeApi } from '@/entities/employee/api'
import type { Transaction, TransactionType } from '@/entities/transaction/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Plus,
  Trash2,
  Printer,
  Users,
} from 'lucide-react'

// ── helpers ──────────────────────────────────────────────────────────────────

function formatMoney(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const TYPE_BADGE: Record<TransactionType, { label: string; className: string }> = {
  INCOME:  { label: 'Income',  className: 'bg-green-100 text-green-700 border-green-200' },
  EXPENSE: { label: 'Expense', className: 'bg-red-100 text-red-700 border-red-200' },
  SALARY:  { label: 'Salary',  className: 'bg-blue-100 text-blue-700 border-blue-200' },
}

// ── Receipt dialog ────────────────────────────────────────────────────────────

function ReceiptDialog({ transaction, onClose }: { transaction: Transaction; onClose: () => void }) {
  const badge = TYPE_BADGE[transaction.type]
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Receipt</DialogTitle>
        </DialogHeader>
        <div id="receipt-content" className="flex flex-col gap-4 py-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Type</span>
            <Badge variant="outline" className={badge.className}>{badge.label}</Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Amount</span>
            <span className={`text-lg font-bold ${transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
              {transaction.type === 'INCOME' ? '+' : '-'}{formatMoney(transaction.amount)}
            </span>
          </div>
          {transaction.description && (
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">Description</span>
              <span className="text-sm">{transaction.description}</span>
            </div>
          )}
          {transaction.employeeName && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Employee</span>
              <span className="text-sm font-medium">{transaction.employeeName}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Date</span>
            <span className="text-sm">{formatDate(transaction.date)}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Transaction ID</span>
            <span className="text-xs font-mono text-muted-foreground">{transaction.id.slice(0, 8).toUpperCase()}</span>
          </div>
        </div>
        <Button onClick={() => window.print()} className="w-full gap-2 mt-2">
          <Printer className="size-4" />
          Print receipt
        </Button>
      </DialogContent>
    </Dialog>
  )
}

// ── Create transaction form ───────────────────────────────────────────────────

function TransactionForm({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient()
  const [type, setType] = useState<TransactionType>('INCOME')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [employeeId, setEmployeeId] = useState('')

  const { data: employees = [] } = useQuery({
    queryKey: ['employees'],
    queryFn: () => employeeApi.getAll(),
  })

  const mutation = useMutation({
    mutationFn: transactionApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['finance-stats'] })
      onClose()
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({
      type,
      amount: parseFloat(amount),
      description: description || undefined,
      date,
      employeeId: type === 'SALARY' ? employeeId : undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label>Type</Label>
        <Select value={type} onValueChange={(v) => setType(v as TransactionType)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="INCOME">Income</SelectItem>
            <SelectItem value="EXPENSE">Expense</SelectItem>
            <SelectItem value="SALARY">Salary</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="amount">Amount ($)</Label>
        <Input
          id="amount"
          type="number"
          min="0.01"
          step="0.01"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="desc">Description <span className="text-muted-foreground">(optional)</span></Label>
        <Input
          id="desc"
          placeholder="e.g. Office supplies, Client payment..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="date">Date</Label>
        <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>
      {type === 'SALARY' && (
        <div className="flex flex-col gap-2">
          <Label>Employee</Label>
          <Select value={employeeId} onValueChange={(v) => setEmployeeId(v ?? '')} required>
            <SelectTrigger>
              <SelectValue placeholder="Select employee" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((emp) => (
                <SelectItem key={emp.id} value={emp.id}>{emp.name} — {emp.role}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      {mutation.isError && <p className="text-sm text-destructive">Failed to create transaction</p>}
      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={mutation.isPending} className="flex-1">
          {mutation.isPending ? 'Adding...' : 'Add transaction'}
        </Button>
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
      </div>
    </form>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

const FILTERS: { value: TransactionType | 'ALL'; label: string }[] = [
  { value: 'ALL',     label: 'All' },
  { value: 'INCOME',  label: 'Income' },
  { value: 'EXPENSE', label: 'Expense' },
  { value: 'SALARY',  label: 'Salary' },
]

export function FinancePage() {
  const queryClient = useQueryClient()
  const [createOpen, setCreateOpen] = useState(false)
  const [receipt, setReceipt] = useState<Transaction | null>(null)
  const [filter, setFilter] = useState<TransactionType | 'ALL'>('ALL')

  const { data: stats } = useQuery({
    queryKey: ['finance-stats'],
    queryFn: () => transactionApi.getStats(),
  })

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions', filter],
    queryFn: () => transactionApi.getAll(filter === 'ALL' ? undefined : filter),
  })

  const deleteMutation = useMutation({
    mutationFn: transactionApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['finance-stats'] })
    },
  })

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Finance</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="size-4" />
          Add transaction
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
            <TrendingUp className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{formatMoney(stats?.totalIncome ?? 0)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
            <TrendingDown className="size-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{formatMoney(stats?.totalExpenses ?? 0)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Salaries Paid</CardTitle>
            <Users className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{formatMoney(stats?.totalSalaries ?? 0)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Net Balance</CardTitle>
            <Wallet className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${(stats?.netBalance ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatMoney(stats?.netBalance ?? 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 border-b">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              filter === f.value
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Transactions table */}
      <div className="rounded-md border">
        {/* Table header */}
        <div className="flex items-center gap-3 px-4 py-2.5 border-b bg-muted/40 text-xs font-medium text-muted-foreground">
          <span className="w-28 shrink-0">Date</span>
          <span className="w-24 shrink-0">Type</span>
          <span className="flex-1">Description</span>
          <span className="w-36 shrink-0">Employee</span>
          <span className="w-28 shrink-0 text-right">Amount</span>
          <span className="w-16 shrink-0" />
        </div>

        {isLoading ? (
          <div className="flex flex-col">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 border-b last:border-0">
                <div className="h-3 w-24 rounded bg-muted animate-pulse" />
                <div className="h-5 w-20 rounded bg-muted animate-pulse" />
                <div className="h-3 flex-1 rounded bg-muted animate-pulse" />
                <div className="h-3 w-28 rounded bg-muted animate-pulse" />
                <div className="h-3 w-20 rounded bg-muted animate-pulse ml-auto" />
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <p className="text-sm font-medium">No transactions found</p>
            <p className="text-xs text-muted-foreground">Add your first transaction to get started.</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {transactions.map((tx, index) => {
              const badge = TYPE_BADGE[tx.type]
              return (
                <div key={tx.id}>
                  <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors">
                    <span className="w-28 shrink-0 text-xs text-muted-foreground">{formatDate(tx.date)}</span>
                    <Badge variant="outline" className={`w-24 shrink-0 justify-center text-xs ${badge.className}`}>
                      {badge.label}
                    </Badge>
                    <span className="flex-1 text-sm truncate text-muted-foreground">
                      {tx.description || '—'}
                    </span>
                    <span className="w-36 shrink-0 text-sm text-muted-foreground truncate">
                      {tx.employeeName || '—'}
                    </span>
                    <span className={`w-28 shrink-0 text-sm font-medium text-right ${tx.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.type === 'INCOME' ? '+' : '-'}{formatMoney(tx.amount)}
                    </span>
                    <div className="w-16 shrink-0 flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-muted-foreground hover:text-foreground"
                        onClick={() => setReceipt(tx)}
                      >
                        <Printer className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteMutation.mutate(tx.id)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                  {index < transactions.length - 1 && <Separator />}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Dialogs */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add transaction</DialogTitle>
          </DialogHeader>
          <TransactionForm onClose={() => setCreateOpen(false)} />
        </DialogContent>
      </Dialog>

      {receipt && <ReceiptDialog transaction={receipt} onClose={() => setReceipt(null)} />}
    </div>
  )
}
