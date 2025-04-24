export type Expense = {
    date: string; // Supabase returns date as string
    payment_type: string;
    detail: string;
    company: string;
    amount: number;
};

export type Sales = {
    date: string; // or Date, but Supabase returns it as string
    sales: number;
    taxes: number; 
};

export type FormData = Expense | Sales;