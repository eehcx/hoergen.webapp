// TanStack and TanStack Query hooks
import { useNavigate, Link } from "@tanstack/react-router";
import { useQueryClient } from '@tanstack/react-query';
// Hooks
import { useAuth } from '@/hooks';
import { usePermissions } from '@/hooks/auth/usePermissions';
import { useProducts, useUserSubscription, useCheckoutSession } from "@/hooks/subscriptions";
import { useStaticTranslation } from '@/hooks/useTranslation';
// Toast notifications
import { toast } from 'sonner';
// Shadcn UI components
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import HeaderNavbar from "@/components/header-navbar";
// Components
import { Footer } from '@/components/footer'
// Icons
import { IconCrown, IconCheck, IconX, IconSettings, IconRefresh } from '@tabler/icons-react'
// Firebase SDK
import { auth } from '@/core/firebase';

export default function Subscriptions() {
    const { t } = useStaticTranslation();
    
    // TanStack Router
    const navigate = useNavigate();
    
    // Get query parameters to show status
    const search = new URLSearchParams(window.location.search);
    const status = search.get('status');
    const planParam = search.get('plan');

    // TanStack Query client to invalidate queries
    const queryClient = useQueryClient();

    // Checkout session mutation
    const { mutate: createCheckout, isPending: isCreatingCheckout } = useCheckoutSession();

    // Hooks to get subscription and product data
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

    // Auth and permissions
    const { isLoading: isLoadingAuth } = useAuth();
    const { canAccessProFeatures, canAccessCreatorFeatures } = usePermissions();

    // Combined loading: if any is loading
    const isLoading = isLoadingAuth || isLoadingProducts || isLoadingSubscription

    // Show toasts based on status - using TanStack Query approach with sessionStorage to prevent duplicates
    const showStatusToast = () => {
        const hasShownToast = sessionStorage.getItem(`subscription-toast-${status}-${planParam}`);
        
        if (!hasShownToast) {
            if (status === 'success' && planParam) {
                toast.success(t('subscriptions.activated'), {
                    description: t('subscriptions.activatedDescription').replace('{plan}', planParam),
                    duration: 8000,
                });
                sessionStorage.setItem(`subscription-toast-${status}-${planParam}`, 'true');
            } else if (status === 'error') {
                toast.error(t('subscriptions.error'), {
                    description: t('subscriptions.errorDescription'),
                    duration: 10000,
                });
                sessionStorage.setItem(`subscription-toast-${status}-${planParam}`, 'true');
            }
            
            // Clear query params after showing toast
            setTimeout(() => {
                window.history.replaceState({}, '', '/subscriptions');
            }, 1000);
        }
    };
    
    // Execute toast logic if status exists
    if (status) {
        showStatusToast();
    }

    // Function to handle upgrade using TanStack Query
    const handleUpgrade = (priceId: string, productName: string = '') => {
        if (currentSubscription && currentSubscription.status === 'active' && currentSubscription.plan === productName.toLowerCase()) {
            toast.info(t('subscriptions.alreadySubscribed'), {
                description: t('subscriptions.alreadySubscribedDescription'),
                duration: 5000,
            });
            return;
        }

        if (currentSubscription && currentSubscription.status === 'active') {
            toast.warning(t('subscriptions.activeSubscription'), {
                description: t('subscriptions.activeSubscriptionDescription'),
                duration: 5000,
            });
            return;
        }

        if (!auth.currentUser) {
            toast.error(t('subscriptions.userMustBeAuthenticated'), {
                description: t('subscriptions.pleaseSignIn'),
                duration: 5000,
            });
            // Redirect to sign in page
            navigate({ to: "/sign-in" });
            return;
        }

        if (!priceId) {
            return;
        }

        createCheckout({ priceId, productName });
    };

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
                <HeaderNavbar />

                {/* Main Content */}
                <main className="flex-1 bg-background">
                <div className="container space-y-12 p-6 max-w-6xl mx-auto">
                    {/* Hero Section */}
                    <div className="py-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <h1 className="text-4xl font-bold tracking-tight">{t('subscriptions.yourSubscriptions')}</h1>
                            </div>
                            <p className="text-xl text-muted-foreground max-w-3xl">
                                {t('subscriptions.heroDescription')}
                            </p>
                        </div>
                    </div>

                    {/* Status Messages - Only show if there's specific status */}
                    {status === 'error' && (
                        <div className="space-y-4">
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <IconX className="h-5 w-5 text-red-500" />
                                    <h3 className="font-semibold text-red-700 dark:text-red-300">
                                        {t('subscriptions.subscriptionError')}
                                    </h3>
                                </div>
                                <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                                    {t('subscriptions.subscriptionErrorDescription')}
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="rounded-xs border-red-500/30 hover:bg-red-500/10"
                                        onClick={() => {
                                            queryClient.invalidateQueries({ queryKey: ['userSubscription'] });
                                            queryClient.invalidateQueries({ queryKey: ['user'] });
                                            window.location.reload();
                                        }}
                                    >
                                        {t('subscriptions.reload')}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="rounded-xs text-red-600 hover:bg-red-500/10"
                                        onClick={() => {
                                            window.open('mailto:support@hoergen.com?subject=Subscription Problem&body=Hi, I had a problem activating my subscription after payment.', '_blank');
                                        }}
                                    >
                                        {t('subscriptions.contactSupport')}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error States - Only show if NO specific status */}
                    {!status && (isProductsError || isSubscriptionError) && (
                        <div className="space-y-4">
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <IconX className="h-5 w-5 text-red-500" />
                                    <h3 className="font-semibold text-red-700 dark:text-red-300">
                                        {t('subscriptions.errorLoadingData')}
                                    </h3>
                                </div>
                                <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                                    {isProductsError
                                        ? t('subscriptions.couldNotLoadPlans')
                                        : t('subscriptions.couldNotLoadSubscription')
                                    }
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="rounded-xs border-red-500/30 hover:bg-red-500/10"
                                        onClick={() => {
                                            queryClient.invalidateQueries();
                                            window.location.reload();
                                        }}
                                    >
                                        {t('subscriptions.retry')}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="rounded-xs text-red-600 hover:bg-red-500/10"
                                        onClick={() => window.open('mailto:support@hoergen.com?subject=Error loading subscriptions&body=Hi, I have problems loading the subscriptions page.', '_blank')}
                                    >
                                        {t('subscriptions.contactSupport')}
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
                        {/* No Active Plan Message - Renderizado condicional según permisos */}
                        {(!currentSubscription || currentSubscription.plan === 'free' || currentSubscription.status !== 'active') && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold tracking-tight">{t('subscriptions.currentPlan')}</h2>
                                <div className="relative overflow-hidden rounded-t-3xl bg-gradient-to-br from-muted/20 via-muted/10 to-transparent p-8 border border-muted/20">
                                    <div className="relative z-10 text-center">
                                        <div className="flex items-center justify-center gap-3 mb-4">
                                            <Badge className="rounded-xs bg-muted/50 text-muted-foreground">
                                                {canAccessProFeatures ? (canAccessCreatorFeatures ? 'CREATOR' : 'PRO') : 'FREE'}
                                            </Badge>
                                        </div>
                                        <h3 className="text-3xl font-bold mb-2">
                                            {canAccessProFeatures ? (canAccessCreatorFeatures ? t('subscriptions.creatorPlan') : t('subscriptions.proPlan')) : t('subscriptions.freePlan')}
                                        </h3>
                                        <p className="text-muted-foreground mb-6">
                                            {canAccessProFeatures
                                                ? (canAccessCreatorFeatures
                                                    ? t('subscriptions.creatorPlanDescription')
                                                    : t('subscriptions.proPlanDescription'))
                                                : t('subscriptions.freePlanDescription')}
                                        </p>
                                        {!canAccessCreatorFeatures && (
                                            <Button
                                                className="rounded-xs"
                                                disabled={isCreatingCheckout}
                                                onClick={() => handleUpgrade(availableProducts?.[0]?.prices?.[0]?.id || '', availableProducts?.[0]?.name || '')}
                                            >
                                                <IconCrown className="h-4 w-4 mr-2" />
                                                {isCreatingCheckout ? t('subscriptions.processing') : t('subscriptions.upgradeNow')}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Active Subscription Display */}
                        {currentSubscription && currentSubscription.status === 'active' && currentSubscription.plan !== 'free' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold tracking-tight">{t('subscriptions.currentPlan')}</h2>
                                <div className="relative overflow-hidden rounded-t-3xl bg-gradient-to-br from-green-500/10 via-green-400/5 to-transparent p-8 border border-green-500/20">
                                    {/* Success confetti effect if coming from success */}
                                    {status === 'success' && (
                                        <div className="absolute inset-0 bg-green-500/5 animate-pulse"></div>
                                    )}
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-3">
                                                <Badge className="rounded-xs bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30">
                                                    <IconCheck className="h-3 w-3 mr-1" />
                                                    {t('subscriptions.active')}
                                                </Badge>
                                                <Badge variant="outline" className="rounded-xs capitalize">
                                                    {currentSubscription.plan}
                                                </Badge>
                                            </div>
                                            {status === 'success' && (
                                                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                                    <IconCheck className="h-4 w-4" />
                                                    <span className="text-sm font-medium">{t('subscriptions.justActivated')}</span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <h3 className="text-2xl font-bold mb-2 capitalize">
                                                    {currentSubscription.plan} {t('subscriptions.plan')}
                                                </h3>
                                                <p className="text-muted-foreground mb-4">
                                                    {t('subscriptions.subscriptionActiveDescription')}
                                                </p>
                                                
                                                {/* Current Features */}
                                                <div className="space-y-2">
                                                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                                        {t('subscriptions.includedFeatures')}:
                                                    </h4>
                                                    <div className="space-y-1">
                                                        {currentSubscription.plan === 'pro' && (
                                                            <>
                                                                <div className="flex items-center gap-2 text-sm">
                                                                    <IconCheck className="h-3 w-3 text-green-500" />
                                                                    <span>{t('subscriptions.proFeaturesUnlocked')}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-sm">
                                                                    <IconCheck className="h-3 w-3 text-green-500" />
                                                                    <span>{t('subscriptions.unlimitedUsage')}</span>
                                                                </div>
                                                            </>
                                                        )}
                                                        {currentSubscription.plan === 'creator' && (
                                                            <>
                                                                <div className="flex items-center gap-2 text-sm">
                                                                    <IconCheck className="h-3 w-3 text-green-500" />
                                                                    <span>{t('subscriptions.allProFeatures')}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-sm">
                                                                    <IconCheck className="h-3 w-3 text-green-500" />
                                                                    <span>{t('subscriptions.creatorTools')}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-sm">
                                                                    <IconCheck className="h-3 w-3 text-green-500" />
                                                                    <span>{t('subscriptions.advancedAnalytics')}</span>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-4">
                                                {/* Subscription Details */}
                                                <div className="bg-background/50 rounded-lg p-4 border border-muted/20">
                                                    <h4 className="font-semibold mb-3">Subscription Details</h4>
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex justify-between">
                                                            <span className="text-muted-foreground">Status:</span>
                                                            <Badge className={getStatusColor(currentSubscription.status)}>
                                                                {currentSubscription.status}
                                                            </Badge>
                                                        </div>
                                                        {currentSubscription.current_period_end && (
                                                            <div className="flex justify-between">
                                                                <span className="text-muted-foreground">Next renewal:</span>
                                                                <span className="font-medium">
                                                                    {new Date(currentSubscription.current_period_end).toLocaleDateString('en-US')}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {currentSubscription.cancel_at_period_end && (
                                                            <div className="flex justify-between text-orange-600 dark:text-orange-400">
                                                                <span>Cancels:</span>
                                                                <span className="font-medium">At period end</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                {/* Quick Actions */}
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="rounded-xs flex-1"
                                                        onClick={() => {
                                                            console.log('Manage subscription');
                                                        }}
                                                    >
                                                        <IconSettings className="h-3 w-3 mr-1" />
                                                        Manage
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="rounded-xs"
                                                        onClick={() => {
                                                            queryClient.invalidateQueries({ queryKey: ['userSubscription'] });
                                                            toast.success('Subscription updated');
                                                        }}
                                                    >
                                                        <IconRefresh className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
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
                                        const features = getFeaturesList(product.stripe_metadata_features || '')
                                        const isCurrentPlan = currentSubscription?.plan === product.stripe_metadata_created_from
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
                                                                    /{primaryPrice.interval}
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
                                                                onClick={() => handleUpgrade(primaryPrice?.id || '', product.name || '')}
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

                        {/* Upgrade Section - Solo mostrar si no tiene Creator Plan */}
                        {!canAccessCreatorFeatures && (
                            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500/20 via-green-500/15 to-teal-600/25 p-8 border border-emerald-500/20">
                                <div className="relative z-10 text-center space-y-4">
                                    <h3 className="text-2xl font-bold">Start broadcasting with purpose</h3>
                                    <p className="text-muted-foreground max-w-lg dark:text-zinc-300 mx-auto">
                                        Join Hörgen as a creator and bring your dream radio station to life. Curated, authentic, and algorithm-free.
                                    </p>
                                    <div className="flex justify-center gap-4">
                                        <a
                                            href="https://creators.horgen.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center rounded-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-50 dark:bg-zinc-200 dark:text-zinc-900 dark:hover:bg-zinc-50  transition-colors px-4 py-1.5"
                                        >
                                            View Plan
                                        </a>

                                        <Link
                                            to="/"
                                            className="flex items-center rounded-xs   transition-colors px-4 py-1.5"
                                        >
                                            Contact Sales
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    )}
                </div>
                </main>

                <Footer />
            </div>
        </>
    )
}
