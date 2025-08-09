import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useChatsPlatformAnalytics } from '../hooks'
import { Skeleton } from '@/components/ui/skeleton'

const COLORS = {
  TOXICITY: '#ef4444',           // red
  SEVERE_TOXICITY: '#dc2626',    // dark red
  INSULT: '#f59e0b',             // amber
  PROFANITY: '#f97316',          // orange
  THREAT: '#7c3aed',             // violet
  IDENTITY_ATTACK: '#3b82f6',    // blue
}

export function ModerationScoresOverview() {
  const { data, isLoading } = useChatsPlatformAnalytics()

  // Prepare bar chart data
  const chartData = data?.averageScores ? Object.entries(data.averageScores).map(([key, value]) => ({
    name: key.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
    value: Number((value * 100).toFixed(2)),
    originalKey: key
  })).sort((a, b) => b.value - a.value) : []

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <p className="font-medium">{label}</p>
          <p className="text-sm">
            <span className="font-semibold" style={{ color: payload[0].color }}>
              {payload[0].value}%
            </span>
            <span className="text-muted-foreground ml-1">average score</span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width='100%' height={350}>
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <Skeleton className="w-full h-40 rounded-md" />
        </div>
      ) : (
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            allowDecimals={true}
            domain={[0, 'dataMax']}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" name="Score" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[entry.originalKey as keyof typeof COLORS] || '#64748b'}
              />
            ))}
          </Bar>
        </BarChart>
      )}
    </ResponsiveContainer>
  )
}
