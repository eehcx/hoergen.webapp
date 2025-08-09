import { BaseService } from "../base.service";
import {
  ApiResponse,
  CreateReportDto,
  UpdateReportDto,
  ResponseReportDto,
  ReportTrendsQueryParams,
  ReportTopReportersQueryParams,
} from "@/core/types";

export class ReportService extends BaseService {
  private static instance: ReportService;

  private constructor() {
    super();
  }

  static getInstance(): ReportService {
    if(!ReportService.instance) {
      ReportService.instance = new ReportService();
    }
    return ReportService.instance;
  }

  async createReport(data: CreateReportDto): Promise<ApiResponse> {
    try {
      const response = await this.api.post('/reports', data);
      return response.data;
    } catch (error) {
      return this.handleError(error)
    }
  }

  async getReports(): Promise<ResponseReportDto[]> {
    try {
      const response = await this.api.get('/reports');
      return response.data;
    } catch (error) {
      return this.handleError(error)
    }
  }

  async getReport(id: string): Promise<ResponseReportDto> {
    try {
      const response = await this.api.get(`/reports/${id}`);
      return response.data;
    } catch (error) {
      return this.handleError(error)
    }
  }

  async getAnalyticsTotals(): Promise<any> {
    try {
      const response = await this.api.get('/reports/analytics/totals');
      return response.data;
    } catch (error) {
      return this.handleError(error)
    }
  }

  async getAnalyticsByReason(): Promise<any> {
    return this.api.get('/reports/analytics/by-reason')
      .then(response => response.data)
      .catch(error => this.handleError(error));
  }

  async getAnalyticsByTrends(params?: ReportTrendsQueryParams): Promise<any> {
    return this.api.get('/reports/analytics/trends', { params })
      .then(response => response.data)
      .catch(error => this.handleError(error));
  }

  async getAnalyticsByTargetType(): Promise<any> {
    return this.api.get('/reports/analytics/by-target-type')
      .then(response => response.data)
      .catch(error => this.handleError(error));
  }

  async getAnalyticsAverageResolutionTime(): Promise<any> {
    return this.api.get('/reports/analytics/average-resolution-time')
      .then(response => response.data)
      .catch(error => this.handleError(error));
  }

  async getAnalyticsTopReporters(params?: ReportTopReportersQueryParams): Promise<any> {
    return this.api.get('/reports/analytics/top-reporters', { params })
      .then(response => response.data)
      .catch(error => this.handleError(error));
  }

  async updateReport(id: string, data: UpdateReportDto): Promise<ApiResponse> {
    try {
      const response = await this.api.put(`/reports/${id}`, data);
      return response.data;
    } catch (error) {
      return this.handleError(error)
    }
  }

  async deleteReport(id: string): Promise<ApiResponse> {
    try {
      const response = await this.api.delete(`/reports/${id}`);
      return response.data;
    } catch (error) {
      return this.handleError(error)
    }
  }
}
