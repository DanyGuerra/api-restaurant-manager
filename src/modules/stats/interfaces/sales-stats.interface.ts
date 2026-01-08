export interface SalesStats {
    total_sales: number;
    total_orders: number;
    top_products: { name: string; quantity: number, id: string }[];
    top_options: { name: string; quantity: number, id: string }[];
}

