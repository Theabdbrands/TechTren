import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/api/stores/auth-store';
import { useQueryClient } from '@tanstack/react-query';

const AfterCheckout = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const queryClient = useQueryClient();
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        const sessionId = searchParams.get('session_id');

        sessionStorage.removeItem('subscriptionPlan');
        sessionStorage.removeItem('checkoutInProgress');

        if (sessionId) {
            toast.success('Payment Successful!', {
                description: 'Your subscription is being activated. Welcome aboard!'
            });

            if (isAuthenticated) {
                queryClient.invalidateQueries({ queryKey: ['user'] });
                queryClient.invalidateQueries({ queryKey: ['subscription'] });
            }
        }

        const timer = setTimeout(() => {
            navigate('/auth/sign-in', { replace: true });
        }, 2000);

        return () => clearTimeout(timer);
    }, [searchParams, navigate, isAuthenticated, queryClient]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#06040C]">
            <div className="text-center space-y-6 max-w-md mx-auto px-4">
                <div className="flex justify-center">
                    <div className="relative">
                        <CheckCircle2 className="w-20 h-20 text-[#14E893] animate-pulse" />
                        <div className="absolute inset-0 bg-[#14E893] blur-xl opacity-50 animate-pulse"></div>
                    </div>
                </div>

                <div className="space-y-2">
                    <h2 className="text-3xl font-semibold text-white">
                        Payment Successful!
                    </h2>
                    <p className="text-gray-400">
                        Thank you for subscribing. You will be redirected to login shortly.
                    </p>
                </div>

                <div className="flex items-center justify-center gap-2 text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Redirecting to login...</span>
                </div>
            </div>
        </div>
    );
};

export default AfterCheckout;