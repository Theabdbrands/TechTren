import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    email: string;
    user_name: string;
    avatar?: string;
    first_name?: string | null;
    last_name?: string | null;
    role?: string;
    subscription?: string;
    isVerifiedEmail?: boolean;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    rememberMe?: boolean;
    login: (token: string, user: User, rememberMe?: boolean) => void;
    logout: () => void;
    setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            rememberMe: false,
            avatar: null,
            login: (token: string, user: User, rememberMe: boolean = false) => {
                if (rememberMe) {
                    localStorage.setItem('authToken', token);
                    sessionStorage.removeItem('authToken');
                } else {
                    sessionStorage.setItem('authToken', token);
                    localStorage.removeItem('authToken');
                }
                set({ token, user, isAuthenticated: true, rememberMe });
            },
            logout: () => {
                localStorage.removeItem('authToken');
                sessionStorage.removeItem('authToken');
                // Clear remembered credentials on logout when needed
                // localStorage.removeItem('rememberedEmail');
                // localStorage.removeItem('rememberedPassword');
                set({ token: null, user: null, isAuthenticated: false, rememberMe: false });

            },
            setUser: (user: User) => set({ user }),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
                rememberMe: state.rememberMe,
            }),
        }
    )
);