"use client"
import { useState, useEffect } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import {  MdMenu, MdDashboard, MdGroup, MdShield, MdShoppingCart, MdInventory, MdBarChart, 
   MdLocalShipping,  MdHeadset, MdDeliveryDining,MdAssignment,MdNotifications,MdPerson,
   MdSearch,MdAttachMoney,MdEdit,MdDelete,MdAdd, MdSettings, MdNotificationsActive, MdSettingsApplications
} from 'react-icons/md';
import { FaChartBar, FaUsers, FaBox, FaMoneyBillWave } from 'react-icons/fa';
import { getProdutos ,deletarProduto } from '../Services/produtos';
import { logout } from '../Services/auth';
import { useRouter } from 'next/navigation';
import { getUsuarios } from '../Services/user';   
import { badgeNotificacoes } from '../Services/notificacoes';
import { verificarAuth } from '../Services/auth';
import { getPedidos } from '../Services/pedidos';


// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

type TabType = 'Dashboard' | 'Usuários' | 'Produtos' | 'Pedidos' | 'Transportadoras' | 'Relatórios' | 'Logística' | 'Suporte' | 'Controle de Pedidos'| 'Configurações'| 'Notificações';
type UserType = 'Agricultor' | 'Compradora' | 'Fornecedor';
type UserStatus = 'Pendente' | 'Aprovado' | 'Rejeitado';

interface Produto {
    id_produtos: number;
    nome: string;
    foto_produto: string;
    quantidade: number;
    Unidade: string;
    preco: number;
    idUsuario: number;
    peso_kg:number
}

interface usuarios{
    id_usuario: number;
    nome: string;
    tipo_usuario: string;
    data_criacao: string;
    status: UserStatus;
    foto: string;
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

interface Pedidos {
  id_pedido: number;
  estado: string;
  valor_total: number;
  data_pedido: string;
  nome_usuario?: string;
  itens?: Array<{
    id_produto: number;
    quantidade_comprada: number;
    preco: number;
    subtotal: number;
  }>;
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
  const [produtos, setProdutos] = useState<Produto[]>([]);

  const [activeTab, setActiveTab] = useState<TabType>('Dashboard');
  const [sidebarActive, setSidebarActive] = useState(false);
  const [usuario, setUsuario] = useState<usuarios[]>([]);
  const [pedidos, setPedidos] = useState<Pedidos[]>([]);

