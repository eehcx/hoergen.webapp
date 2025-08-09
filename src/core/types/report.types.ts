export type TargetType = 'user' | 'station' | 'comment' | 'other';
export type ReportStatus = 'pending' | 'resolved' | 'rejected';

export type TimeRange =  'last7days' | 'last30days' | 'last12months'

export interface CreateReportDto {
  userId: string;
  targetType: TargetType;
  targetId: string;
  reason: string;
  details?: string;
  status?: ReportStatus;
}

export interface UpdateReportDto {
  targetType?: TargetType;
  targetId?: string;
  reason?: string;
  details?: string;
  status: ReportStatus;
}

export interface ResponseReportDto {
  id: string;
  userId: string;
  targetType: TargetType;
  targetId: string;
  reason: string;
  details: string;
  status: ReportStatus;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  updatedAt: {
    _seconds: number;
    _nanoseconds: number;
  };
}

export interface ReportTrendsQueryParams {
  timeRange?: TimeRange;
}

export interface ReportTopReportersQueryParams {
  limit?: number;
}