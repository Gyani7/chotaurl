import { supabase } from '@/lib/supabase';
import { logClick } from '@/lib/analytics';

export default async function RedirectPage({ params }: { params: { shortcode: string } }) {
  const { data } = await supabase.from('links').select('*').eq('shortcode', params.shortcode).single();

  if (!data) return <h1>Not Found</h1>;
  if (data.expiry && new Date(data.expiry) < new Date()) return <h1>Link Expired</h1>;

  logClick(params.shortcode, 'server-ip', 'server-ua', 'IN');

  if (typeof window !== 'undefined') {
    window.location.href = data.url;
  }

  return <p>Redirecting...</p>;
}
