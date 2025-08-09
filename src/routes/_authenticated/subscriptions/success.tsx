import { useNavigate } from '@tanstack/react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks';
import { UserService } from '@/core/services/users/user.service';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { IconCheck, IconLoader, IconX } from '@tabler/icons-react';
import { toast } from 'sonner';
import HeaderNavbar from '@/components/header-navbar';
import { useEffect, useState } from 'react';

export default function SubscriptionSuccess() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user, refreshClaims } = useAuth();
    const [plan, setPlan] = useState<string | null>(null);

    const params = new URLSearchParams(window.location.search);
    const planParam = params.get('plan');
    
    // Validar y convertir a tipos correctos
    const validPlan = planParam === 'pro' || planParam === 'creator' ? planParam : 'pro';
    const userRole = planParam === 'creator' ? 'creator' : 'pro';

    useEffect(() => {
        setPlan(planParam);
    }, [planParam]);

    // TanStack Mutation for claims update
    const mutation = useMutation({
        mutationFn: async () => {
            if (!user?.uid || !planParam) throw new Error('Missing user or plan');
            await UserService.getInstance().updateClaims(user.uid, {
                role: userRole,
                plan: validPlan,
            });
            await new Promise(resolve => setTimeout(resolve, 2000));
            await refreshClaims();
            await new Promise(resolve => setTimeout(resolve, 1000));
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['userSubscription'] }),
                queryClient.invalidateQueries({ queryKey: ['products'] }),
                queryClient.invalidateQueries({ queryKey: ['userRole'] }),
                queryClient.invalidateQueries({ queryKey: ['userPermissions'] })
            ]);
        },
        onSuccess: () => {
            toast.success('Subscription activated!', {
                description: `Your ${validPlan} plan is now active. Enjoy the new features!`
            });
            setTimeout(() => {
                navigate({ to: '/subscriptions', search: { status: 'success', plan: validPlan } });
            }, 3000);
        },
        onError: (error: any) => {
            toast.error('Error activating subscription', {
                description: error?.message || 'There was a problem activating your subscription.'
            });
        }
    });

    useEffect(() => {
        if (planParam && user?.uid) {
            mutation.mutate();
        }
        // eslint-disable-next-line
    }, [planParam, user?.uid]);

    return (
        <div className="flex flex-col h-screen bg-background">
            <HeaderNavbar />
            <main className="flex-1 flex flex-col">
                {/* Hero Section - Full Screen */}
                <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
                    <div className="text-center max-w-3xl mx-auto">
                        {/* Icon */}
                        <div className="mb-6">
                            <div className="w-14 h-14 bg-green-500/20 flex items-center justify-center mx-auto rounded-full">
                                {mutation.isPending ? (
                                    <IconLoader className="h-10 w-10 text-green-500 animate-spin" />
                                ) : mutation.isError ? (
                                    <IconX className="h-10 w-10 text-red-500" />
                                ) : (
                                    <IconCheck className="h-10 w-10 text-green-500" />
                                )}
                            </div>
                        </div>

                        {/* Main Message */}
                        <h1 className="text-4xl md:text-5xl font-bold mb-3">
                            {mutation.isPending ? (
                                <span className="text-foreground">Activating your subscription...</span>
                            ) : mutation.isError ? (
                                <span className="text-red-500">Activation Error</span>
                            ) : (
                                <span className="text-green-500">
                                    You're {plan === 'creator' ? 'Creator' : 'Pro'} now.
                                </span>
                            )}
                        </h1>

                        <p className="text-lg md:text-xl text-muted-foreground mb-6 leading-relaxed">
                            {mutation.isPending
                                ? <>We are activating your <strong className="text-green-600">{plan?.toUpperCase()}</strong> plan and updating your account...</>
                                : mutation.isError
                                    ? <>There was a problem activating your subscription.<br />Please try again or contact support.</>
                                    : <>Your <span className="font-semibold text-green-600">{plan?.toUpperCase()}</span> plan is now active.<br />
                                        {plan === 'creator' 
                                            ? 'Create unlimited stations, access creator tools, and advanced analytics.'
                                            : 'Enjoy unlimited stations, full listening history, and enhanced chat.'
                                        }</>
                            }
                        </p>

                        {/* Loading Steps */}
                        {mutation.isPending && (
                            <div className="bg-card border border-border p-4 mb-6">
                                <div className="text-sm text-muted-foreground space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 animate-pulse"></div>
                                        <span>Processing payment...</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 animate-pulse"></div>
                                        <span>Updating permissions...</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 animate-pulse"></div>
                                        <span>Syncing your account...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* CTA Card - Bottom Section */}
                <div className="px-6 pb-6">
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-card border border-border p-6 shadow-lg">
                            <div className="text-center">
                                <span className="text-base font-semibold text-green-600 mb-4 block">LISTEN NOW</span>
                                <div className="flex items-center justify-center gap-6 mb-6">
                                    
                                    <div className="text-left">
                                        <div className="font-bold text-xl">
                                            Welcome to {plan === 'creator' ? 'Creator' : 'Premium'}
                                        </div>
                                        <div className="text-muted-foreground text-sm">
                                            {plan === 'creator' 
                                                ? 'Create, broadcast, and analyze.'
                                                : 'Unlimited listening, no limits.'
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <Button
                                        size="lg"
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                        onClick={() => navigate({ to: plan === 'creator' ? '/s/new' : '/' })}
                                        disabled={mutation.isPending}
                                    >
                                        {plan === 'creator' ? 'Create Station' : 'Start Listening'}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="flex-1"
                                        onClick={() => navigate({ to: '/subscriptions' })}
                                        disabled={mutation.isPending}
                                    >
                                        Manage Subscription
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export const Route = createFileRoute('/_authenticated/subscriptions/success')({
    component: SubscriptionSuccess,
});
