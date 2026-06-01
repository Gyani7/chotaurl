'use client';
import { supabase } from '@/lib/supabase';
import StatsCard from '@/components/StatsCard';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import QRCode from 'react-qr-code';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [links, setLinks] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: linksData } = await supabase.from('links').select('*');
      const { data: analyticsData } = await supabase.from('analytics').select('*');
      setLinks(linksData || []);
      setAnalytics(analyticsData || []);
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold neon-text mb-6">Your Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard title="Total Clicks" value={analytics.length.toString()} />
        <StatsCard title="Links Created" value={links.length.toString()} />
        <StatsCard title="Countries" value="220+" />
      </div>

      <div className="mt-10">
        <h2 className="text-2xl mb-4">Click Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analytics}>
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="shortcode" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl mb-4">Your Links</h2>
        <ul>
          {links?.map(link => (
            <li key={link.shortcode} className="mb-4">
              {link.url} → {process.env.NEXT_PUBLIC_BASE_URL}/{link.shortcode}
              <div className="mt-2">
                <QRCode value={`${process.env.NEXT_PUBLIC_BASE_URL}/${link.shortcode}`} size={128} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
