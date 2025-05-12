// supabase/logger.js

const supabaseUrl = 'https://emqigcovjkfupxnjakss.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtcWlnY292amtmdXB4bmpha3NzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3OTE1MTEsImV4cCI6MjA2MjM2NzUxMX0.3Kh8C02mEgRRrp52l8JKRYmViFyPDP-Lzr-40WEq-FQ';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

export async function logYoutubePlay(command, title, url, mood = 'neutral') {
  const { error } = await supabase.from('youtube_logs').insert([
    {
      user_id: 'larry150',
      command: command,
      video_title: title,
      video_url: url,
      mood: mood,
    }
  ]);
  
  if (error) {
    console.error('[Jarvis][Supabase] Log Error:', error);
  } else {
    console.log('[Jarvis][Supabase] Action logged successfully.');
  }
}
