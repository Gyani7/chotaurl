import { supabase } from '@/lib/supabase';
import { nanoid } from 'nanoid';

export async function POST(req: Request) {
  const { url, password, expiry, variant } = await req.json();
  if (!url) return new Response(JSON.stringify({ error: 'URL required' }), { status: 400 });

  const shortcode = nanoid(6);

  const { error } = await supabase.from('links').insert([
    { shortcode, url, password, expiry, variant }
  ]);

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  return new Response(JSON.stringify({ shortcode, url: `${process.env.NEXT_PUBLIC_BASE_URL}/${shortcode}` }));
}
