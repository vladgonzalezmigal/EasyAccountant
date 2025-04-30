import { useState } from 'react';
import { Expense } from '@/app/(private)/types/formTypes';
import { performCrudOperation, canPerformOperation } from '../utils/operationUtils';
import { SessionState } from '@/types/authTypes';

// export type 
type expenseFormCrudHandlers = {
  handleSubmitCreate: (e: React.FormEvent<HTMLFormElement>, newExpense: Expense) => Promise<void>;
  handleSubmitDelete: (rowsToDelete: number[]) => Promise<void>;
  handleSubmitEdit: (editedRows: Expense[], validationErrors: Record<number, Set<number>>) => Promise<void>;
  cudLoading: boolean;
  cudError: string | null;
};


type UseFormCrudProps = {
  session: SessionState;
  setExpenses: (React.Dispatch<React.SetStateAction<(Expense[] | null)>>);
  setEditedRows: React.Dispatch<React.SetStateAction<Expense[]>>;
  setValidationErrors: React.Dispatch<React.SetStateAction<Record<number, Set<number>>>>;
  setRowsToDelete: React.Dispatch<React.SetStateAction<number[]>>;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  setDeleteMode: React.Dispatch<React.SetStateAction<boolean>>;
  tableName: string;
};

export function useFormCrud({
  session,
  setExpenses,
  setEditedRows,
  setValidationErrors,
  setRowsToDelete,
  setEditMode,
  setDeleteMode,
  tableName = 'expenses',
}: UseFormCrudProps): expenseFormCrudHandlers {
  const [cudLoading, setCudLoading] = useState(false);
  const [cudError, setCudError] = useState<string | null>(null);

  const handleSubmitCreate = async (e: React.FormEvent<HTMLFormElement>, newRow: Expense) => {
    e.preventDefault();

    const validationResult = canPerformOperation(session, 'create');

    if (typeof validationResult === 'string') {
      setCudError(validationResult);
      return;
    }

    setCudLoading(true);
    setCudError(null);

    const createRes = await performCrudOperation('create', {
      tableName,
      createData: newRow,
      user_id: validationResult.user.id,
    });

    if (typeof createRes !== 'string' && createRes.data) {
      if (tableName === 'expenses' && setExpenses) {
        const newExpense = createRes.data as Expense[];
        setExpenses((prevExpenses) =>
          [...(prevExpenses || []), newExpense[0]].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
        );
      }
    } else {
      setCudError(typeof createRes === 'string' ? createRes : createRes.error);
    }
    setCudLoading(false);
  };

  const handleSubmitDelete = async (rowsToDelete: number[]) => {
    const validationResult = canPerformOperation(session, 'delete', { rowsToDelete });
    if (typeof validationResult === 'string') {
      setCudError(validationResult);
      return;
    }

    setCudLoading(true);
    setCudError(null);

    const deleteRes = await performCrudOperation('delete', { tableName, rowsToDelete });

    if (typeof deleteRes !== 'string' && deleteRes.data) {
      const expenseData = deleteRes.data as Expense[];
      const deletedIds: number[] = expenseData.map((expense: Expense) => expense.id);
      if (tableName === 'expenses' && setExpenses) {
        setExpenses((prevExpenses) =>
          prevExpenses ? prevExpenses.filter(expense => !deletedIds.includes(expense.id)) : null
        );
      }
      setRowsToDelete([]);
      setDeleteMode(false);
    } else {
      setCudError(typeof deleteRes === 'string' ? deleteRes : deleteRes.error);
    }
    setCudLoading(false);
  };

  const handleSubmitEdit = async (
    editedRows: Expense[],
    validationErrors: Record<number, Set<number>>
  ) => {
    const validationResult = canPerformOperation(session, 'update', { editedRows, validationErrors });

    if (typeof validationResult === 'string') {
      setCudError(validationResult);
      return;
    }

    setCudLoading(true);
    setCudError(null);

    const updateRes = await performCrudOperation('update', {
      tableName,
      editedRows,
      user_id: validationResult.user.id,
    });

    if (typeof updateRes !== 'string' && updateRes.data) {
      const updateData = updateRes.data as Expense[];

      setExpenses((prevExpenses) => {
        if (!prevExpenses) return updateData;

        // Create a map of updated expenses by ID for quick lookup
        const updatedExpensesMap = new Map(
          updateData.map(expense => [expense.id, expense])
        );

        // Replace existing expenses with updated ones based on ID
        return prevExpenses.map(expense =>
          updatedExpensesMap.has(expense.id)
            ? updatedExpensesMap.get(expense.id)!
            : expense
        );
      });
      // clear edit form state 
      setEditedRows([]);
      setValidationErrors({});
      setEditMode(false);
    } else {
      setCudError(typeof updateRes === 'string' ? updateRes : updateRes.error);
    }
    setCudLoading(false);
  };

  return {
    handleSubmitCreate,
    handleSubmitDelete,
    handleSubmitEdit,
    cudLoading,
    cudError,
  };
}

export default useFormCrud;