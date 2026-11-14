import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ixlxyrhrmuawijsavnwt.supabase.co';
export const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4bHh5cmhybXVhd2lqc2F2bnd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQwMzA4NTcsImV4cCI6MjEwOTYwNjg1N30.xkHgleE2aQ7ggZQQwMlb9t63bKmhkrfaYPFQRawP4kk';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false }
});

console.log('⚡ Supabase Client initialized for RushX:', SUPABASE_URL);
