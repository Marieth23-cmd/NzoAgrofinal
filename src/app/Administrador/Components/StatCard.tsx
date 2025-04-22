// app/admin/components/StatCard.tsx
interface StatCardProps {
    title: string;
    value: string;
  }
  
  export default function StatCard({ title, value }: StatCardProps) {
    return (
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-sm text-gray-500 mb-1">{title}</h3>
        <div className="text-2xl font-bold text-green-700">{value}</div>
      </div>
    );
  }
  