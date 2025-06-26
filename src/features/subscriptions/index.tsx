// TanStack and TanStack Query hooks
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useProducts, useUserSubscription } from "@/hooks/subscriptions";
// Hooks
import { useGlobalUserRole } from '@/hooks/useAuth';
// React hooks
import { useState, useEffect } from 'react';
// Shadcn UI components
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
// Components
import { Footer } from '@/components/footer'
import { MiniPlayer } from '@/components/mini-player'
import { useMiniPlayer } from '@/context/mini-player-context'
// Icons
import { IconCrown, IconCheck, IconX } from '@tabler/icons-react'
// Dependencies
import { Link } from '@tanstack/react-router'
// Services
// Firebase SDK
import { 
    addDoc, 
    collection, 
    onSnapshot
} from 'firebase/firestore';
import { db, auth } from '@/core/firebase';

// Payment history interface - commented out for now
/*
interface PaymentHistory {
    id: string
    date: string
    amount: number
    currency: string
    status: 'paid' | 'failed' | 'pending'
    planName: string
}
*/

// Hook para manejar checkout sessions con TanStack Query
function useCheckoutSession() {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async (priceId: string): Promise<string> => {
            if (!auth.currentUser) {
                throw new Error('User must be authenticated');
            }

            if (!priceId) {
                throw new Error('Price ID is required');
            }

            // Crear checkout session según la documentación oficial
            const docRef = await addDoc(
                collection(db, "customers", auth.currentUser.uid, "checkout_sessions"),
                {
                    price: priceId,
                    success_url: `${window.location.origin}/subscriptions/success?plan=pro`,
                    cancel_url: `${window.location.origin}/subscriptions/cancel?plan=pro`,
                }
            );

            // Retornar una Promise que se resuelve cuando la extensión agregue la URL o error
            return new Promise((resolve, reject) => {
                const unsubscribe = onSnapshot(docRef, (snap) => {
                    const data = snap.data();
                    if (data?.error) {
                        unsubscribe();
                        reject(new Error(data.error.message || 'Stripe checkout error'));
                        return;
                    }
                    if (data?.url) {
                        unsubscribe();
                        resolve(data.url);
                    }
                });
            });
        },
        onSuccess: (url: string) => {
            // Redirigir a Stripe Checkout
            window.location.assign(url);
        },
        onError: (error: Error) => {
            console.error("Error creating checkout session:", error);
            navigate({ to: "/subscriptions", search: { status: "error" } });
        }
    });
}

