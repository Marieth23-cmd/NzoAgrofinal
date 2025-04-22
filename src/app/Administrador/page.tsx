// app/admin/page.tsx
import StatCard from "./Components/StatCard";
import UsersTable from "./Components/Usertables";

export default function AdminDashboard() {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Usuários Ativos" value="2,453" />
        <StatCard title="Pedidos Hoje" value="156" />
        <StatCard title="Produtos Ativos" value="1,893" />
        <StatCard title="Receita Mensal" value="AOA 985K" />
      </div>

      <div className="bg-white rounded-xl shadow mb-6">
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-lg font-semibold">Últimos Cadastros</h2>
          <button className="bg-marieth hover:bg-verdeaceso text-white font-medium px-4 py-2 rounded-md">
            Ver Todos
          </button>
        </div>
        <div className="p-6">
          <UsersTable />
        </div>
      </div>
    </div>
  );
}
