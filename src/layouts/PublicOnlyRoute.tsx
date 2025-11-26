import { useAuthStore } from '@/api/stores/auth-store';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface PublicOnlyRouteProps {
    children: React.ReactNode;
}

export const PublicOnlyRoute = ({ children }: PublicOnlyRouteProps) => {
    const { isAuthenticated, token } = useAuthStore();
    const location = useLocation();
    const [shouldRedirect, setShouldRedirect] = useState(false);

    useEffect(() => {
        if (isAuthenticated && token !== undefined) {
            const timer = setTimeout(() => {
                setShouldRedirect(true);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [isAuthenticated, token]);

    if (shouldRedirect) {
        const from = location.state?.from?.pathname || '/dashboard';
        return <Navigate to={from} replace />;
    }

    return <>{children}</>;
};

export const PublicLayout = () => (
    <>
        <Navbar />
        <Outlet />
        <Footer />
    </>
);