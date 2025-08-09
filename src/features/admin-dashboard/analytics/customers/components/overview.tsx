import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import { useGeneralCustomers, useSubscriptions } from '../hooks/useCustomers'
import { Skeleton } from '@/components/ui/skeleton'

const COLORS = {
  active: '#34d399',    // green
  canceled: '#4F8AF7',  // blue
}

export function Overview() {
  const { isLoading: loadingGeneral } = useGeneralCustomers()
  const { data: subscriptions, isLoading: loadingSubs } = useSubscriptions()

  // Prepare bar chart data
  const active = subscriptions?.active ?? 0
  const canceled = subscriptions?.canceled ?? 0

  const barData = [
    { name: 'Active', value: active },
    { name: 'Canceled', value: canceled },
  ]

  return (
    <ResponsiveContainer width='100%' height={350}>
      {(loadingGeneral || loadingSubs) ? (
        <div className="flex items-center justify-center h-full">
          <Skeleton className="w-full h-40 rounded-md" />
        </div>
      ) : (
        <BarChart data={barData}>
          <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" name="Subscriptions" radius={[4, 4, 0, 0]}>
            <Cell fill={COLORS.active} />
            <Cell fill={COLORS.canceled} />
          </Bar>
        </BarChart>
      )}
    </ResponsiveContainer>
  )
}
