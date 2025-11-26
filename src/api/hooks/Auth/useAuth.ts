import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/auth-store';
import { api } from '../../helpers/request';
import type { MutationConfig } from '../../helpers/client';
import { useNavigate } from 'react-router-dom';

interface LoginData {
    email: string;
    password: string;
}


interface RegisterData {
    email: string;
    password: string;
    user_name: string;
}

interface ForgotPasswordData {
    email: string;
}

interface User {
    id: string;
    email: string;
    user_name: string;
    first_name?: string | null;
    last_name?: string | null;
    role?: string;
    subscription?: string;
    isVerifiedEmail?: boolean;
}

interface AuthResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
        access_token: string;
        user: User;
    };
}

interface BaseResponse {
    message: string;
    success: boolean;
}

interface ResetPasswordData {
    token: string;
    newPassword: string;
}

interface ResendVerificationData {
    email: string;
}

interface VerifyEmailData {
    token: string;
}

interface VerifyEmailResponse {
    access_token: string;
    user: User;
}

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Stripe payment links
const STRIPE_LINKS = {
    expert: 'https://buy.stripe.com/aFa3cv9rK9qgcyVcv128802',
    unlimited: 'https://buy.stripe.com/dRm00j47q9qggPbbqX28801',
};

export const useLogin = (config?: MutationConfig<(data: LoginData) => Promise<AuthResponse>>) => {
    const { login } = useAuthStore();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (data: LoginData) =>
            api.post<AuthResponse>('/auth/login', data),
        onSuccess: async (response) => {
            const token = response.data.access_token;
            const user = response.data.user;

            login(token, user);
            queryClient.invalidateQueries();

            await delay(3000);

            navigate('/dashboard');
        },
        ...config,
    });
};

export const useRegister = (config?: MutationConfig<(data: RegisterData) => Promise<AuthResponse>>) => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (data: RegisterData) =>
            api.post<AuthResponse>('/auth/register', data),
        onSuccess: async () => {
            await delay(1500);

            const storedPlan = sessionStorage.getItem('subscriptionPlan');

            if (storedPlan && storedPlan !== 'basic') {
                const stripeLink = STRIPE_LINKS[storedPlan as keyof typeof STRIPE_LINKS];
                if (stripeLink) {
                    sessionStorage.removeItem('subscriptionPlan');
                    window.location.href = stripeLink;
                    return;
                }
            }

            if (!storedPlan) {
                navigate('/post-signup-pricing');
            } else {
                sessionStorage.removeItem('subscriptionPlan');
                navigate('/auth/sign-in');
            }
        },
        ...config,
    });
};


export const useLogout = () => {
    const navigate = useNavigate();
    const { logout } = useAuthStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => api.post('/auth/logout'),
        onSuccess: async () => {
            logout();
            queryClient.clear();
            await delay(1500);
            navigate('/auth/sign-in');
        },
    });
};

export const useForgotPassword = (config?: MutationConfig<(data: ForgotPasswordData) => Promise<BaseResponse>>) => {
    return useMutation({
        mutationFn: (data: ForgotPasswordData) =>
            api.post<BaseResponse>('/auth/forgot-password', data),
        ...config
    });
};

export const useResetPassword = (config?: MutationConfig<(data: ResetPasswordData) => Promise<BaseResponse>>) => {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: (data: ResetPasswordData) =>
            api.post<BaseResponse>('/auth/reset-password', {
                token: data.token,
                newPassword: data.newPassword
            }),
        onSuccess: async () => {
            await delay(1500);
            navigate('/auth/sign-in');
        },
        ...config
    });
};

export const useVerifyEmail = (config?: MutationConfig<(data: VerifyEmailData) => Promise<VerifyEmailResponse>>) => {
    const { login } = useAuthStore();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (data: VerifyEmailData) =>
            api.post<VerifyEmailResponse>('/auth/verify-email', data),
        onSuccess: async (response) => {
            const token = response.access_token;
            const user = response.user;

            login(token, user);
            queryClient.invalidateQueries();

            await delay(1000);

            navigate('/dashboard');
        },
        ...config,
    });
};

export const useResendVerification = (config?: MutationConfig<(data: ResendVerificationData) => Promise<BaseResponse>>) => {
    return useMutation({
        mutationFn: (data: ResendVerificationData) =>
            api.post<BaseResponse>('/auth/resend-verification', data),
        ...config,
    });
};