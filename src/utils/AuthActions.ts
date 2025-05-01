'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { AuthFormData } from '../app/(public)/utils/formValidation'

import { createClient } from '@/utils/supabase/server'

// This file assumes redirect is handled by caller 

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


export async function signOut(): Promise<{ error?: string } | void> {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut();
  if (error) {
    return { error: error.message };
  }
}