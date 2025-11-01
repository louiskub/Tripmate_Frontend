type StatCardProps = {
  title: string
  value: string | number
}

export default function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="p-6 bg-white rounded-xl border border-neutral-200 flex flex-col justify-center items-center gap-2 shadow-sm">
      <h3 className="text-gray-500 font-medium text-center">{title}</h3>
      <p className="text-black font-bold text-4xl">{value}</p>
    </div>
  )
}
