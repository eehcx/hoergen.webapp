import { BaseService } from '../base.service'

export class CustomerService extends BaseService {
    private static instance: CustomerService

    private constructor() {
        super()
    }

    /**
    * Get singleton instance
    */
    static getInstance(): CustomerService {
        if (!CustomerService.instance) {
            CustomerService.instance = new CustomerService()
        }
        return CustomerService.instance
    }

    async getCustomers(): Promise<any> {
        return this.api.get('/customers')
            .then(response => response.data)
            .catch(error => this.handleError(error))
    }

    async getGeneralAnalytics(): Promise<any> {
        return this.api.get('/customers/analytics/general')
            .then(response => response.data)
            .catch(error => this.handleError(error))
    }

    async getSubscriptionAnalytics(): Promise<any> {
        return this.api.get('/customers/analytics/subscriptions')
            .then(response => response.data)
            .catch(error => this.handleError(error))
    }

    async getCheckoutSessionsAnalytics(): Promise<any> {
        return this.api.get('/customers/analytics/checkout-sessions')
            .then(response => response.data)
            .catch(error => this.handleError(error))
    }

    async getAnalyticsByCustomerId(id: string): Promise<any> {
        return this.api.get(`/customers/${id}/analytics`)
            .then(response => response.data)
            .catch(error => this.handleError(error));
    }
}