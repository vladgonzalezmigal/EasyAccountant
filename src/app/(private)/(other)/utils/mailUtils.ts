import { getRequest } from "../../features/handleForms/utils/actions/crudOps";
import { formatSalesData } from "../../features/handleForms/utils/formDataDisplay/formDataDisplay";
import { Sales, Payroll, Expense } from "../../types/formTypes";

/**
 * Fetches sales data for a specific store within a date range
 * @param store_id - The ID of the store to fetch sales data for
 * @param startDate - The start date for the sales data range
 * @param endDate - The end date for the sales data range (exclusive)
 * @returns Promise with the sales data or error
 */
export const fetchSalesData = async (
  store_id: string | number,
  startDate: string,
  endDate: string
) => {
  try {
    const storeId = typeof store_id === 'string' ? parseInt(store_id) : store_id;
    const dataType = { id: -1, store_id: storeId, date: '', sales: 0, taxes: 0 };
    
    const readRes = await getRequest({ 
      tableName: 'sales', 
      dataType, 
      startDate, 
      endDate 
    });
    
    if (typeof readRes !== 'string' && !readRes.data) {
      return { error: readRes.error, data: null };
    } else if (typeof readRes !== 'string' && readRes.data) {
      return { 
        error: null, 
        data: readRes.data,
        displayData: formatSalesData(readRes.data as Sales[])
      };
    }
    
    return { error: 'Unknown error occurred', data: null };
  } catch (error) {
    return { 
      error: error instanceof Error ? error.message : 'An unexpected error occurred', 
      data: null 
    };
  }
};

/**
 * Fetches payroll data within a date range
 * @param startDate - The start date for the payroll data range
 * @param endDate - The end date for the payroll data range (exclusive)
 * @returns Promise with the payroll data or error
 */
export const fetchPayrollData = async (
  startDate: string,
  endDate: string
) => {
  try {
    const dataType = { 
      id: -1, 
      end_date: '', 
      employee_name: '', 
      wage_type: 'salary', 
      wage_rate: -1, 
      hours: 0, 
      minutes: 0, 
      total_pay: 0 
    } as Payroll;
    
    const readRes = await getRequest({ 
      tableName: 'payroll', 
      dataType, 
      startDate, 
      endDate 
    });
    
    if (typeof readRes !== 'string' && !readRes.data) {
      return { error: readRes.error, data: null };
    } else if (typeof readRes !== 'string' && readRes.data) {
      return { 
        error: null, 
        data: readRes.data as Payroll[]
      };
    }
    
    return { error: 'Unknown error occurred', data: null };
  } catch (error) {
    return { 
      error: error instanceof Error ? error.message : 'An unexpected error occurred', 
      data: null 
    };
  }
};

/**
 * Fetches expense data within a date range
 * @param startDate - The start date for the expense data range
 * @param endDate - The end date for the expense data range (exclusive)
 * @returns Promise with the expense data or error
 */
export const fetchExpenseData = async (
  startDate: string,
  endDate: string
) => {
  try {
    const dataType = { 
      id: -1, 
      date: '', 
      payment_type: 'CHECK', 
      detail: '', 
      company: -1, 
      amount: 0 
    } as Expense;
    
    const readRes = await getRequest({ 
      tableName: 'expenses', 
      dataType, 
      startDate, 
      endDate 
    });
    
    if (typeof readRes !== 'string' && !readRes.data) {
      return { error: readRes.error, data: null };
    } else if (typeof readRes !== 'string' && readRes.data) {
      return { 
        error: null, 
        data: readRes.data as Expense[]
      };
    }
    
    return { error: 'Unknown error occurred', data: null };
  } catch (error) {
    return { 
      error: error instanceof Error ? error.message : 'An unexpected error occurred', 
      data: null 
    };
  }
};
