import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://ktpbubytgtebcxlbbynp.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0cGJ1Ynl0Z3RlYmN4bGJieW5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MDI0NTUsImV4cCI6MjA5MDE3ODQ1NX0.O2I8OAFyBjCX_vReNuUd2FwwAvS-NviZqgVmJw2YN_4"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    detectSessionInUrl: true,
    flowType: 'implicit',
    autoRefreshToken: true,
    persistSession: true,
  }
})