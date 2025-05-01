'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { AuthFormData } from '../(public)/utils/formValidation'

import { createClient } from '@/utils/supabase/server'

export async function login(loginFormData: AuthFormData): Promise<{ success: false; error: string } | void> {
  const supabase = await createClient()

  const data = {
    email: loginFormData.email,
    password: loginFormData.password,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  // Handle Supabase error explicitly
  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/selection', 'layout')
//   redirect('/selection')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}