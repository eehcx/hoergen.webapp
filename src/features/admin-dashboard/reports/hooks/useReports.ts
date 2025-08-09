import { useQuery } from '@tanstack/react-query'
import { ReportService } from '@/core/services/reports/report.service'

export function useReports() {
  return useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const reportService = ReportService.getInstance()
      const reports = await reportService.getReports()
      return reports
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
