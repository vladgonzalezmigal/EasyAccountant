// app/lib/actions/createSalesRow.ts (must be in a Server Component context)

'use server'

import { createClient } from '@/utils/supabase/server';
import { PerformCrudValidationParams, PerformCrudParams, CrudResponseData } from '../../types/operationTypes';
import { CrudOperation } from '../../types/operationTypes';
import { canPerformOperation, performCrudOperation } from '../operationUtils';

export async function postRequest(
    operation: CrudOperation,
    operationParams: PerformCrudParams,
    validationParams?: PerformCrudValidationParams,
): Promise<CrudResponseData> {
  const supabase = await createClient();
  const { data: { user },} = await supabase.auth.getUser()

  console.log("user from postRequest", user);

  if (!user || !user.id) {
    return { data: null, error: 'User id not found' };
  } 
   //  perform validation 
   const validationResult = canPerformOperation(user, operation, validationParams);

   if (typeof validationResult === 'string') {
    return { data: null, error: validationResult };
   }
   // perform operation passing in user-id  
   // if 
   const res = await performCrudOperation(operation, operationParams);

   if (typeof res === 'string') {
    return { data: null, error: res };
   }

   return { data: res.data, error: null };
}

export async function getUser(
    // operation: CrudOperation,
    // operationParams: PerformCrudParams,
): Promise<string> {
    const supabase = await createClient();
    const { data: { user },} = await supabase.auth.getUser()

    console.log("user from getRequest", user);

    if (!user || !user.id) {
        return "user id not found"
    } else {
        return user.id
    }
}