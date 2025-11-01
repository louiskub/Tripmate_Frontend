"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

type DataPoint = {
  day?: string
  month?: string
  bookings?: number
  earnings?: number
}

type ChartCardProps = {
  title: string
  subtitle?: string
  data: DataPoint[]
}

export default function ChartCard({ title, subtitle, data }: ChartCardProps) {
  const valueKey: "bookings" | "earnings" =
    data?.[0]?.bookings !== undefined ? "bookings" : "earnings"
  const categoryKey = valueKey === "bookings" ? "day" : "month"

  return (
    <div className="flex flex-col p-6 pb-10 bg-white rounded-xl border border-neutral-200 shadow-sm h-full">
      <div>
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>

      {/* ให้ ResponsiveContainer มีความสูงแน่นอน */}
      <div className="flex-1 mt-6 h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={categoryKey} tick={{ fontSize: 12 }} stroke="#888888" />
            <YAxis tick={{ fontSize: 12 }} stroke="#888888" />
            <Tooltip
              cursor={{ fill: "rgba(239, 246, 255, 0.5)" }}
              contentStyle={{ background: "white", borderRadius: "0.5rem", border: "1px solid #e5e7eb" }}
            />
            <Bar dataKey={valueKey} fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
