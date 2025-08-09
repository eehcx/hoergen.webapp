import { BaseService } from '../base.service'
import {
  ApiResponse,
  CreateFeedbackDto,
  ResponseFeedbackDto
} from '@/core/types'

export class FeedbackService extends BaseService {
  private static instance: FeedbackService;

  private constructor() {
    super();
  }

  static getInstance(): FeedbackService {
    if(!FeedbackService.instance) {
      FeedbackService.instance = new FeedbackService();
    }
    return FeedbackService.instance;
  }

  /**
  * Create feedback
  */
  async createFeedback(data: CreateFeedbackDto): Promise<ApiResponse> {
    try {
      const response = await this.api.post('/feedback', data);
      return response.data;
    } catch (error) {
      return this.handleError(error)
    }
  }

  async getAllFeedback(): Promise<ResponseFeedbackDto[]> {
    try {
      const response = await this.api.get('/feedback');
      return response.data;
    } catch (error) {
      return this.handleError(error)
    }
  }

  async getFeedbackByUser(id: string): Promise<ResponseFeedbackDto[]> {
    try {
      const response = await this.api.get(`/feedback/${id}`);
      return response.data;
    } catch (error) {
      return this.handleError(error)
    }
  }

  async deleteFeedback(id: string): Promise<ApiResponse> {
    try {
      const response = await this.api.delete(`/feedback/${id}`);
      return response.data;
    } catch (error) {
      return this.handleError(error)
    }
  }
}
