'use client';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

export default function AdminPanel() {
  const [links, setLinks] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [countryStats, setCountryStats] = useState<any[]>([]);
  const [deviceStats, setDeviceStats] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: linksData } = await supabase.from('links').select('*');
      const { data: analyticsData } = await supabase.from('analytics').select('*');
      setLinks(linksData || []);
      setAnalytics(analyticsData || []);

      // Aggregate country stats
      const countries: Record<string, number> = {};
      analyticsData?.forEach(a => {
        const country = a.country || 'Unknown';
        countries[country] = (countries[country] || 0) + 1;
      });
      setCountryStats(Object.entries(countries).map(([name, value]) => ({ name, value })));

      // Aggregate device stats
      const devices: Record<string, number> = {};
      analyticsData?.forEach(a => {
        const ua = a.user_agent || 'Unknown';
        const device = ua.includes('Mobile') ? 'Mobile' : ua.includes('Tablet') ? 'Tablet' : 'Desktop';
        devices[device] = (devices[device] || 0) + 1;
      });
      setDeviceStats(Object.entries(devices).map(([name, value]) => ({ name, value })));
    };
    fetchData();
  }, []);

  const banLink = async (shortcode: string) => {
    await supabase.from('links').update({ banned: true }).eq('shortcode', shortcode);
    setLinks(links.map(l => l.shortcode === shortcode ? { ...l, banned: true } : l));
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold neon-text mb-6">Admin Dashboard</h1>

      <div className="mb-6">
        <CSVLink data={analytics} filename="analytics.csv" className="bg-purple-600 px-4 py-2 rounded">
          Export Analytics CSV
        </CSVLink>
      </div>

      <h2 className="text-2xl mb-4">All Links</h2>
      <table className="w-full text-left border border-purple-500">
        <thead>
          <tr>
            <th>Shortcode</th>
            <th>URL</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {links.map(link => (
            <tr key={link.shortcode} className="border-t border-purple-500">
              <td>{link.shortcode}</td>
              <td>{link.url}</td>
              <td>{link.banned ? 'Banned' : 'Active'}</td>
              <td>
                {!link.banned && (
                  <button
                    onClick={() => banLink(link.shortcode)}
                    className="bg-red-600 px-3 py-1 rounded"
                  >
                    Ban
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-2xl mt-10 mb-4">Country-wise Analytics</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={countryStats} dataKey="value" nameKey="name" outerRadius={120}>
            {countryStats.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <h2 className="text-2xl mt-10 mb-4">Device Stats</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={deviceStats} dataKey="value" nameKey="name" outerRadius={120}>
            {deviceStats.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
