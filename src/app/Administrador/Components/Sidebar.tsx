// app/admin/components/Sidebar.tsx
import { MdDashboard, MdGroup, MdSecurity, MdShoppingCart, MdInventory, MdBarChart, MdLocalShipping, MdSupportAgent } from "react-icons/md";

const navItems = [
  { label: "Dashboard", icon: <MdDashboard />, href: "#", active: true },
  { label: "Gestão de Usuários", icon: <MdGroup />, href: "#" },
  { label: "Segurança", icon: <MdSecurity />, href: "#" },
  { label: "Pedidos", icon: <MdShoppingCart />, href: "#" },
  { label: "Produtos", icon: <MdInventory />, href: "#" },
  { label: "Relatórios", icon: <MdBarChart />, href: "#" },
  { label: "Logística", icon: <MdLocalShipping />, href: "#" },
  { label: "Suporte", icon: <MdSupportAgent />, href: "#" },
];

export default function Sidebar() {
  return (
    <div className="px-4 py-6">
      <div className="text-center mb-10">
        <h1 className="text-2xl font-bold text-green-700">NzoAgro Admin</h1>
      </div>
      <nav className="space-y-2">
        {navItems.map((item, idx) => (
          <a
            key={idx}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
              item.active ? "bg-green-600 text-white" : "text-gray-600 hover:bg-gray-100 hover:text-green-600"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
