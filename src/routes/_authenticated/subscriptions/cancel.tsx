import { createFileRoute } from '@tanstack/react-router';
import { useNavigate } from '@tanstack/react-router';
import HeaderNavbar from '@/components/header-navbar';
import { Button } from '@/components/ui/button';
import { IconX, IconArrowLeft, IconMail } from '@tabler/icons-react';

export default function SubscriptionCancel() {
    const navigate = useNavigate();

    const params = new URLSearchParams(window.location.search);
    const planParam = params.get('plan');

    return (
        <div className="flex flex-col h-screen bg-background">
            <HeaderNavbar />
            <main className="flex-1 flex flex-col">
                {/* Hero Section - Full Screen */}
                <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
                    <div className="text-center max-w-3xl mx-auto">
                        {/* Icon */}
                        <div className="mb-6">
                            <div className="w-14 h-14 bg-red-500/20 flex items-center justify-center rounded-full mx-auto">
                                <IconX className="h-10 w-10 text-red-500" />
                            </div>
                        </div>

                        {/* Main Message */}
                        <h1 className="text-4xl md:text-5xl font-bold text-red-500 mb-3">
                            Subscription Cancelled
                        </h1>

                        <p className="text-lg md:text-xl text-muted-foreground mb-6 leading-relaxed">
                            Your {planParam ? `${planParam.toUpperCase()} plan ` : ''}subscription was not completed.<br />
                            If you changed your mind, you can try again or contact support for help.
                        </p>
                    </div>
                </div>

                {/* CTA Cards - Bottom Section */}
                <div className="px-6 pb-6 space-y-4">
                    <div className="max-w-2xl mx-auto">
                        {/* Support Card */}
                        <div className="bg-card border border-border p-6 shadow-lg mb-4">
                            <div className="text-center">
                                <span className="text-base font-semibold text-muted-foreground mb-4 block">NEED HELP?</span>
                                <div className="flex items-center justify-center gap-6 mb-6">
                                    <div className="text-center">
                                        <div className="font-bold text-xl">Contact Support</div>
                                        <div className="text-muted-foreground text-sm">We're here to help you get started.</div>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="w-full"
                                    onClick={() => window.open('mailto:support@hoergen.com?subject=Subscription Help&body=Hi, I need help with my subscription.', '_blank')}
                                >
                                    <IconMail className="h-4 w-4 mr-2" />
                                    Email Support
                                </Button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <Button
                                variant="outline"
                                size="lg"
                                className="flex-1"
                                onClick={() => navigate({ to: '/subscriptions' })}
                            >
                                <IconArrowLeft className="h-4 w-4 mr-2" />
                                Try Again
                            </Button>
                            <Button
                                size="lg"
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => navigate({ to: '/' })}
                            >
                                Continue Listening
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export const Route = createFileRoute('/_authenticated/subscriptions/cancel')({
    component: SubscriptionCancel,
});
