import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { UserService } from '@/core/services/users/user.service';
import { createFileRoute } from '@tanstack/react-router';

export default function SubscriptionSuccess() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user, refreshClaims } = useAuth();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const plan = params.get('plan');

        if (plan && user?.uid) {
            const updateUserAfterSuccess = async () => {
                try {
                    // 1) Llamada al backend para setear custom claims
                    const userService = UserService.getInstance();
                    const userRole = plan === 'pro' ? 'pro' : 'creator';
                    const userPlan = plan as 'pro' | 'creator' | 'free';

                    await userService.updateClaims(user.uid, {
                        role: userRole,
                        plan: userPlan,
                    });

                    // 2) Refrescar claims automáticamente (esto forzará el refresh del token)
                    await refreshClaims();

                    // 3) Invalidar queries dependientes
                    await queryClient.invalidateQueries({ queryKey: ['userSubscription'] });
                    await queryClient.invalidateQueries({ queryKey: ['products'] });
                    await queryClient.invalidateQueries({ queryKey: ['userRole'] });

                    // 4) Redirigir a suscripciones
                    navigate({ to: '/subscriptions' });
                } catch (error) {
                    console.error('Error updating user after success:', error);
                }
            };

            updateUserAfterSuccess();
        }

        const timeout = setTimeout(() => {
            navigate({ to: '/subscriptions' });
        }, 5000);

        return () => clearTimeout(timeout);
    }, [navigate, queryClient, user, refreshClaims]);

    return (
        <div className="container mx-auto flex flex-col items-center justify-center h-screen bg-background">
            <div className="max-w-md text-center">
                <h1 className="text-5xl font-bold text-green-500 tracking-wide">Payment Successful</h1>
                <p className="text-lg text-muted-foreground mt-4">
                    Your subscription has been activated successfully. Enjoy premium features tailored for underground radio enthusiasts.
                </p>
                <div className="mt-8">
                    <button
                        className="px-6 py-3 bg-green-700 text-white hover:bg-green-800 transition-all shadow-lg border border-green-900"
                        onClick={() => navigate({ to: '/subscriptions' })}
                    >
                        Manage Subscriptions
                    </button>
                </div>
            </div>
        </div>
    );
}

export const Route = createFileRoute('/subscriptions/success')({
    component: SubscriptionSuccess,
});
