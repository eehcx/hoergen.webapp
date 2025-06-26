import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { UserService } from '@/core/services/users/user.service';
import { createFileRoute } from '@tanstack/react-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/core/firebase';

export default function SubscriptionSuccess() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user } = useAuth();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const plan = params.get('plan');

        if (plan && user?.uid) {
            const updateUserAfterSuccess = async () => {
                try {
                    const userRef = doc(db, 'users', user.uid);
                    const userSnap = await getDoc(userRef);

                    if (!userSnap.exists()) {
                        console.error('User does not exist in Firestore');
                        return;
                    }

                    const userService = UserService.getInstance();
                    const userRole = plan === 'pro' ? 'pro' : 'creator';
                    const userPlan = plan as 'pro' | 'creator' | 'free';

                    await userService.updateClaims(user.uid, {
                        role: userRole,
                        plan: userPlan,
                    });

                    queryClient.invalidateQueries({ queryKey: ['userSubscription'] });
                    queryClient.invalidateQueries({ queryKey: ['products'] });
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
    }, [navigate, queryClient, user]);

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
