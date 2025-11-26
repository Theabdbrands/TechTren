import { useAuthStore } from '@/api/stores/auth-store';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
    children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const { isAuthenticated, token } = useAuthStore();

    if (!isAuthenticated || !token) {
        return <Navigate to="/auth/sign-in" />;
    }


    return <>{children}</>;
};

export default PrivateRoute;