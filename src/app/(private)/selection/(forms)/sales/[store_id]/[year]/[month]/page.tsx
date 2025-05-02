"use client";

import { useParams } from "next/navigation";
import { useStore } from "@/store";
import TablePageTitle from "@/app/(private)/features/handleForms/components/TablePageTitle";
import { getMonthDateRange } from "@/app/(private)/utils/dateUtils";
import { useEffect, useState } from "react";
import { Sales, SalesDisplay } from "@/app/(private)/types/formTypes";
import { performCrudOperation } from "@/app/(private)/features/handleForms/utils/operationUtils";
import { FormDataRows } from "@/app/(private)/features/handleForms/components/FormDataRows";
import TableHeader from "@/app/(private)/features/handleForms/components/TableHeader";
import { formatSalesData } from "@/app/(private)/features/handleForms/utils/formDataDisplay/formDataDisplay";
import SalesForm from "@/app/(private)/features/handleForms/components/addDataRow/SalesForm";

export default function SalesFormPage() {
    const { store_id, year, month } = useParams();
    const { storeState } = useStore();
    const { stores } = storeState;
    
    let store_name = stores?.find((store) => store.id === parseInt(store_id as string))?.store_name;
    if (!store_name) {
        store_name = "searching...";
    }

    // fetch state, 
    const [fetchLoading, setFetchLoading] = useState(true);
    const { startDate, endDate } = getMonthDateRange(year as string, month as string); // End Date is exclusive 
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [sales, setSales] = useState<Sales[] | null>(null); // appended amount calculated in parent & 
    const [salesDisplay, setSalesDisplay] = useState<SalesDisplay[] | null>(null);
    // update mode state 
    const [editMode, setEditMode] = useState<boolean>(false);
    const [editedRows, setEditedRows] = useState<Sales[]>([]);
    const [validationErrors, setValidationErrors] = useState<Record<number, Set<number>>>({});
    const editSalesRowValidation = (key: keyof Sales, value: string) => {
        // return validateExpenseInput(key, value, parseInt(month as string), parseInt(year as string));
        return {isValid: true, value: value}; // TODO  
    }
    const newRowToEditInputChange = (id: number, key: keyof Sales, value: string | number, colNumber: number) => {
        // need to add form validation 
    }
     // delete mode state 
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [rowsToDelete, setRowsToDelete] = useState<number[]>([]);

    const newRowToDelete = (id: number) => {
        setRowsToDelete((prevRows) => {
            return prevRows.includes(id)
                ? prevRows.filter(rowId => rowId !== id) // Remove the id if it's already in the array
                : [...prevRows, id]; // Add the id if it's not in the array
        });
    }

    useEffect(() => {
        const fetchSales = async () => {
            const dataType = { id: -1, store_id: parseInt(store_id as string), date: '', sales: 0, taxes: 0 } as Sales;
            const readRes = await performCrudOperation('read', { tableName: 'sales', dataType: dataType, startDate, endDate });
            if (typeof readRes !== 'string' && !readRes.data) {
                setFetchError(readRes.error);
                return;
            } else if (typeof readRes !== 'string' && readRes.data) {
                setSales(readRes.data as Sales[]);
                setSalesDisplay(formatSalesData(readRes.data as Sales[])); // data passed in descending order
                console.log("formatted readRes from sales is", formatSalesData(readRes.data as Sales[]))
            }
            console.log("readRes from sales is", readRes)
            setFetchLoading(false);
        }
        fetchSales();
    }, [startDate, endDate, store_id]);

    if (fetchLoading) {
        return <div>Loading...</div>;
    }    

    const headerTitles = ["Date", "Sales", "Taxes", "Daily ", "Total"];

    return (
        <div>
            <TablePageTitle docTitle={`Sales`} docSubtitle={store_name} />
            {fetchError ? <div>{fetchError}</div> :
              <div className="w-full flex flex-col gap-4 justify-center items-center mb-8">
              <div className="">
                  {/* Table Header */}
                  <TableHeader headerTitles={headerTitles} />
                  {
                     (sales && !fetchError) ?
                      // Table Data Rows
                      <div>
                         <div className="relative z-10 border border-[#ECECEE] table-input-shadow border-y-2 border-t-0 bg-[#FDFDFD] rounded-bottom  relative z-0">
                            { salesDisplay && 
                            <FormDataRows
                            data={salesDisplay}
                            deleteConfig={{ 
                                mode: deleteMode,
                                rows: rowsToDelete,
                                onRowSelect: newRowToDelete
                            }}
                            editConfig={{mode: editMode,
                            editedRows: editedRows,
                            validationErrors: validationErrors,
                            validationFunction: editSalesRowValidation,
                            onRowEdit: newRowToEditInputChange,
                            }}
                            colToSum={5}
                            addRowForm={<SalesForm/>}
                        />}
                            
                        </div>
                         
                      </div>
                      :
                      <p>No expenses found</p>
                      }
              </div>
          </div>
             }
        </div>
    )
}