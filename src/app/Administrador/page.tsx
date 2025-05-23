"use client"
import { useState, useEffect } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import {  MdMenu, MdDashboard, MdGroup, MdShield, MdShoppingCart, MdInventory, MdBarChart, 
   MdLocalShipping,  MdHeadset, MdDeliveryDining,MdAssignment,MdNotifications,MdPerson,
   MdSearch,MdAttachMoney,MdEdit,MdDelete,MdAdd
} from 'react-icons/md';
import { FaChartBar, FaUsers, FaBox, FaMoneyBillWave 
} from 'react-icons/fa';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

// Define types
type TabType = 'Dashboard' | 'Usuários' | 'Produtos' | 'Pedidos' | 'Transportadoras' | 'Relatórios';
type UserType = 'Agricultor' | 'Compradora' | 'Fornecedor';
type UserStatus = 'Pendente' | 'Aprovado' | 'Rejeitado';

interface User {
  name: string;
  type: UserType;
  date: string;
  status: UserStatus;
}

interface Product {
  name: string;
  seller: string;
  price: string;
  status: string;
}

// Custom Notification types
type NotificationType = 'info' | 'warning' | 'success' | 'error';
interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: NotificationType;
}

function getStatusColor(status: UserStatus) {
  switch (status) {
    case 'Pendente':
      return 'bg-yellow-100 text-yellow-800';
    case 'Aprovado':
      return 'bg-green-100 text-green-800';
    case 'Rejeitado':
      return 'bg-red-100 text-red-800';
    default:
      return '';
  }
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('Dashboard');
  const [sidebarActive, setSidebarActive] = useState(false);
  const [users] = useState<User[]>([
    { name: 'João Silva', type: 'Agricultor', date: '2023-08-15', status: 'Pendente' },
    { name: 'Maria Santos', type: 'Compradora', date: '2023-08-15', status: 'Aprovado' },
    { name: 'Pedro Alves', type: 'Fornecedor', date: '2023-08-14', status: 'Rejeitado' }
  ]);
  
  const [products] = useState<Product[]>([
    { name: 'Milho Verde', seller: 'João Silva', price: 'AOA 1,500', status: 'Ativo' },
    { name: 'Feijão', seller: 'Maria Antunes', price: 'AOA 2,300', status: 'Ativo' },
    { name: 'Mandioca', seller: 'Carlos Eduardo', price: 'AOA 1,200', status: 'Ativo' },
    { name: 'Batata Doce', seller: 'Fernanda Silva', price: 'AOA 1,800', status: 'Ativo' },
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, title: 'Novo Usuário', message: 'João Silva solicitou cadastro como Agricultor', time: '5 min atrás', read: false, type: 'info' },
    { id: 2, title: 'Produto Esgotado', message: 'Tomate - estoque zerado', time: '1 hora atrás', read: false, type: 'warning' },
    { id: 3, title: 'Pedido Entregue', message: 'Pedido #12343 foi entregue com sucesso', time: '2 horas atrás', read: true, type: 'success' },
    { id: 4, title: 'Problema de Pagamento', message: 'Erro no pagamento do pedido #12340', time: '3 horas atrás', read: false, type: 'error' },
    { id: 5, title: 'Nova Transportadora', message: 'TransRápido solicitou parceria', time: '1 dia atrás', read: true, type: 'info' }
  ]);

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const markNotificationAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'info':
        return <MdNotifications className="text-blue-500" size={20} />;
      case 'warning':
        return <MdNotifications className="text-yellow-500" size={20} />;
      case 'success':
        return <MdNotifications className="text-green-500" size={20} />;
      case 'error':
        return <MdNotifications className="text-red-500" size={20} />;
      default:
        return <MdNotifications size={20} />;
    }
  };

  const confirmLogout = () => {
    // Implement your logout logic here
    setShowLogoutModal(false);
    alert('Logout realizado!');
  };

  const categoryData = {
    labels: ['Grãos', 'Tubérculos', 'Legumes', 'Frutas'],
    datasets: [
      {
        label: 'Produtos',
        data: [12, 19, 7, 5],
        backgroundColor: [
          '#10b981',
          '#f59e42',
          '#3b82f6',
          '#f43f5e'
        ],
        borderWidth: 1,
      },
    ],
  };


  const handleMenuToggle = () => {
    setSidebarActive(!sidebarActive);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (window.innerWidth <= 768) {
      setSidebarActive(false);
    }
  };

  // Sales chart data
  const chartData = {
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Vendas (AOA)',
        data: [65000, 59000, 80000, 81000, 56000, 95000, 40000],
        fill: false,
        borderColor: '#10b981',
        tension: 0.1,
      },
    ],
  };

  // Chart options (missing in original code)
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    // Optionally, add logic to close sidebar on outside click for mobile
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Menu Toggle Button */}
      <button 
        className="menu-toggle md:hidden fixed top-4 left-4 z-50 bg-emerald-600 text-white p-2 rounded-md sr-only"
        onClick={handleMenuToggle}
      >menu
        <MdMenu size={24} />
      </button>

      {/* Sidebar */}
      <aside className={`sidebar fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-200 p-4 transition-transform duration-300 z-40 ${
        sidebarActive ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}>
        <div className="mb-6 flex items-center justify-center">
          <h1 className="text-emerald-600 text-2xl font-bold">NzoAgro</h1>
        </div>
        <nav className="space-y-2">
          <a 
            href="#dashboard" 
            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'Dashboard' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-emerald-600'
            }`}
            onClick={e => { e.preventDefault(); handleTabChange('Dashboard'); }}
          >
            <MdDashboard className="mr-3" size={20} />
            Dashboard
          </a>
          <a 
            href="#users" 
            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'Usuários' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-emerald-600'
            }`}
            onClick={e => { e.preventDefault(); handleTabChange('Usuários'); }}
          >
            <MdGroup className="mr-3" size={20} />
            Usuários
          </a>
          <a 
            href="#products" 
            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'Produtos' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-emerald-600'
            }`}
            onClick={e => { e.preventDefault(); handleTabChange('Produtos'); }}
          >
            <MdInventory className="mr-3" size={20} />
            Produtos
          </a>
          <a 
            href="#orders" 
            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'Pedidos' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-emerald-600'
            }`}
            onClick={e => { e.preventDefault(); handleTabChange('Pedidos'); }}
          >
            <MdShoppingCart className="mr-3" size={20} />
            Pedidos
          </a>
          <a 
            href="#transportadoras" 
            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'Transportadoras' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-emerald-600'
            }`}
            onClick={e => { e.preventDefault(); handleTabChange('Transportadoras'); }}
          >
            <MdDeliveryDining className="mr-3" size={20} />
            Transportadoras
          </a>
          <a 
            href="#reports" 
            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'Relatórios' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-emerald-600'
            }`}
            onClick={e => { e.preventDefault(); handleTabChange('Relatórios'); }}
          >
            <MdBarChart className="mr-3" size={20} />
            Relatórios
          </a>
          <a href="#logistics" className="flex items-center px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-emerald-600 transition-colors">
            <MdLocalShipping className="mr-3" size={20} />
            Logística
          </a>
          <a href="#support" className="flex items-center px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-emerald-600 transition-colors">
            <MdHeadset className="mr-3" size={20} />
            Suporte
          </a>
          <a href="#pedidos" className="flex items-center px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-emerald-600 transition-colors">
            <MdAssignment className="mr-3" size={20} />
            Controle de Pedidos
          </a>
        </nav>
      </aside>

      {/* Header */}
      <header className="fixed top-0 right-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-30 md:left-72 left-0">
        <div className="flex items-center ml-16 md:ml-0">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="search" 
              placeholder="Pesquisar..." 
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" 
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <MdNotifications
              className="text-gray-600 cursor-pointer"
              size={24}
              onClick={() => setNotificationsOpen((open) => !open)}
            />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {notifications.filter((n) => !n.read).length}
            </span>
            {/* Notifications Dropdown */}
            {notificationsOpen && (
              <div className="notifications-dropdown absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-800">Notificações</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {notification.time}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-200">
                  <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                    Ver todas as notificações
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
              <MdPerson className="text-white" size={20} />
            </div>
            <div className="hidden sm:block">
              <span className="font-semibold text-gray-800">Admin</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="md:ml-72 mt-16 p-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {(['Dashboard', 'Usuários', 'Produtos', 'Pedidos', 'Transportadoras', 'Relatórios'] as TabType[]).map((tab) => (
              <button 
                key={tab}
                className={`px-6 py-3 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === tab 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => handleTabChange(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'Dashboard' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-gray-600 text-sm mb-2">Usuários Ativos</h3>
                <div className="text-3xl font-bold text-emerald-600">2,453</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-gray-600 text-sm mb-2">Pedidos Hoje</h3>
                <div className="text-3xl font-bold text-emerald-600">156</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-gray-600 text-sm mb-2">Produtos Ativos</h3>
                <div className="text-3xl font-bold text-emerald-600">1,893</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-gray-600 text-sm mb-2">Receita Mensal</h3>
                <div className="text-3xl font-bold text-emerald-600">AOA 985K</div>
              </div>
            </div>

            {/* Recent Registrations */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Últimos Cadastros</h2>
                <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                  Ver Todos
                </button>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Usuário</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Tipo</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Data</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-3 px-4">{user.name}</td>
                          <td className="py-3 px-4">{user.type}</td>
                          <td className="py-3 px-4">{user.date}</td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(user.status)}`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <button className="bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-700 transition-colors">
                              {user.status === 'Pendente' ? 'Aprovar' : 
                               user.status === 'Rejeitado' ? 'Revisar' : 'Detalhes'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Sales Chart */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold">Vendas dos Últimos 7 Dias</h2>
              </div>
              <div className="p-6">
                <div className="h-80">
                  <Line data={chartData} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'Produtos' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Gerenciamento de Produtos</h2>
              <div className="relative">
                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="search" 
                  placeholder="Buscar produtos..." 
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                />
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400">Imagem do Produto</span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                      <p className="text-gray-600 mb-1">Vendedor: {product.seller}</p>
                      <p className="text-gray-600 mb-1">Preço: {product.price}</p>
                      <p className="text-gray-600 mb-4">Status: {product.status}</p>
                      <div className="flex justify-between items-center">
                        <button className="flex items-center bg-emerald-600 text-white px-3 py-2 rounded hover:bg-emerald-700 transition-colors">
                          <MdEdit className="mr-1" size={16} />
                          Editar
                        </button>
                        <button className="flex items-center bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition-colors">
                          <MdDelete className="mr-1" size={16} />
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'Usuários' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Gerenciamento de Usuários</h2>
              <div className="relative">
                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="search" 
                  placeholder="Buscar usuários..." 
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                />
              </div>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Nome</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Tipo</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Data de Registro</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4">João Silva</td>
                      <td className="py-3 px-4">joao.silva@email.com</td>
                      <td className="py-3 px-4">Agricultor</td>
                      <td className="py-3 px-4">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">Ativo</span>
                      </td>
                      <td className="py-3 px-4">2023-08-15</td>
                      <td className="py-3 px-4">
                        <button className="bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-700 transition-colors">
                          Editar
                        </button>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4">Maria Santos</td>
                      <td className="py-3 px-4">maria.santos@email.com</td>
                      <td className="py-3 px-4">Compradora</td>
                      <td className="py-3 px-4">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">Ativo</span>
                      </td>
                      <td className="py-3 px-4">2023-08-12</td>
                      <td className="py-3 px-4">
                        <button className="bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-700 transition-colors">
                          Editar
                        </button>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4">Pedro Alves</td>
                      <td className="py-3 px-4">pedro.alves@email.com</td>
                      <td className="py-3 px-4">Fornecedor</td>
                      <td className="py-3 px-4">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">Inativo</span>
                      </td>
                      <td className="py-3 px-4">2023-08-10</td>
                      <td className="py-3 px-4">
                        <button className="bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-700 transition-colors">
                          Editar
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}





{activeTab === 'Pedidos' && (
            <div className="card">
              <div className="card-header">
                <h2>Gestão de Pedidos</h2>
                <div className="search">
                  <input type="search" placeholder="Buscar pedidos..." className="search-input" />
                </div>
              </div>
              <div className="card-body">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Cliente</th>
                      <th>Data</th>
                      <th>Valor</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>#12345</td>
                      <td>Ana Maria</td>
                      <td>2023-08-17</td>
                      <td>AOA 5,400</td>
                      <td><span className="order-status status-pending">Pendente</span></td>
                      <td>
                        <button className="btn btn-primary">Detalhes</button>
                      </td>
                    </tr>
                    <tr>
                      <td>#12344</td>
                      <td>Roberto Carlos</td>
                      <td>2023-08-17</td>
                      <td>AOA 2,850</td>
                      <td><span className="order-status status-processing">Processando</span></td>
                      <td>
                        <button className="btn btn-primary">Detalhes</button>
                      </td>
                    </tr>
                    <tr>
                      <td>#12343</td>
                      <td>Carla Silva</td>
                      <td>2023-08-16</td>
                      <td>AOA 7,200</td>
                      <td><span className="order-status status-delivered">Entregue</span></td>
                      <td>
                        <button className="btn btn-primary">Detalhes</button>
                      </td>
                    </tr>
                    <tr>
                      <td>#12342</td>
                      <td>Fernando Mendes</td>
                      <td>2023-08-16</td>
                      <td>AOA 3,150</td>
                      <td><span className="order-status status-cancelled">Cancelado</span></td>
                      <td>
                        <button className="btn btn-primary">Detalhes</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Transportadoras' && (
            <div className="card">
              <div className="card-header">
                <h2>Cadastro de Transportadoras</h2>
                <button className="btn btn-primary">Nova Transportadora</button>
              </div>
              <div className="card-body">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>CNPJ/NIF</th>
                      <th>Contato</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>TransRápido Ltda</td>
                      <td>12.345.678/0001-90</td>
                      <td>(+244) 923 456 789</td>
                      <td><span className="status approved">Ativo</span></td>
                      <td>
                        <button className="btn btn-primary">Editar</button>
                      </td>
                    </tr>
                    <tr>
                      <td>Expresso Angola</td>
                      <td>98.765.432/0001-21</td>
                      <td>(+244) 923 987 654</td>
                      <td><span className="status approved">Ativo</span></td>
                      <td>
                        <button className="btn btn-primary">Editar</button>
                      </td>
                    </tr>
                    <tr>
                      <td>LogistiVia</td>
                      <td>45.678.901/0001-23</td>
                      <td>(+244) 923 123 456</td>
                      <td><span className="status pending">Inativo</span></td>
                      <td>
                        <button className="btn btn-primary">Editar</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}


{activeTab === 'Pedidos' && (
  <div className="bg-white rounded-lg shadow-sm mb-6">
    <div className="p-6 border-b border-gray-200 flex justify-between items-center">
      <h2 className="text-xl font-semibold text-gray-800">Gestão de Pedidos</h2>
      <div className="relative">
        <input 
          type="search" 
          placeholder="Buscar pedidos..." 
          className="px-4 py-2 border border-gray-300 rounded-md w-80 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
        />
      </div>
    </div>
    <div className="p-6">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">ID</th>
              <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Cliente</th>
              <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Data</th>
              <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Valor</th>
              <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Status</th>
              <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-4 border-b border-gray-200">#12345</td>
              <td className="p-4 border-b border-gray-200">Ana Maria</td>
              <td className="p-4 border-b border-gray-200">2023-08-17</td>
              <td className="p-4 border-b border-gray-200">AOA 5,400</td>
              <td className="p-4 border-b border-gray-200">
                <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  Pendente
                </span>
              </td>
              <td className="p-4 border-b border-gray-200">
                <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium">
                  Detalhes
                </button>
              </td>
            </tr>
            <tr>
              <td className="p-4 border-b border-gray-200">#12344</td>
              <td className="p-4 border-b border-gray-200">Roberto Carlos</td>
              <td className="p-4 border-b border-gray-200">2023-08-17</td>
              <td className="p-4 border-b border-gray-200">AOA 2,850</td>
              <td className="p-4 border-b border-gray-200">
                <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  Processando
                </span>
              </td>
              <td className="p-4 border-b border-gray-200">
                <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium">
                  Detalhes
                </button>
              </td>
            </tr>
            <tr>
              <td className="p-4 border-b border-gray-200">#12343</td>
              <td className="p-4 border-b border-gray-200">Carla Silva</td>
              <td className="p-4 border-b border-gray-200">2023-08-16</td>
              <td className="p-4 border-b border-gray-200">AOA 7,200</td>
              <td className="p-4 border-b border-gray-200">
                <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Entregue
                </span>
              </td>
              <td className="p-4 border-b border-gray-200">
                <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium">
                  Detalhes
                </button>
              </td>
            </tr>
            <tr>
              <td className="p-4 border-b border-gray-200">#12342</td>
              <td className="p-4 border-b border-gray-200">Fernando Mendes</td>
              <td className="p-4 border-b border-gray-200">2023-08-16</td>
              <td className="p-4 border-b border-gray-200">AOA 3,150</td>
              <td className="p-4 border-b border-gray-200">
                <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  Cancelado
                </span>
              </td>
              <td className="p-4 border-b border-gray-200">
                <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium">
                  Detalhes
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}

{activeTab === 'Transportadoras' && (
  <div className="bg-white rounded-lg shadow-sm mb-6">
    <div className="p-6 border-b border-gray-200 flex justify-between items-center">
      <h2 className="text-xl font-semibold text-gray-800">Cadastro de Transportadoras</h2>
      <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium">
        Nova Transportadora
      </button>
    </div>
    <div className="p-6">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Nome</th>
              <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">CNPJ/NIF</th>
              <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Contato</th>
              <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Status</th>
              <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-4 border-b border-gray-200">TransRápido Ltda</td>
              <td className="p-4 border-b border-gray-200">12.345.678/0001-90</td>
              <td className="p-4 border-b border-gray-200">(+244) 923 456 789</td>
              <td className="p-4 border-b border-gray-200">
                <span className="inline-block px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                  Ativo
                </span>
              </td>
              <td className="p-4 border-b border-gray-200">
                <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium">
                  Editar
                </button>
              </td>
            </tr>
            <tr>
              <td className="p-4 border-b border-gray-200">Expresso Angola</td>
              <td className="p-4 border-b border-gray-200">98.765.432/0001-21</td>
              <td className="p-4 border-b border-gray-200">(+244) 923 987 654</td>
              <td className="p-4 border-b border-gray-200">
                <span className="inline-block px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                  Ativo
                </span>
              </td>
              <td className="p-4 border-b border-gray-200">
                <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium">
                  Editar
                </button>
              </td>
            </tr>
            <tr>
              <td className="p-4 border-b border-gray-200">LogistiVia</td>
              <td className="p-4 border-b border-gray-200">45.678.901/0001-23</td>
              <td className="p-4 border-b border-gray-200">(+244) 923 123 456</td>
              <td className="p-4 border-b border-gray-200">
                <span className="inline-block px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                  Inativo
                </span>
              </td>
              <td className="p-4 border-b border-gray-200">
                <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium">
                  Editar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}

{activeTab === 'Relatórios' && (
  <div className="bg-white rounded-lg shadow-sm mb-6">
    <div className="p-6 border-b border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800">Relatórios</h2>
    </div>
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center justify-center gap-4 cursor-pointer hover:-translate-y-1 transition-transform" 
          onClick={() => alert("Gerando relatório de vendas...")}
        >
          <FaChartBar className="text-5xl text-green-600" />
          <h3 className="text-lg font-medium text-gray-800 text-center">Relatório de Vendas</h3>
        </div>
        <div 
          className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center justify-center gap-4 cursor-pointer hover:-translate-y-1 transition-transform" 
          onClick={() => alert("Gerando relatório de usuários...")}
        >
          <FaUsers className="text-5xl text-green-600" />
          <h3 className="text-lg font-medium text-gray-800 text-center">Relatório de Usuários</h3>
        </div>
        <div 
          className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center justify-center gap-4 cursor-pointer hover:-translate-y-1 transition-transform" 
          onClick={() => alert("Gerando relatório de produtos...")}
        >
          <FaBox className="text-5xl text-green-600" />
          <h3 className="text-lg font-medium text-gray-800 text-center">Relatório de Produtos</h3>
        </div>
        <div 
          className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center justify-center gap-4 cursor-pointer hover:-translate-y-1 transition-transform" 
          onClick={() => alert("Gerando relatório financeiro...")}
        >
          <FaMoneyBillWave className="text-5xl text-green-600" />
          <h3 className="text-lg font-medium text-gray-800 text-center">Relatório Financeiro</h3>
        </div>
      </div>
    </div>
  </div>
)}

      </main>
    </div>
  );
}