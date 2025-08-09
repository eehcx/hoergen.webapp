import { useMutation } from '@tanstack/react-query';
import { addDoc, collection, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/core/firebase';
import { toast } from 'sonner';

export function useCheckoutSession() {
    return useMutation({
        mutationFn: async ({ priceId, productName }: { priceId: string, productName: string }): Promise<string> => {
            if (!auth.currentUser) {
                throw new Error('User must be authenticated');
            }

            if (!priceId) {
                throw new Error('Price ID is required');
            }

            // Determinar URLs según el nombre del producto
            let successUrl = `${window.location.origin}/subscriptions/success`
            let cancelUrl = `${window.location.origin}/subscriptions/cancel`

            if (productName?.toLowerCase().includes('creator')) {
                successUrl = `${window.location.origin}/subscriptions/success?plan=creator`
                cancelUrl = `${window.location.origin}/subscriptions/cancel?plan=creator`
            } else {
                successUrl = `${window.location.origin}/subscriptions/success?plan=pro`
                cancelUrl = `${window.location.origin}/subscriptions/cancel?plan=pro`
            }

            // Crear checkout session según la documentación oficial
            const docRef = await addDoc(
                collection(db, "customers", auth.currentUser.uid, "checkout_sessions"),
                {
                    price: priceId,
                    success_url: successUrl,
                    cancel_url: cancelUrl,
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
            // Mostrar error como toast en lugar de navegación
            toast.error("Checkout Error", {
                description: error.message || "Failed to create checkout session. Please try again.",
                duration: 5000,
            });
        }
    });
}