export default function SubscriptionsPanel() {
    // TankStack Router
    const navigate = useNavigate()
    
    // TanStack Query client para invalidar queries
    const queryClient = useQueryClient();
    
    // Estado para mostrar mensaje de éxito
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    
    // Checkout session mutation
    const { mutate: createCheckout, isPending: isCreatingCheckout, error: checkoutError } = useCheckoutSession();
    
    // Hooks para obtener datos de suscripciones y productos
    const { 
        data: availableProducts, 
        isLoading: isLoadingProducts,
        isError: isProductsError 
    } = useProducts()
    
    const { 
        data: currentSubscription, 
        isLoading: isLoadingSubscription,
        isError: isSubscriptionError 
    } = useUserSubscription()

    const { data: userRole, isLoading: isLoadingRole } = useGlobalUserRole();

    // Otros hooks
    const { player } = useMiniPlayer()

    // Loading combinado: si cualquiera está cargando
    const isLoading = isLoadingRole || isLoadingProducts || isLoadingSubscription

    // Función para manejar el upgrade usando TanStack Query
    const handleUpgrade = (priceId: string) => {
        if (!auth.currentUser) {
            console.error('User must be authenticated');
            navigate({ to: "/sign-in" });
            return;
        }

        if (!priceId) {
            console.error('Price ID is required');
            return;
        }

        createCheckout(priceId);
    };

    // Invalidate userSubscription query on subscription change
    useEffect(() => {
        if (currentSubscription) {
            queryClient.invalidateQueries({ queryKey: ['userSubscription'] });
        }
    }, [currentSubscription, queryClient]);

    // Helper functions
    const getStatusColor = (status: string) => {
        switch (status) {
        case 'active': return 'bg-green-500/20 text-green-600 dark:text-green-400'
        case 'cancelled': return 'bg-red-500/20 text-red-600 dark:text-red-400'
        case 'expired': return 'bg-gray-500/20 text-gray-600 dark:text-gray-400'
        case 'pending': return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
        case 'paid': return 'bg-green-500/20 text-green-600 dark:text-green-400'
        case 'failed': return 'bg-red-500/20 text-red-600 dark:text-red-400'
        default: return 'bg-gray-500/20 text-gray-600 dark:text-gray-400'
        }
    }

    const formatPrice = (amount: number, currency: string) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: currency.toUpperCase(),
            minimumFractionDigits: 0
        }).format(amount / 100); // Stripe amounts are in cents
    }

    const getCurrentProduct = () => {
        if (!userRole || userRole.plan === 'free') return null;
        if (!availableProducts) return null;
        return availableProducts.find(product => 
            product.subscriptionType === userRole.plan
        );
    }

    const getFeaturesList = (features: string | string[]): string[] => {
        if (Array.isArray(features)) {
            return features
        }
        return features.split(',').map(feature => feature.trim())
    }

    return (
        <>
            <div className="flex flex-col min-h-screen bg-background">
                {/* Header */}
                <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90">
                    <div className="container flex h-20 items-center">
                        {/* Logo */}
                        <Link to="/" className="flex items-center space-x-2 select-none">
                        <h1 className="text-xl font-bold tracking-widest font-[Orbitron]">Hörgen</h1>
                        </Link>
                        
                        {/* Navigation */}
                        <nav className="ml-8 flex items-center space-x-1">
                            <Button variant="ghost" size="sm" className="font-medium text-sm h-9 px-4 rounded-xs">
                                <Link to="/">Radio</Link>
                            </Button>
                            <Button variant="ghost" size="sm" className="font-medium text-sm h-9 px-4 rounded-xs">
                                <Link to="/browse">Browse</Link>
                            </Button>
                            <Button variant="ghost" size="sm" className="font-medium text-sm h-9 px-4 rounded-xs">
                                <Link to="/library">Library</Link>
                            </Button>
                        </nav>
                        
                        {/* User Actions */}
                        <div className="ml-auto flex items-center space-x-4">
                            <ThemeSwitch />
                            <ProfileDropdown />
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 bg-background">
                <div className="container space-y-12 p-6 max-w-6xl mx-auto">
                    {/* Hero Section */}
                    <div className="py-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <h1 className="text-4xl font-bold tracking-tight">Your Subscriptions</h1>
                            </div>
                            <p className="text-xl text-muted-foreground max-w-3xl">
                            Manage your subscriptions, billing, and access premium features that amplify your experience listening and creating radio stations.
                            </p>
                        </div>
                    </div>

                    {/* 🚨 Error States */}
                    {(isProductsError || isSubscriptionError) && (
                        <div className="space-y-4">
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <IconX className="h-5 w-5 text-red-500" />
                                    <h3 className="font-semibold text-red-700 dark:text-red-300">
                                        Error Loading Data
                                    </h3>
                                </div>
                                <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                                    {isProductsError 
                                        ? "Failed to load subscription plans. Please try again." 
                                        : "Failed to load your current subscription. Please try again."
                                    }
                                </p>
                                <div className="flex gap-2">
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="rounded-xs border-red-500/30 hover:bg-red-500/10"
                                        onClick={() => window.location.reload()}
                                    >
                                        Retry
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="rounded-xs text-red-600 hover:bg-red-500/10"
                                        onClick={() => console.log('Contact support logic')}
                                    >
                                        Contact Support
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 🎉 Success Message */}
                    {showSuccessMessage && (
                        <div className="space-y-4">
                            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <IconCheck className="h-5 w-5 text-green-500" />
                                    <h3 className="font-semibold text-green-700 dark:text-green-300">
                                        Payment Successful!
                                    </h3>
                                </div>
                                <p className="text-sm text-green-600 dark:text-green-400 mb-4">
                                    Your subscription has been activated successfully. Your plan and features are being updated.
                                </p>
                                <div className="flex gap-2">
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="rounded-xs border-green-500/30 hover:bg-green-500/10"
                                        onClick={() => setShowSuccessMessage(false)}
                                    >
                                        Dismiss
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 🚨 Checkout Error State */}
                    {checkoutError && (
                        <div className="space-y-4">
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <IconX className="h-5 w-5 text-red-500" />
                                    <h3 className="font-semibold text-red-700 dark:text-red-300">
                                        Checkout Error
                                    </h3>
                                </div>
                                <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                                    {checkoutError.message || "Failed to create checkout session. Please try again."}
                                </p>
                                <div className="flex gap-2">
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="rounded-xs border-red-500/30 hover:bg-red-500/10"
                                        onClick={() => window.location.reload()}
                                    >
                                        Retry
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {isLoading ? (
                    <div className="space-y-8">
                        {/* Loading Current Plan */}
                        <div className="space-y-6">
                        <div className="h-6 bg-muted rounded animate-pulse w-48"></div>
                        <div className="bg-muted/30 rounded-t-3xl p-8 space-y-4 animate-pulse">
                            <div className="h-8 bg-muted rounded w-64"></div>
                            <div className="h-4 bg-muted rounded w-32"></div>
                            <div className="h-4 bg-muted rounded w-48"></div>
                        </div>
                        </div>
                        
                        {/* Loading All Plans */}
                        <div className="space-y-6">
                        <div className="h-6 bg-muted rounded animate-pulse w-32"></div>
                        <div className="grid gap-6 md:grid-cols-2">
                            {[1, 2].map((i) => (
                            <div key={i} className="bg-muted/20 rounded-xs p-6 space-y-4 animate-pulse">
                                <div className="h-6 bg-muted rounded w-40"></div>
                                <div className="h-4 bg-muted rounded w-24"></div>
                                <div className="space-y-2">
                                {[1, 2, 3].map((j) => (
                                    <div key={j} className="h-3 bg-muted rounded w-full"></div>
                                ))}
                                </div>
                            </div>
                            ))}
                        </div>
                        </div>
                    </div>
                    ) : (
                    <div className="space-y-12">
                        {/* Current Active Plan */}
                        {currentSubscription && currentSubscription.plan !== 'free' && currentSubscription.status === 'active' && (
                            (() => {
                                const currentProduct = getCurrentProduct();
                                return currentProduct ? (
                                    <div>
                                        <h2>Current Plan</h2>
                                        <p>{currentProduct.name}</p>
                                    </div>
                                ) : null;
                            })()
                        )}

                        {/* No Active Plan Message */}
                        {(!currentSubscription || currentSubscription.plan === 'free' || currentSubscription.status !== 'active') && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold tracking-tight">Current Plan</h2>
                                <div className="relative overflow-hidden rounded-t-3xl bg-gradient-to-br from-muted/20 via-muted/10 to-transparent p-8 border border-muted/20">
                                    <div className="relative z-10 text-center">
                                        <div className="flex items-center justify-center gap-3 mb-4">
                                            <Badge className="rounded-xs bg-muted/50 text-muted-foreground">
                                                FREE
                                            </Badge>
                                        </div>
                                        <h3 className="text-3xl font-bold mb-2">Free Plan</h3>
                                        <p className="text-muted-foreground mb-6">
                                            You're currently on the free plan. Upgrade to access premium features.
                                        </p>
                                        <Button 
                                            className="rounded-xs" 
                                            disabled={isCreatingCheckout}
                                            onClick={() => handleUpgrade(availableProducts?.[0]?.prices?.[0]?.stripePriceId || '')}
                                        >
                                            <IconCrown className="h-4 w-4 mr-2" />
                                            {isCreatingCheckout ? 'Processing...' : 'Upgrade Now'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Available Plans */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold tracking-tight">Available Plans</h2>
                            
                            {isLoadingProducts ? (
                                <div className="grid gap-6 md:grid-cols-2">
                                    {[1, 2].map((i) => (
                                        <div key={i} className="bg-muted/20 rounded-xs p-6 space-y-4 animate-pulse">
                                            <div className="h-6 bg-muted rounded w-40"></div>
                                            <div className="h-4 bg-muted rounded w-24"></div>
                                            <div className="space-y-2">
                                                {[1, 2, 3].map((j) => (
                                                    <div key={j} className="h-3 bg-muted rounded w-full"></div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : !availableProducts || availableProducts.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <IconCrown className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="font-semibold text-lg mb-2">No Plans Available</h3>
                                    <p className="text-muted-foreground mb-4">
                                        No subscription plans are currently available. Please check back later.
                                    </p>
                                    <Button variant="outline" className="rounded-xs">
                                        Refresh
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid gap-6 md:grid-cols-2">
                                    {availableProducts?.map((product) => {
                                        const primaryPrice = product.prices?.[0]
                                        const features = getFeaturesList(product.features)
                                        const isCurrentPlan = currentSubscription?.plan === product.subscriptionType
                                        const planStatus = isCurrentPlan ? currentSubscription?.status : 'available'
                                        
                                        return (
                                            <Card key={product.id} className="bg-muted/20 rounded-xs p-6 border-0">
                                                <div className="space-y-4">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <h3 className="font-semibold text-lg">{product.name}</h3>
                                                            <div className="flex items-center gap-2 mt-1">
                                                        {isCurrentPlan && (
                                                            <Badge className={`text-xs rounded-xs ${getStatusColor(planStatus || 'available')}`}>
                                                                {planStatus?.toUpperCase()}
                                                            </Badge>
                                                        )}
                                                        {isCurrentPlan && (
                                                            <Badge variant="outline" className="text-xs rounded-xs">
                                                                Current
                                                            </Badge>
                                                        )}
                                                            </div>
                                                        </div>
                                                        {primaryPrice && (
                                                            <div className="text-right">
                                                                <div className="font-semibold">
                                                                    {formatPrice(primaryPrice.unit_amount, primaryPrice.currency)}
                                                                </div>
                                                                <div className="text-xs text-muted-foreground">
                                                                    /{primaryPrice.recurring.interval}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    <p className="text-sm text-muted-foreground">
                                                        {product.description}
                                                    </p>
                                                    
                                                    <Separator />
                                                    
                                                    <div className="space-y-2">
                                                        {features.slice(0, 3).map((feature, index) => (
                                                            <div key={index} className="flex items-center gap-2 text-sm">
                                                                <IconCheck className="h-3 w-3 text-green-500 flex-shrink-0" />
                                                                <span>{feature}</span>
                                                            </div>
                                                        ))}
                                                        {features.length > 3 && (
                                                            <div className="text-xs text-muted-foreground">
                                                                +{features.length - 3} more features
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="flex gap-2 pt-2">
                                                        {isCurrentPlan && planStatus === 'active' ? (
                                                            <>
                                                                <Button variant="outline" size="sm" className="rounded-xs flex-1">
                                                                    Modify
                                                                </Button>
                                                                <Button variant="outline" size="sm" className="rounded-xs">
                                                                    <IconX className="h-4 w-4" />
                                                                </Button>
                                                            </>
                                                        ) : (
                                                            <Button 
                                                                variant="outline" 
                                                                size="sm" 
                                                                className="rounded-xs flex-1"
                                                                disabled={isCreatingCheckout}
                                                                onClick={() => handleUpgrade(primaryPrice?.stripePriceId || '')}
                                                            >
                                                                {isCreatingCheckout ? 'Processing...' : (isCurrentPlan ? 'Reactivate' : 'Subscribe')}
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </Card>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Payment History - Commented out for now */}
                        {/* 
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold tracking-tight">Payment History</h2>
                                <Button variant="outline" size="sm" className="rounded-xs">
                                    <IconHistory className="h-4 w-4 mr-2" />
                                    View All
                                </Button>
                            </div>
                            
                            <div className="space-y-3">
                                {paymentHistory.map((payment) => (
                                    <div key={payment.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-xs hover:bg-muted/30 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-none flex items-center justify-center">
                                                <IconCreditCard className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="font-medium">{payment.planName}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {formatDate(payment.date)}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-3">
                                            <div className="text-right">
                                                <div className="font-semibold">${payment.amount}</div>
                                                <Badge className={`text-xs rounded-xs ${getStatusColor(payment.status)}`}>
                                                    {payment.status}
                                                </Badge>
                                            </div>
                                            <IconChevronRight className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        */}

                        {/* Upgrade Section */}
                        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500/20 via-green-500/15 to-teal-600/25 p-8 border border-emerald-500/20">
                        <div className="relative z-10 text-center space-y-4">
                            <h3 className="text-2xl font-bold">Unlock More Features</h3>
                            <p className="text-muted-foreground max-w-2xl dark:text-zinc-300 mx-auto">
                            Explore our premium plans and get access to exclusive underground radio features, broadcasting tools, and more.
                            </p>
                            <div className="flex justify-center gap-4">
                            <Button 
                                className="rounded-xs"
                                disabled={isCreatingCheckout}
                                onClick={() => handleUpgrade(availableProducts?.[0]?.prices?.[0]?.stripePriceId || '')}
                            >
                                {isCreatingCheckout ? 'Processing...' : 'View Plans'}
                            </Button>
                            <Button variant="outline" className="rounded-xs bg-transparent">
                                Contact Sales
                            </Button>
                            </div>
                        </div>
                        </div>
                    </div>
                    )}
                </div>
                </main>
                
                <Footer />
                {player && (
                <MiniPlayer
                    streamUrl={player.streamUrl}
                    stationName={player.stationName}
                    stationCover={player.stationCover}
                    isPlaying={player.isPlaying}
                />
                )}
            </div>
        </>
    )
}
