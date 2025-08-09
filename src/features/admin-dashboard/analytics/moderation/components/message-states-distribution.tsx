import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'
import { useChatsPlatformAnalytics } from '../hooks'

const STATE_COLORS = {
  approved: '#22c55e', // green
  pending: '#f59e0b', // amber
  hidden: '#ef4444', // red
  deleted: '#6b7280', // gray
}

export function MessageStatesDistribution() {
  const { data, isLoading } = useChatsPlatformAnalytics()

  if (isLoading) {
    return (
      <div className='flex h-full items-center justify-center'>
        <Skeleton className='h-60 w-full rounded-md' />
      </div>
    )
  }

  if (!data?.stateDistribution) {
    return (
      <div className='flex h-full items-center justify-center'>
        <p className='text-muted-foreground'>
          No state distribution data available
        </p>
      </div>
    )
  }

  // Prepare pie chart data
  const chartData = Object.entries(data.stateDistribution)
    .filter(([, value]) => value > 0) // Only show states with values > 0
    .map(([state, value]) => ({
      name: state.charAt(0).toUpperCase() + state.slice(1),
      value: value,
      color: STATE_COLORS[state as keyof typeof STATE_COLORS] || '#64748b',
    }))

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className='bg-background rounded-lg border p-3 shadow-lg'>
          <p className='font-medium'>{data.name}</p>
          <p className='text-sm'>
            <span className='font-semibold' style={{ color: data.color }}>
              {data.value}
            </span>
            <span className='text-muted-foreground ml-1'>messages</span>
          </p>
        </div>
      )
    }
    return null
  }

  const CustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    value,
  }: any) => {
    if (value === 0) return null //index

    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill='white'
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline='central'
        fontSize={12}
        fontWeight='bold'
      >
        {value}
      </text>
    )
  }

  return (
    <ResponsiveContainer width='100%' height={300}>
      {chartData.length === 0 ? (
        <div className='flex h-full items-center justify-center'>
          <p className='text-muted-foreground'>No messages to display</p>
        </div>
      ) : (
        <PieChart>
          <Pie
            data={chartData}
            cx='50%'
            cy='50%'
            labelLine={false}
            label={CustomLabel}
            outerRadius={80}
            fill='#8884d8'
            dataKey='value'
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign='bottom'
            height={36}
            formatter={(value, entry) => (
              <span style={{ color: entry.color }}>{value}</span>
            )}
          />
        </PieChart>
      )}
    </ResponsiveContainer>
  )
}
