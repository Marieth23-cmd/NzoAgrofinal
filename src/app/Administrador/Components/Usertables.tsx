// app/admin/components/UsersTable.tsx
const users = [
    { nome: "João Silva", tipo: "Agricultor", data: "2023-08-15", status: "Pendente", acao: "Aprovar" },
    { nome: "Maria Santos", tipo: "Compradora", data: "2023-08-15", status: "Aprovado", acao: "Detalhes" },
    { nome: "Pedro Alves", tipo: "Fornecedor", data: "2023-08-14", status: "Rejeitado", acao: "Revisar" },
  ];
  
  const statusColors: Record<string, string> = {
    Pendente: "bg-yellow-100 text-yellow-800",
    Aprovado: "bg-green-100 text-green-800",
    Rejeitado: "bg-red-100 text-red-800",
  };
  
  export default function UsersTable() {
    return (
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left bg-gray-50 text-gray-600">
            <th className="py-3 px-4">Usuário</th>
            <th className="py-3 px-4">Tipo</th>
            <th className="py-3 px-4">Data</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => (
            <tr key={idx} className="border-b">
              <td className="py-3 px-4">{user.nome}</td>
              <td className="py-3 px-4">{user.tipo}</td>
              <td className="py-3 px-4">{user.data}</td>
              <td className="py-3 px-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[user.status]}`}>
                  {user.status}
                </span>
              </td>
              <td className="py-3 px-4">
                <button className="bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-3 py-1 rounded-md">
                  {user.acao}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  