import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oujbzwwijskbdaufevzy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91amJ6d3dpanNrYmRhdWZldnp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NTkzODEsImV4cCI6MjA2NDIzNTM4MX0.uSKfTtw2bSPcJ6S0t4QMVpwt84NskV65RxPeaTQ0TbE';

export const supabase = createClient(supabaseUrl, supabaseKey);