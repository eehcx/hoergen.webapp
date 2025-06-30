import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { createFileRoute } from '@tanstack/react-router';

export default function SubscriptionCancel() {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirigir a /subscriptions después de 5 segundos
        const timeout = setTimeout(() => {
            navigate({ to: '/subscriptions' });
        }, 5000);

        return () => clearTimeout(timeout);
    }, [navigate]);

    return (
        <div className="container mx-auto flex flex-col items-center justify-center h-screen bg-background">
            <div className="max-w-md text-center">
                <h1 className="text-5xl font-bold text-red-500 tracking-wide">Payment Cancelled</h1>
                <p className="text-lg text-muted-foreground mt-4">
                    Your payment process was cancelled. Explore other plans or try again to unlock premium features.
                </p>
                <div className="mt-8">
                    <button
                        className="px-6 py-3 bg-red-700 text-white hover:bg-red-800 transition-all shadow-lg border border-red-900"
                        onClick={() => navigate({ to: '/subscriptions' })}
                    >
                        Back to Subscriptions
                    </button>
                </div>
            </div>
        </div>
    );
}

export const Route = createFileRoute('/_authenticated/subscriptions/cancel')({
    component: SubscriptionCancel,
});
