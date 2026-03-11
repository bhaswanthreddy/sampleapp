import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://ozscmuviswmqotbtqdku.supabase.co"
const supabaseAnonKey = "sb_publishable__t6DO5jL9dlYFwBa9C-kaw_KLPkv-JX"

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
)