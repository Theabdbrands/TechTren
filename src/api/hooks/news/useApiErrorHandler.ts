import { useCallback } from 'react';
import { toast } from 'sonner';


export const useApiErrorHandler = () => {
    const handleApiError = useCallback((error: any) => {
        const status = error?.status;
        const message = error?.message || 'An unexpected error occurred';

        switch (status) {
            case 403:
                toast.error('API quota exceeded or access denied. Please try again later.');
                break;
            case 429:
                toast.error('Rate limit exceeded. Please slow down your requests.');
                break;
            case 401:
                toast.error('Authentication required. Please log in again.');
                break;
            case 500:
                toast.error('Server error. Please try again later.');
                break;
            default:
                toast.error(message);
        }
    }, []);

    return { handleApiError };
};