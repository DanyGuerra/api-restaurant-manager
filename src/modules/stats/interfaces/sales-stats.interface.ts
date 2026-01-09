export interface SalesStats {
    total_sales: number;
    total_orders: number;
    top_products: { name: string; quantity: number, id: string }[];
    top_options: { name: string; quantity: number, id: string }[];
}


export interface DailySalesData {
    date: string;
    total_sales: number;
}

export interface BestDayStats {
    date: string;
    revenue: number;
}

export interface DailySalesSummary {
    total_revenue: number;
    avg_daily: number;
    best_day: BestDayStats;
}

export interface DailySalesResponse {
    summary: DailySalesSummary;
    data: DailySalesData[];
}
