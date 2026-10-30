import { createClient } from '@supabase/supabase-js'

// FIX: Switched from Vite-specific `import.meta.env.VITE_*` to `process.env.REACT_APP_*`
// to resolve TypeScript errors and align with environment variable conventions used in other service files.
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://xhryczkrddsawksqxgrx.supabase.co'
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'placeholder-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)
