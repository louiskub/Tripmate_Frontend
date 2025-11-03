"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ChartCard({ title, subtitle, data }) {
  const dataKey = data?.[0]?.bookings ? 'bookings' : 'earnings';

  return (
    // --- ✅ [แก้ไข] เพิ่ม h-full เข้าไปตรงนี้ ---
    <div className="flex flex-col p-6 pb-10 bg-white rounded-xl border border-neutral-200 shadow-sm h-full">
      <div>
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      
      <div className="flex-1 mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={dataKey === 'bookings' ? 'day' : 'month'} tick={{ fontSize: 12 }} stroke="#888888" />
            <YAxis tick={{ fontSize: 12 }} stroke="#888888" />
            <Tooltip cursor={{ fill: 'rgba(239, 246, 255, 0.5)' }} contentStyle={{ background: 'white', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }} />
            <Bar dataKey={dataKey} fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}