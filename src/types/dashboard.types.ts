export interface StockData {
    symbol: string;
    name: string;
    price: string;
    change: string;
    positive: boolean;
}

export interface Post {
    id: number;
    title: string;
    metric?: string;
    icon: string;
}

export interface MenuItem {
    path: string;
    icon: React.ComponentType<{ size?: number }>;
    label: string;
}