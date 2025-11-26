import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/api/stores/auth-store';
import { api, BASE_URL } from '@/api/helpers/request';
import type { MutationConfig, QueryConfig } from '@/api/helpers/client';
import type {
    UpdateProfileRequest,
    UpdateProfileResponse,
    ChangePasswordRequest,
    UpdatePreferencesRequest,
    UploadAssetResponse,
} from '@/types/user.types';
import { useNavigate } from 'react-router-dom';

export const userKeys = {
    all: ['user'] as const,
    profile: () => [...userKeys.all, 'profile'] as const,
    preferences: () => [...userKeys.all, 'preferences'] as const,
    assets: () => [...userKeys.all, 'assets'] as const,
};

export const useUserProfile = (config?: QueryConfig<typeof api.get>) => {
    const { isAuthenticated, user } = useAuthStore();

    return useQuery({
        queryKey: userKeys.profile(),
        queryFn: async () => {
            const response: any = await api.get('/users/profile');
            return response.data || response;
        },
        enabled: isAuthenticated && !!user,
        staleTime: 5 * 60 * 1000,
        ...config,
    });
};

export const useUpdateProfile = (
    config?: MutationConfig<(data: { userId: string; profile: UpdateProfileRequest }) => Promise<UpdateProfileResponse>>
) => {
    const { setUser, user } = useAuthStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, profile }) =>
            api.put<UpdateProfileResponse>(`/users/${userId}/profile`, profile),
        onSuccess: (response: any) => {
            const responseData = response.data || response;
            if (user) {
                setUser({
                    ...user,
                    user_name: responseData.username || responseData.user_name || user.user_name,
                    first_name: responseData.first_name || user.first_name,
                    last_name: responseData.last_name || user.last_name,
                });
            }
            queryClient.invalidateQueries({ queryKey: userKeys.profile() });
        },
        ...config,
    });
};

export const useChangePassword = (
    config?: MutationConfig<(data: ChangePasswordRequest) => Promise<any>>
) => {
    return useMutation({
        mutationFn: (data: ChangePasswordRequest) =>
            api.post('/users/change-password', data),
        ...config,
    });
};

export const useUpdatePreferences = (
    config?: MutationConfig<(data: UpdatePreferencesRequest) => Promise<any>>
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdatePreferencesRequest) =>
            api.put('/users/preferences', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.preferences() });
            queryClient.invalidateQueries({ queryKey: userKeys.profile() });
        },
        ...config,
    });
};

export const useUploadAsset = (
    config?: MutationConfig<(data: { userId: string; file: File; assetType?: 'PROFILE_PIC' | 'BANNER' | 'VIDEO' }) => Promise<UploadAssetResponse>>
) => {
    const queryClient = useQueryClient();
    const { setUser, user } = useAuthStore();

    return useMutation({
        mutationFn: async ({ userId, file, assetType = 'PROFILE_PIC' }) => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('asset_type', assetType);

            const response = await fetch(`${BASE_URL}/users/${userId}/assets/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken') || sessionStorage.getItem('authToken')}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            return response.json();
        },
        onSuccess: (response) => {
            if (response.asset_type === 'PROFILE_PIC' && user) {
                setUser({
                    ...user,
                    avatar: response.url,
                });
            }

            queryClient.invalidateQueries({ queryKey: userKeys.profile() });
            queryClient.invalidateQueries({ queryKey: userKeys.assets() });
        },
        ...config,
    });
};


export const useDeleteUser = (
    config?: MutationConfig<(userId: string) => Promise<void>>
) => {
    const { logout } = useAuthStore();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (userId: string) =>
            api.delete<void>(`/users/${userId}`),
        onSuccess: () => {
            logout();

            queryClient.clear();
            navigate('/');
        },
        onError: (error: any) => {
            // Handle specific error cases if needed
            if (error?.status === 403) {
                console.error('Forbidden: Attempting to delete another user account');
            } else if (error?.status === 401) {
                console.error('Unauthorized: Invalid or expired token');
            }
        },
        ...config,
    });
};