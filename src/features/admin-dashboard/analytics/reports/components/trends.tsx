import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Legend, Tooltip } from 'recharts'
import { useState } from 'react'
import { useReportsTrends } from '../hooks'
import { TimeRange } from '@/core/types'
import { SelectDropdown } from '@/components/select-dropdown'
import { Skeleton } from '@/components/ui/skeleton'

const timeRanges = [
    { label: 'Last 7 Days', value: 'last7days' },
    { label: 'Last 30 Days', value: 'last30days' },
    { label: 'Last 12 Months', value: 'last12months' },
]

// Colors aligned with your design system and visually pleasant
const barColorByLabel: Record<string, string> = {
    'Total Reports': '#4F8AF7', // Soft blue, good for both themes
    'Resolved': '#34d399',      // Brand green
}

export function Trends() {
    const [timeRange, setTimeRange] = useState<TimeRange>('last7days')
    const { data, isLoading } = useReportsTrends(timeRange)

    // Adapt API response to Recharts format
    const chartData =
        data && data.labels
            ? data.labels.map((label: string, idx: number) => {
                    const entry: Record<string, number | string> = { name: label }
                    data.datasets.forEach((ds: any) => {
                        entry[ds.label] = ds.data[idx]
                    })
                    return entry
                })
            : []

    return (
        <div>
            <div className='mb-4 flex gap-2'>
                <SelectDropdown
                    value={timeRange}
                    onValueChange={val => setTimeRange(val as TimeRange)}
                    items={timeRanges}
                    placeholder='Time Range'
                    className='min-w-[180px]'
                />
            </div>
            <ResponsiveContainer width='100%' height={350}>
                {isLoading ? (
                    <Skeleton className='w-full h-full rounded-md' />
                ) : (
                    <BarChart data={chartData}>
                        <XAxis
                            dataKey='name'
                            stroke='#888888'
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke='#888888'
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            allowDecimals={false}
                        />
                        <Tooltip />
                        <Legend />
                        {data?.datasets?.map((ds: any) => (
                            <Bar
                                key={ds.label}
                                dataKey={ds.label}
                                fill={barColorByLabel[ds.label] || '#A0AEC0'} // fallback: neutral gray
                                stackId="reports"
                                radius={[4, 4, 0, 0]}
                            />
                        ))}
                    </BarChart>
                )}
            </ResponsiveContainer>
        </div>
    )
}
