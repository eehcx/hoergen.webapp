import { useQuery } from '@tanstack/react-query'
import { ReportService } from '@/core/services'
import { TimeRange } from '@/core/types'

export function useTotalReports() {
    return useQuery({
        queryKey: ['reports' , 'total'],
        queryFn: async () => {
            const reports = await ReportService.getInstance().getAnalyticsTotals()
            return reports
        },
        staleTime: 5 * 60 * 1000,
        retry: 3,
    })
}

export function useReportsByReason() {
    return useQuery({
        queryKey: ['reports', 'by-reason'],
        queryFn: async () => {
            const reports = await ReportService.getInstance().getAnalyticsByReason()
            return reports
        },
        staleTime: 5 * 60 * 1000,
        retry: 3,
    })
}

export function useReportsTrends(timeRange?: TimeRange) {
    return useQuery({
        queryKey: ['reports', 'trends', timeRange],
        queryFn: async () => {
            const reports = await ReportService.getInstance().getAnalyticsByTrends({ timeRange })
            return reports
        },
        staleTime: 5 * 60 * 1000,
        retry: 3,
    })
}

export function useReportsByTargetType() {
    return useQuery({
        queryKey: ['reports', 'by-target-type'],
        queryFn: async () => {
            const reports = await ReportService.getInstance().getAnalyticsByTargetType()
            return reports
        },
        staleTime: 5 * 60 * 1000,
        retry: 3,
    })
}

export function useAverageResolutionTime() {
    return useQuery({
        queryKey: ['reports', 'average-resolution-time'],
        queryFn: async () => {
            const reports = await ReportService.getInstance().getAnalyticsAverageResolutionTime()
            return reports
        },
        staleTime: 5 * 60 * 1000,
        retry: 3,
    })
}

export function useTopReporters(limit?: number) {
    return useQuery({
        queryKey: ['reports', 'top-reporters', limit],
        queryFn: async () => {
            const reports = await ReportService.getInstance().getAnalyticsTopReporters({ limit })
            return reports
        },
        staleTime: 5 * 60 * 1000,
        retry: 3,
    })
}