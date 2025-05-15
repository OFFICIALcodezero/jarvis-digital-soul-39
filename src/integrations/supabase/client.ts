
import { createClient } from '@supabase/supabase-js';

// Create Supabase client
export const supabase = createClient(
  'https://emqigcovjkfupxnjakss.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtcWlnY292amtmdXB4bmpha3NzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3OTE1MTEsImV4cCI6MjA2MjM2NzUxMX0.3Kh8C02mEgRRrp52l8JKRYmViFyPDP-Lzr-40WEq-FQ'
);
