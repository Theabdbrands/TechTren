import { create, type ApiResponse } from 'apisauce';
import { useAuthStore } from '../stores/auth-store';

export const BASE_URL = 'https://apiv2.techtren.com/api';

export interface ApiError {
    message: string;
    code?: string;
    status?: number;
}

const instance = create({
    baseURL: BASE_URL,
    // timeout: 40000,
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
    }
});

instance.axiosInstance.interceptors.request.use(
    (config) => {
        const auth = useAuthStore.getState();
        let token = auth.token;

        const storedToken =
            localStorage.getItem("authToken") ||
            sessionStorage.getItem("authToken");

        if (!token && storedToken) {
            useAuthStore.setState({
                token: storedToken,
                isAuthenticated: true
            });
            token = storedToken;
        }

        if (!token) {
            useAuthStore.getState().logout();
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }

        return config;
    },
    (error) => Promise.reject(error)
);


instance.axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error:", {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
        });

        if (error.response?.status === 401) {
            // Clear auth tokens completely
            useAuthStore.getState().logout();
            localStorage.removeItem("authToken");
            sessionStorage.removeItem("authToken");

            document.cookie.split(";").forEach((c) => {
                document.cookie = c
                    .replace(/^ +/, "")
                    .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            });

            if (!window.location.pathname.includes("/auth/sign-in")) {
                window.location.href = "/auth/sign-in";
            }
        }
        return Promise.reject(error);
    }
);

interface RequestOptions {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    data?: unknown;
    params?: unknown;
    headers?: Record<string, string>;
}

export async function request<T>({
    url,
    method = 'GET',
    data,
    params,
    headers = {},
}: RequestOptions): Promise<T> {
    const requestHeaders: Record<string, string> = { ...headers };
    if (!(data instanceof FormData)) {
        requestHeaders['Content-Type'] = 'application/json';
    }

    const response: ApiResponse<T, ApiError> = await instance.any({
        method,
        url,
        data,
        params,
        headers: requestHeaders,
    });

    if (response.ok) {
        return response.data as T;
    }

    const error: ApiError = {
        message: response.data?.message || 'An error occurred',
        code: response.data?.code,
        status: response.status,
    };

    return Promise.reject(error);
}

export const api = {
    get: <T>(url: string, params?: unknown) =>
        request<T>({ url, method: 'GET', params }),

    post: <T>(url: string, data?: unknown) =>
        request<T>({ url, method: 'POST', data }),

    put: <T>(url: string, data?: unknown) =>
        request<T>({ url, method: 'PUT', data }),

    delete: <T>(url: string) =>
        request<T>({ url, method: 'DELETE' }),

    patch: <T>(url: string, data?: unknown) =>
        request<T>({ url, method: 'PATCH', data }),
};