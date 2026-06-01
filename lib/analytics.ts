import { supabase } from './supabase';

export async function logClick(shortcode: string, ip: string, ua: string, country?: string) {
  await supabase.from('analytics').insert([
    { shortcode, ip, user_agent: ua, country, timestamp: new Date() }
  ]);
}
