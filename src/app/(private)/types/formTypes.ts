export type Expense = {
    id: number;
    date: string; // Supabase returns date as string
    payment_type: string;
    detail: string;
    company: string;
    amount: number;
};

export type Sales = {
    id: number;
    date: string; // or Date, but Supabase returns it as string
    sales: number;
    taxes: number; 
};

export type Payroll = {
    id: number;
    employee_name: string; // handle repeat names 
    wage_type: string;
    wage_rate: number;
    hours: number;
};

export type FormData = Expense | Sales | Payroll;