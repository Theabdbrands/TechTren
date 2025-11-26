import React, { createContext, useContext, useEffect, type ReactNode } from 'react';

export type TopbarVariant = "default" | "charts" | "watchlist" | "charts" | "account-settings" | "predictions" | "journal" | "news" | "settings" | "prediction";

interface TopbarContextType {
    variant: TopbarVariant;
    setVariant: (variant: TopbarVariant) => void;
}

const TopbarContext = createContext<TopbarContextType | undefined>(undefined);

export const TopbarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [variant, setVariant] = React.useState<TopbarVariant>('default');

    return (
        <TopbarContext.Provider value={{ variant, setVariant }}>
            {children}
        </TopbarContext.Provider>
    );
};


export const useTopbar = () => {
    const context = useContext(TopbarContext);
    if (!context) {
        throw new Error('useTopbar must be used within TopbarProvider');
    }
    return context;
};


export const useSetTopbar = (variant: TopbarVariant) => {
    const { setVariant } = useTopbar();

    useEffect(() => {
        setVariant(variant);
    }, [variant, setVariant]);
};