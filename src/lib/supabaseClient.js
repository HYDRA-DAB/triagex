import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://ktpbubytgtebcxlbbynp.supabase.co"
const supabaseAnonKey = "sb_publishable_5oEZ3l6mERtfoSADnE-5WA_rXuxWozs"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)