  useEffect(() => {
    async function fetchProdutos() {
      try {
        const data = await getProdutos();
        const produtosFormatados = data.map((produto: any) => ({
          ...produto,
          idUsuario: Number(produto.idUsuario) || 0
        }));
        setProdutos(produtosFormatados);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    }
    fetchProdutos();
  }, []);

  useEffect(() => {
    async function fetchUsuarios() {
      try {
        const data = await getUsuarios();
        setUsuario(data);
      } catch (error) {
        setUsuario([]);
        console.error("Erro ao buscar usuários:", error);
      }
    }
    fetchUsuarios();
  }, []);


  // Defina a interface para Pedido
  interface Pedido {
    data_pedido: string;
    valor_total: number;
    // adicione outros campos conforme necessário
  }

  useEffect(() => {
    async function fetchCardsData() {
      try {
        const pedidos: Pedido[] = await getPedidos();
        const usuariosAtivos = usuario.filter(u => u.status === 'Aprovado').length;
        const pedidosHoje = pedidos.filter((p: Pedido) => new Date(p.data_pedido).toDateString() === new Date().toDateString()).length;
        const produtosAtivos = produtos.length;
        const receitaMensal = pedidos.reduce((total: number, pedido: Pedido) => total + pedido.valor_total, 0) / 1000; // Convertendo para milhares

        setCardsData({
          UsuariosActivo: usuariosAtivos,
          PedidosHoje: pedidosHoje,
          ProdutosAtivos: produtosAtivos,
          ReceitaMensal: receitaMensal
        });
      } catch (error) {
        console.error("Erro ao buscar dados dos cartões:", error);
      }
    }
    fetchCardsData();
  }, [produtos, usuario]);

  // Cardsdata como objeto
  const [Cardsdata, setCardsData] = useState({
    UsuariosActivo: 0,
    PedidosHoje: 0,
    ProdutosAtivos: 0,
    ReceitaMensal: 0
  });

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, title: 'Novo Usuário', message: 'João Silva solicitou cadastro como Agricultor', time: '5 min atrás', read: false, type: 'info' },
    { id: 2, title: 'Produto Esgotado', message: 'Tomate - estoque zerado', time: '1 hora atrás', read: false, type: 'warning' },
    { id: 3, title: 'Pedido Entregue', message: 'Pedido #12343 foi entregue com sucesso', time: '2 horas atrás', read: true, type: 'success' },
    { id: 4, title: 'Problema de Pagamento', message: 'Erro no pagamento do pedido #12340', time: '3 horas atrás', read: false, type: 'error' },
    { id: 5, title: 'Nova Transportadora', message: 'TransRápido solicitou parceria', time: '1 dia atrás', read: true, type: 'info' }
  ]);

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [autenticado, setAutenticado] = useState<boolean | null>(null);
  const router = useRouter();

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

  const handleLogout = async () => {
    try {
      await logout();
      setAutenticado(false); 
      router.push("/login");
    } catch (error) {
      console.log("Erro ao terminar sessão:", error);
    }
  };

  const excluirProduto = async (produtoId: number) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        await deletarProduto(produtoId);
        setProdutos(produtos.filter(p => p.id_produtos !== produtoId));
        alert("Produto excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir produto:", error);
        alert("Erro ao excluir produto. Tente novamente mais tarde.");
      }
    }
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

  // Chart options
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

  return (
    <>
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
          {/* ...sidebar content... */}
        </aside>

        {/* Header */}
        <header className="fixed top-0 right-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-30 md:left-72 left-0">
          {/* ...header content... */}
        </header>

        {/* Main Content */}
        <main className="md:ml-72 mt-16 p-8">
          {/* Tabs */}
          <div className="mb-8 flex flex-wrap gap-2">
            {(['Dashboard', 'Usuários', 'Produtos', 'Pedidos', 'Transportadoras', 'Relatórios', 'Logística', 'Suporte', 'Controle de Pedidos', 'Configurações'] as TabType[]).map((tab) => (
              <button 
                key={tab}
                className={`px-6 py-3 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === tab 
                    ? 'bg-marieth text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => handleTabChange(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Dashboard Tab */}
          {activeTab === 'Dashboard' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-gray-600 text-sm mb-2">Usuários Ativos</h3>
                  <div className="text-3xl font-bold text-marieth">{Cardsdata.UsuariosActivo}</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-gray-600 text-sm mb-2">Pedidos Hoje</h3>
                  <div className="text-3xl font-bold text-marieth">{Cardsdata.PedidosHoje}</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-gray-600 text-sm mb-2">Produtos Ativos</h3>
                  <div className="text-3xl font-bold text-marieth">{Cardsdata.ProdutosAtivos}</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-gray-600 text-sm mb-2">Receita Mensal</h3>
                  <div className="text-3xl font-bold text-marieth">AOA {Cardsdata.ReceitaMensal}K</div>
                </div>
              </div>
              {/* Recent Registrations */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Últimos Cadastros</h2>
                  <button className="bg-marieth text-white px-4 py-2 rounded-lg hover:bg-verdeaceso transition-colors">
                    Ver Todos
                  </button>
                </div>
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
                    {usuario.map((user: usuarios, index: number) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-4">
                          <img src={user.foto} alt={user.nome} className="w-8 h-8 rounded-full mr-3 inline-block" />
                          {user.nome}
                        </td>
                        <td className="py-3 px-4">{user.tipo_usuario}</td>
                        <td className="py-3 px-4">{user.data_criacao}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(user.status)}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button className="bg-marieth text-white px-3 py-1 rounded hover:bg-verdeaceso transition-colors">
                            {user.status === 'Pendente' ? 'Aprovar' : 
                              user.status === 'Rejeitado' ? 'Revisar' : 'Detalhes'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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

          {/* Produtos Tab */}
          {activeTab === 'Produtos' && (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Gerenciamento de Produtos</h2>
                <div className="relative">
                  <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="search" 
                    placeholder="Buscar produtos..." 
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-verdeaceso" 
                  />
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {produtos.map((produto) => (
                    <div key={produto.id_produtos} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="h-48 bg-gray-100 flex items-center justify-center">
                        {produto.foto_produto ? (
                          <img src={produto.foto_produto} alt={produto.nome} className="h-full object-cover" />
                        ) : (
                          <span className="text-gray-400">Imagem do Produto</span>
                        )}
                      </div>      
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{produto.nome}</h3>
                        <p className="text-gray-600 mb-1">Vendedor: {produto.idUsuario}</p>
                        <p className="text-gray-600 mb-1">Preço: {produto.preco} AOA</p>
                        <p className="text-gray-600 mb-4">Quantidade: {produto.quantidade} {produto.Unidade}</p>
                        <div className="flex justify-between items-center">
                          <button className="flex items-center bg-emerald-600 text-white px-3 py-2 rounded hover:bg-emerald-700 transition-colors">
                            <MdEdit className="mr-1" size={16} />
                            Editar
                          </button>
                          <button onClick={() => excluirProduto(produto.id_produtos)} className="flex items-center bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition-colors">
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

          {/* Pedidos Tab */}
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
                        <td className="p-4 border-b border-gray-200">#12342</td>
                        <td className="p-4 border-b border-gray-200">Fernando Mendes</td>
                        <td className="p-4 border-b border-gray-200">2023-08-16</td>
                        <td className="p-4 border-b border-gray-200">AOA 3,100</td>
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

          {/* Relatórios Tab (Exemplo) */}
          {activeTab === 'Relatórios' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Relatórios</h2>
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

          {/* Logística Tab */}
          {activeTab === 'Logística' && (
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Gestão de Logística</h2>
                <button className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors font-medium">
                  <MdAdd className="inline mr-2" size={16} />
                  Nova Rota
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-600 text-sm font-medium">Entregas Hoje</p>
                        <p className="text-2xl font-bold text-blue-800">28</p>
                      </div>
                      <MdLocalShipping className="text-blue-600" size={32} />
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-600 text-sm font-medium">Entregues</p>
                        <p className="text-2xl font-bold text-green-800">156</p>
                      </div>
                      <MdDeliveryDining className="text-green-600" size={32} />
                    </div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-600 text-sm font-medium">Em Trânsito</p>
                        <p className="text-2xl font-bold text-yellow-800">42</p>
                      </div>
                      <MdLocalShipping className="text-yellow-600" size={32} />
                    </div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-red-600 text-sm font-medium">Atrasadas</p>
                        <p className="text-2xl font-bold text-red-800">8</p>
                      </div>
                      <MdLocalShipping className="text-red-600" size={32} />
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Rota</th>
                        <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Transportadora</th>
                        <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Destino</th>
                        <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Status</th>
                        <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Previsão</th>
                        <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-4 border-b border-gray-200">#RT001</td>
                        <td className="p-4 border-b border-gray-200">TransRápido</td>
                        <td className="p-4 border-b border-gray-200">Luanda - Benguela</td>
                        <td className="p-4 border-b border-gray-200">
                          <span className="inline-block px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">Em Trânsito</span>
                        </td>
                        <td className="p-4 border-b border-gray-200">18:00</td>
                        <td className="p-4 border-b border-gray-200">
                          <button className="px-3 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors mr-2">
                            Rastrear
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-4 border-b border-gray-200">#RT002</td>
                        <td className="p-4 border-b border-gray-200">Expresso Angola</td>
                        <td className="p-4 border-b border-gray-200">Luanda - Huambo</td>
                        <td className="p-4 border-b border-gray-200">
                          <span className="inline-block px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">Programada</span>
                        </td>
                        <td className="p-4 border-b border-gray-200">20:00</td>
                        <td className="p-4 border-b border-gray-200">
                          <button className="px-3 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors mr-2">
                            Rastrear
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Suporte Tab */}
          {activeTab === 'Suporte' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-gray-600 text-sm mb-2">Tickets Abertos</h3>
                      <div className="text-3xl font-bold text-red-600">23</div>
                    </div>
                    <MdHeadset className="text-red-600" size={32} />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-gray-600 text-sm mb-2">Em Andamento</h3>
                      <div className="text-3xl font-bold text-yellow-600">15</div>
                    </div>
                    <MdHeadset className="text-yellow-600" size={32} />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-gray-600 text-sm mb-2">Resolvidos Hoje</h3>
                      <div className="text-3xl font-bold text-green-600">47</div>
                    </div>
                    <MdHeadset className="text-green-600" size={32} />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-gray-600 text-sm mb-2">Tempo Médio</h3>
                      <div className="text-3xl font-bold text-blue-600">2.5h</div>
                    </div>
                    <MdHeadset className="text-blue-600" size={32} />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">Tickets de Suporte</h2>
                  <div className="flex space-x-2">
                    <label htmlFor="suporte" className='sr-only'>suporte</label>
                    <select id='suporte' name='suporte' className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500">
                      <option value="">Todos os Status</option>
                      <option value="">Aberto</option>
                      <option value="">Em Andamento</option>
                      <option value="">Resolvido</option>
                    </select>
                    <div className="relative">
                      <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input 
                        type="search" 
                        placeholder="Buscar tickets..." 
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                      />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">ID</th>
                          <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Usuário</th>
                          <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Assunto</th>
                          <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Prioridade</th>
                          <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Status</th>
                          <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Data</th>
                          <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-4 border-b border-gray-200">#SUP001</td>
                          <td className="p-4 border-b border-gray-200">João Silva</td>
                          <td className="p-4 border-b border-gray-200">Problema no pagamento</td>
                          <td className="p-4 border-b border-gray-200">
                            <span className="inline-block px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">Alta</span>
                          </td>
                          <td className="p-4 border-b border-gray-200">
                            <span className="inline-block px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">Em Andamento</span>
                          </td>
                          <td className="p-4 border-b border-gray-200">2023-08-17</td>
                          <td className="p-4 border-b border-gray-200">
                            <button className="px-3 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors mr-2">
                              Responder
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-4 border-b border-gray-200">#SUP002</td>
                          <td className="p-4 border-b border-gray-200">Maria Santos</td>
                          <td className="p-4 border-b border-gray-200">Dúvida sobre entrega</td>
                          <td className="p-4 border-b border-gray-200">
                            <span className="inline-block px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">Média</span>
                          </td>
                          <td className="p-4 border-b border-gray-200">
                            <span className="inline-block px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">Aberto</span>
                          </td>
                          <td className="p-4 border-b border-gray-200">2023-08-17</td>
                          <td className="p-4 border-b border-gray-200">
                            <button className="px-3 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors mr-2">
                              Responder
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Controle de Pedidos Tab */}
          {activeTab === 'Controle de Pedidos' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-gray-600 text-sm mb-2">Total de Pedidos</h3>
                  <div className="text-2xl font-bold text-gray-800">1,234</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-gray-600 text-sm mb-2">Pendentes</h3>
                  <div className="text-2xl font-bold text-yellow-600">45</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-gray-600 text-sm mb-2">Processando</h3>
                  <div className="text-2xl font-bold text-blue-600">32</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-gray-600 text-sm mb-2">Entregues</h3>
                  <div className="text-2xl font-bold text-green-marieth">1,157</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-gray-600 text-sm mb-2">Cancelados</h3>
                  <div className="text-2xl font-bold text-red-600">23</div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-wrap gap-4 items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Controle Detalhado de Pedidos</h2>
                    <div className="flex space-x-2">
                      <label htmlFor="status-filter" className="sr-only">Filtrar por status</label>
                      <select id="status-filter" title="Filtrar por status" className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 sr-only">
                        <option>Todos os Status</option>
                        <option>Pendente</option>
                        <option>Processando</option>
                        <option>Enviado</option>
                        <option>Entregue</option>
                        <option>Cancelado</option>
                      </select>
                      <label htmlFor="period-filter" className="sr-only">Filtrar por período</label>
                      <select id="period-filter" title="Filtrar por período" className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 sr-only">
                        <option>Período</option>
                        <option>Hoje</option>
                        <option>Esta Semana</option>
                        <option>Este Mês</option>
                      </select>
                      <div className="relative">
                        <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                          type="search" 
                          placeholder="Buscar por ID ou cliente..." 
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-80 focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">
                           <label htmlFor="pedido" className='sr-only'>pedido</label>
                            <input id='pedido' type="checkbox" className="mr-2" />
                            ID do Pedido
                          </th>
                          <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Cliente</th>
                          <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Produtos</th>
                          <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Valor Total</th>
                          <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Status</th>
                          <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Data</th>
                          <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-4 border-b border-gray-200">#1001</td>
                          <td className="p-4 border-b border-gray-200">
                            <div>
                              <p className="font-medium">Roberto Carlos</p>
                              <p className="text-sm text-gray-500">roberto.carlos@email.com</p>
                            </div>
                          </td>
                          <td className="p-4 border-b border-gray-200">
                            <div>
                              <p>Milho Verde (2kg)</p>
                              <p className="text-sm text-gray-500">Feijão (1kg)</p>
                            </div>
                          </td>
                          <td className="p-4 border-b border-gray-200">AOA 2,850</td>
                          <td className="p-4 border-b border-gray-200">
                            <label htmlFor="status1" className='sr-only'>status</label>
                            <select id='status1' className="px-3 py-1 border border-gray-300 rounded text-sm">
                              <option>Pendente</option>
                              <option>Processando</option>
                              <option>Enviado</option>
                              <option>Entregue</option>
                              <option>Cancelado</option>
                            </select>
                          </td>
                          <td className="p-4 border-b border-gray-200">
                            <div>
                              <p>2023-08-17</p>
                              <p className="text-sm text-gray-500">14:30</p>
                            </div>
                          </td>
                          <td className="p-4 border-b border-gray-200">
                            <div className="flex space-x-2">
                              <button className="px-3 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors text-sm">
                                Ver
                              </button>
                              <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm">
                                Editar
                              </button>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-4 border-b border-gray-200">#1002</td>
                          <td className="p-4 border-b border-gray-200">
                            <div>
                              <p className="font-medium">Ana Maria</p>
                              <p className="text-sm text-gray-500">ana.maria@email.com</p>
                            </div>
                          </td>
                          <td className="p-4 border-b border-gray-200">
                            <div>
                              <p>Batata Doce (3kg)</p>
                              <p className="text-sm text-gray-500">Mandioca (2kg)</p>
                            </div>
                          </td>
                          <td className="p-4 border-b border-gray-200">AOA 3,100</td>
                          <td className="p-4 border-b border-gray-200">
                            <label htmlFor="status">status</label>
                            <select id='status' name='status' className="px-3 py-1 border border-gray-300 rounded text-sm">
                              <option>Processando</option>
                              <option>Pendente</option>
                              <option>Enviado</option>
                              <option>Entregue</option>
                              <option>Cancelado</option>
                            </select>
                          </td>
                          <td className="p-4 border-b border-gray-200">
                            <div>
                              <p>2023-08-17</p>
                              <p className="text-sm text-gray-500">13:15</p>
                            </div>
                          </td>
                          <td className="p-4 border-b border-gray-200">
                            <div className="flex space-x-2">
                              <button className="px-3 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors text-sm">
                                Ver
                              </button>
                              <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm">
                                Editar
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  {/* Ações em massa */}
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex space-x-2">
                      <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                        Aprovar Selecionados
                      </button>
                      <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
                        Cancelar Selecionados
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Mostrando 1-10 de 234 pedidos</span>
                      <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">Anterior</button>
                      <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">Próximo</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Configurações Tab */}
          {activeTab === 'Configurações' && (
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Configurações do Sistema</h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800">Perfil</h3>
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nome de Usuário</label>
                      <input 
                        type="text" 
                        id="username" 
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" 
                        placeholder="Seu nome de usuário" 
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
                      <input 
                        type="email" 
                        id="email" 
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" 
                        placeholder="Seu e-mail" 
                      />
                    </div>
                    <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium">
                      Salvar Alterações
                    </button>
                  </form>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800">Preferências de Notificação</h3>
                  <form className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="email-notifications" className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                      <label htmlFor="email-notifications" className="text-sm text-gray-700">Notificações por E-mail</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="sms-notifications" className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                      <label htmlFor="sms-notifications" className="text-sm text-gray-700">Notificações por SMS</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="push-notifications" className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                      <label htmlFor="push-notifications" className="text-sm text-gray-700">Notificações Push</label>
                    </div>
                    <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium">
                      Salvar Preferências
                    </button>
                  </form>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800">Segurança</h3>
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">Nova Senha</label>
                      <input 
                        type="password" 
                        id="password" 
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" 
                        placeholder="Digite a nova senha" 
                      />
                    </div>
                    <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium">
                      Alterar Senha
                    </button>
                  </form>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800">Integrações</h3>
                  <form className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="integrate-payments" className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                      <label htmlFor="integrate-payments" className="text-sm text-gray-700">Integração com Pagamentos</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="integrate-shipping" className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                      <label htmlFor="integrate-shipping" className="text-sm text-gray-700">Integração com Logística</label>
                    </div>
                    <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium">
                      Salvar Integrações
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}