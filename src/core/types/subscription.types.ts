export interface UserSubscription {
    // Basic information from user claims
    plan: string // 'free' | 'pro' | 'creator'
    status: 'active' | 'cancelled' | 'expired' | 'pending' | 'trialing' | 'past_due' | 'unpaid'
    
    // Current period dates (Unix timestamps)
    current_period_start?: number
    current_period_end?: number
    
    // Creation and end dates
    created?: number
    ended_at?: number
    canceled_at?: number
    
    // Cancellation settings
    cancel_at_period_end?: boolean
    cancel_at?: number
    
    // Product and price information
    product_name?: string
    price_id?: string
    currency?: string
    amount?: number
    interval?: string
    
    // Stripe IDs
    subscription_id?: string
    customer_id?: string
    
    // Additional metadata
    trial_end?: number
    trial_start?: number
}
