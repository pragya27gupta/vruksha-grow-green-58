import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create a mock client that will show helpful error messages when Supabase isn't connected
const createMockSupabase = () => ({
  functions: {
    invoke: () => {
      throw new Error('Supabase not connected. Please click the green Supabase button in the top right to connect your project.')
    }
  },
  auth: {
    signUp: () => Promise.reject(new Error('Supabase not connected')),
    signIn: () => Promise.reject(new Error('Supabase not connected')),
    signOut: () => Promise.reject(new Error('Supabase not connected')),
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: null }, error: null })
  },
  from: () => ({
    select: () => Promise.reject(new Error('Supabase not connected')),
    insert: () => Promise.reject(new Error('Supabase not connected')),
    update: () => Promise.reject(new Error('Supabase not connected')),
    delete: () => Promise.reject(new Error('Supabase not connected'))
  })
})

// Check if Supabase environment variables are available
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment variables are not configured. Please connect your Lovable project to Supabase.')
  console.error('Missing:', {
    VITE_SUPABASE_URL: supabaseUrl ? '✓' : '✗',
    VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? '✓' : '✗'
  })
}

// Export the appropriate client
export const supabase = (!supabaseUrl || !supabaseAnonKey) 
  ? createMockSupabase() as any
  : createClient(supabaseUrl, supabaseAnonKey)