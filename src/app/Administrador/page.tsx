"use client";
import { useState, useEffect } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import {
  MdMenu, MdDashboard, MdGroup, MdShield, MdShoppingCart, MdInventory, MdBarChart,
  MdLocalShipping, MdHeadset, MdDeliveryDining, MdAssignment, MdNotifications, MdPerson,
  MdSearch, MdAttachMoney, MdEdit, MdDelete, MdAdd, MdSettings
} from 'react-icons/md';
import { FaChartBar, FaUsers, FaBox, FaMoneyBillWave } from 'react-icons/fa';
import { getProdutos, deletarProduto } from '../Services/produtos';
import { logout } from '../Services/auth';
import { useRouter } from 'next/navigation';
import { getUsuarios } from '../Services/user';
import { getPedidos } from '../Services/pedidos';
import {cadastrarTransportadora} from '../Services/transportadora';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

type TabType =
  | 'Dashboard'
  | 'Usuários'
  | 'Produtos'
  | 'Pedidos'
  | 'Transportadoras'
  | 'Relatórios'
  | 'Logística'
  | 'Suporte'
  | 'Controle de Pedidos'
  | 'Configurações'
  | 'Notificações'
  | 'Cadastro de Transportadora'
  | 'Gerenciamento de Usuarios'
  | 'Logout';
type TabTypeWithActions = TabType | 'Logout' | 'Cadastro de Transportadora' | 'Gerenciamento de Usuarios';
type UserType = 'Agricultor' | 'Comprador' | 'Fornecedor';
type UserStatus = 'Pendente' | 'Aprovado' | 'Rejeitado';

interface Produto {
  id_produtos: number;
  nome: string;
  foto_produto: string;
  quantidade: number;
  Unidade: string;
  preco: number;
  idUsuario: number;
  peso_kg: number;
}

interface usuarios {
  id_usuario: number;
  nome: string;
  tipo_usuario: string;
  data_criacao: string;
  status: UserStatus;
  foto: string;
}

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


interface CadastroTransportadora {
    nome: string;
    nif: string;
    telefone: string;
    email: string;
    senha: string;
    provincia_base?: string;
    confirmar_senha?: string;
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

  useEffect(() => {
    async function fetchPedidos() {
      try {
        const data = await getPedidos();
        setPedidos(data);
      } catch (error) {
        setPedidos([]);
        console.error("Erro ao buscar pedidos:", error);
      }
    }
    fetchPedidos();
  }, []);

  useEffect(() => {
    async function fetchCardsData() {
      try {
        const usuariosAtivos = usuario.filter(u => u.status === 'Aprovado').length;
        const pedidosHoje = pedidos.filter((p: Pedidos) => new Date(p.data_pedido).toDateString() === new Date().toDateString()).length;
        const produtosAtivos = produtos.length;
        const receitaMensal = pedidos.reduce((total: number, pedido: Pedidos) => total + pedido.valor_total, 0) / 1000;
        setCardsData({
          UsuariosActivo: usuariosAtivos,
          PedidosHoje: pedidosHoje,
          ProdutosAtivos: produtosAtivos,
          ReceitaMensal: receitaMensal
        });
      } catch (error) {
        setCardsData({
          UsuariosActivo: 0,
          PedidosHoje: 0,
          ProdutosAtivos: 0,
          ReceitaMensal: 0
        });
        console.error("Erro ao buscar dados dos cartões:", error);
      }
    }
    fetchCardsData();
  }, [produtos, usuario, pedidos]);

  const [Cardsdata, setCardsData] = useState({
    UsuariosActivo: 0,
    PedidosHoje: 0,
    ProdutosAtivos: 0,
    ReceitaMensal: 0
  });

  const markNotificationAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };
  const [showCadastroTransportadora, setShowCadastroTransportadora] = useState(false);
  const [showGerenciamentoUsuarios, setShowGerenciamentoUsuarios] = useState(false);
const [formData, setFormData] = useState<CadastroTransportadora>({
    nome: '',
    nif: '',
    telefone: '',
    email: '',
    senha: '',
    provincia_base: '',
    confirmar_senha: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCadastroTransportadora = () => {
    setShowCadastroTransportadora(!showCadastroTransportadora);
  };

  const handleGerenciamentoUsuarios = () => {
    setShowGerenciamentoUsuarios(!showGerenciamentoUsuarios);
  };
 const cadastrarTransportadoraHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.senha !== formData.confirmar_senha) {
      toast.error("As senhas não coincidem.");
      return;
    }
    try {
      const { confirmar_senha, ...dadosParaCadastro } = formData;
      const response = await cadastrarTransportadora(dadosParaCadastro);
      toast.success("Transportadora cadastrada com sucesso!");
      console.log("Transportadora cadastrada:", response);
    } catch (error) {
      console.error("Erro ao cadastrar transportadora:", error);
      toast.error("Erro ao cadastrar transportadora. Tente novamente mais tarde.");
    }
  }





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
        toast.success("Produto excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir produto. Tente novamente mais tarde.", error);
        toast.error("Erro ao excluir produto. Tente novamente mais tarde.");
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
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={4000} />
      {/* Menu Toggle Button */}
      <button
        className="menu-toggle md:hidden fixed top-4 left-4 z-50 bg-marieth text-white p-2 rounded-md sr-only"
        onClick={handleMenuToggle}
      >menu
        <MdMenu size={24} />
      </button>

      {/* Sidebar */}
      <aside className={`sidebar fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-200 p-4 transition-transform duration-300 z-40 ${sidebarActive ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="mb-6 flex items-center justify-center">
          <h1 className="text-marieth text-2xl font-bold">NzoAgro</h1>
        </div>
        <nav className="space-y-2">
          <a href="#" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'Dashboard' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-emerald-600'}`} onClick={e => { e.preventDefault(); handleTabChange('Dashboard'); }}><MdDashboard className="mr-3" size={20} />Dashboard</a>
          <a href="#" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'Usuários' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-emerald-600'}`} onClick={e => { e.preventDefault(); handleTabChange('Usuários'); }}><MdGroup className="mr-3" size={20} />Usuários</a>
          <a href="#" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'Produtos' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-emerald-600'}`} onClick={e => { e.preventDefault(); handleTabChange('Produtos'); }}><MdInventory className="mr-3" size={20} />Produtos</a>
          <a href="#" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'Pedidos' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-emerald-600'}`} onClick={e => { e.preventDefault(); handleTabChange('Pedidos'); }}><MdShoppingCart className="mr-3" size={20} />Pedidos</a>
          <a href="#" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'Transportadoras' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-emerald-600'}`} onClick={e => { e.preventDefault(); handleTabChange('Transportadoras'); }}><MdDeliveryDining className="mr-3" size={20} />Transportadoras</a>
          <a href="#" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'Relatórios' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-emerald-600'}`} onClick={e => { e.preventDefault(); handleTabChange('Relatórios'); }}><MdBarChart className="mr-3" size={20} />Relatórios</a>
          <a href="#" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'Logística' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-emerald-600'}`} onClick={e => { e.preventDefault(); handleTabChange('Logística'); }}><MdLocalShipping className="mr-3" size={20} />Logística</a>
          <a href="#" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'Suporte' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-emerald-600'}`} onClick={e => { e.preventDefault(); handleTabChange('Suporte'); }}><MdHeadset className="mr-3" size={20} />Suporte</a>
          <a href="#" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'Controle de Pedidos' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-emerald-600'}`} onClick={e => { e.preventDefault(); handleTabChange('Controle de Pedidos'); }}><MdAssignment className="mr-3" size={20} />Controle de Pedidos</a>
          <a href="#" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'Configurações' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-emerald-600'}`} onClick={e => { e.preventDefault(); handleTabChange('Configurações'); }}><MdSettings className="mr-3" size={20} />Configurações</a>
          <a href="#" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'Notificações' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-emerald-600'}`} onClick={e => { e.preventDefault(); handleTabChange('Notificações'); }}><MdNotifications className="mr-3" size={20} />Notificações</a>
          <a href="#" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'Logout' ? 'bg-red-600 text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-red-600'}`} onClick={e => { e.preventDefault(); setShowLogoutModal(true); }}><MdPerson className="mr-3" size={20} />Logout</a>
          <a href="#" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'Cadastro de Transportadora' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-emerald-600'}`} onClick={e => { e.preventDefault(); handleTabChange('Cadastro de Transportadora'); }}><MdAdd className="mr-3" size={20} />Cadastro de Transportadora</a>
          <a href="#" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'Gerenciamento de Usuarios' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-emerald-600'}`} onClick={e => { e.preventDefault(); handleTabChange('Gerenciamento de Usuarios'); }}><MdEdit className="mr-3" size={20} />Gerenciamento de Usuarios</a>
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
        <div className="flex items-center space-x-4 relative">
          <div className="relative">
            <MdNotifications className="text-gray-600 cursor-pointer" size={24} onClick={() => setNotificationsOpen(!notificationsOpen)} />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{notifications.filter(n => !n.read).length}</span>
            {notificationsOpen && (
              <div className="notifications-dropdown absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-800">Notificações</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
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
                  <button className="text-sm text-marieth hover:text-green-700 font-medium">
                    Ver todas as notificações
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-marieth rounded-full flex items-center justify-center">
              <MdPerson className="text-white" size={20} />
            </div>
            <div className="hidden sm:block">
              <span className="font-semibold text-gray-800">Admin</span>
            </div>
          </div>
        </div>
      </header>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirmar Logout</h3>
            <p className="text-gray-600 mb-6">Tem certeza que deseja terminar a sessão?</p>
            <div className="flex space-x-3 justify-end">
              <button
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                onClick={handleLogout}
              >
                Sim, Terminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="md:ml-72 mt-16 p-8">
        {/* Tabs */}
        {/* Tabs com scroll horizontal */}
<div className="mb-8 overflow-x-auto">
  <div className="flex gap-2 min-w-max px-2 py-1">
    {([
      'Dashboard',
      'Usuários', 
      'Produtos',
      'Pedidos',
      'Transportadoras',
      'Relatórios',
      'Logística',
      'Suporte',
      'Controle de Pedidos',
      'Configurações',
      'Notificações',
      'Logout',
      'Cadastro de Transportadora',
      'Gerenciamento de Usuarios'
    ] as TabType[]).map((tab) => (
      <button
        key={tab}
        className={`px-6 py-3 rounded-lg whitespace-nowrap transition-colors flex-shrink-0 ${
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
                <button className="bg-marieth text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
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
                  {Array.isArray(usuario) && usuario.map((user: usuarios, index: number) => (
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
                        <button className="bg-marieth text-white px-3 py-1 rounded hover:bg-green-700 transition-colors">
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
            {/* Produtos por Categoria */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold">Produtos por Categoria</h2>
              </div>
              <div className="p-6">
                <div className="h-80">
                  <Doughnut data={categoryData} options={{ responsive: true, maintainAspectRatio: false }} />
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
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.isArray(produtos) && produtos.map((produto) => (
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
                        <button className="flex items-center bg-marieth text-white px-3 py-2 rounded hover:bg-green-700 transition-colors">
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
            
        {/* Usuários Tab */}

        {activeTab === 'Usuários' && (
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Gerenciamento de Usuários</h2>
              <div className="relative">
                <input 
                  type="search" 
                  placeholder="Buscar usuários..." 
                  className="px-4 py-2 border border-gray-300 rounded-md w-80 focus:outline-none focus:ring-2 focus:ring-marieth focus:border-transparent" 
                />
              </div>
            </div>
            
            <div className="p-6">

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">ID</th>
                      <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Nome</th>
                      <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Tipo</th>
                      <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Data de Criação</th>
                      <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Status</th>
                      <th className="p-4 text-left border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    { Array.isArray(usuario) && usuario.map((user) => (
                      <tr key={user.id_usuario}>
                        <td className="p-4 border-b border-gray-200">{user.id_usuario}</td>
                        <td className="p-4 border-b border-gray-200">{user.nome}</td>
                        <td className="p-4 border-b border-gray-200">{user.tipo_usuario}</td>
                        <td className="p-4 border-b border-gray-200">{user.data_criacao}</td>
                        <td className={`p-4 border-b border-gray-200 ${getStatusColor(user.status)}`}>
                          {user.status}
                        </td> 
                        <td className="p-4 border-b border-gray-200">
                          <button className="px-4 py-2 bg-marieth text-white rounded-md hover:bg-green-700 transition-colors font-medium">
                            Detalhes
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

          {/* Transportadoras Tab */}
          {activeTab === 'Transportadoras' && (
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Cadastro de Transportadoras</h2>
                <div className="relative">
                  <input 
                    type="search" 
                    placeholder="Buscar transportadoras..." 
                    className="px-4 py-2 border border-gray-300 rounded-md w-80 focus:outline-none focus:ring-2 focus:ring-marieth focus:border-transparent" 
                  />
                </div>
              </div>
              
              <div className="p-6">

                <form onSubmit={cadastrarTransportadoraHandler} className="space-y-4">
                  <div>
                    <label  className="block text-sm font-medium text-gray-700">Nome</label>
                    <input value={formData.nome} onChange={handleInputChange} name="nome" type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-marieth focus:border-transparent" placeholder="Nome da Transportadora" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">NIF</label>
                    <input value={formData.nif} onChange={handleInputChange} name="nif" type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-marieth focus:border-transparent" placeholder="Número de Identificação Fiscal" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Telefone</label>
                    <input value={formData.telefone} onChange={handleInputChange} name="telefone" type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-marieth focus:border-transparent" placeholder="Telefone de Contato" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input value={formData.email} onChange={handleInputChange} name="email" type="email" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-marieth focus:border-transparent" placeholder="Email de Contato" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Senha</label>
                    <label htmlFor="senha"></label>
                    <input id="senha" value={formData.senha} onChange={handleInputChange} name="senha" type="password" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-marieth focus:border-transparent" placeholder="Senha de Acesso" />
                  </div>
                  <div>
                    <label htmlFor="confirmar_senha" className="block text-sm font-medium text-gray-700">Confirmação de Senha</label>
                    <input id="confirmar_senha" value={formData.confirmar_senha} onChange={handleInputChange} name="confirmar_senha" type="password" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-marieth focus:border-transparent" placeholder="Confirme sua senha" />
                  </div>
                  <div className="flex justify-end">
                    <button type="submit" className="px-6 py-2 bg-marieth text-white rounded-md hover:bg-green-700 transition-colors font-medium">
                      Cadastrar Transportadora
                    </button>
                  </div>
                </form>
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
                    className="px-4 py-2 border border-gray-300 rounded-md w-80 focus:outline-none focus:ring-2 focus:ring-marieth focus:border-transparent" 
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
                          <button className="px-4 py-2 bg-marieth text-white rounded-md hover:bg-green-700 transition-colors font-medium">
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
                          <button className="px-4 py-2 bg-marieth text-white rounded-md hover:bg-green-700 transition-colors font-medium">
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
                          <button className="px-4 py-2 bg-marieth text-white rounded-md hover:bg-green-700 transition-colors font-medium">
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
                    <FaChartBar className="text-5xl text-marieth" />
                    <h3 className="text-lg font-medium text-gray-800 text-center">Relatório de Vendas</h3>
                  </div>
                  <div 
                    className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center justify-center gap-4 cursor-pointer hover:-translate-y-1 transition-transform" 
                    onClick={() => alert("Gerando relatório de usuários...")}
                  >
                    <FaUsers className="text-5xl text-marieth" />
                    <h3 className="text-lg font-medium text-gray-800 text-center">Relatório de Usuários</h3>
                  </div>
                  <div 
                    className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center justify-center gap-4 cursor-pointer hover:-translate-y-1 transition-transform" 
                    onClick={() => alert("Gerando relatório de produtos...")}
                  >
                    <FaBox className="text-5xl text-marieth" />
                    <h3 className="text-lg font-medium text-gray-800 text-center">Relatório de Produtos</h3>
                  </div>
                  <div 
                    className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center justify-center gap-4 cursor-pointer hover:-translate-y-1 transition-transform" 
                    onClick={() => alert("Gerando relatório financeiro...")}
                  >
                    <FaMoneyBillWave className="text-5xl text-marieth" />
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
                <button className="px-4 py-2 bg-marieth text-white rounded-md hover:bg-emerald-700 transition-colors font-medium">
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
                        <p className="text-marieth text-sm font-medium">Entregues</p>
                        <p className="text-2xl font-bold text-green-800">156</p>
                      </div>
                      <MdDeliveryDining className="text-marieth" size={32} />
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
                          <button className="px-3 py-1 bg-marieth text-white rounded hover:bg-green-700 transition-colors mr-2">
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
                          <button className="px-3 py-1 bg-marieth text-white rounded hover:bg-green-700 transition-colors mr-2">
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
                      <div className="text-3xl font-bold text-yellow-600">47</div>
                    </div>
                    <MdHeadset className="text-marieth" size={32} />
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
                              <button className="px-3 py-1 bg-marieth text-white rounded hover:bg-green-700 transition-colors text-sm">
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
                              <button className="px-3 py-1 bg-marieth text-white rounded hover:bg-green-700 transition-colors text-sm">
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
                    <button type="submit" className="px-4 py-2 bg-marieth text-white rounded-md hover:bg-green-700 transition-colors font-medium">
                      Salvar Alterações
                    </button>
                  </form>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800">Preferências de Notificação</h3>
                  <form className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="email-notifications" className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-verdeaceso" />
                      <label htmlFor="email-notifications" className="text-sm text-gray-700">Notificações por E-mail</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="sms-notifications" className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-verdeaceso" />
                      <label htmlFor="sms-notifications" className="text-sm text-gray-700">Notificações por SMS</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="push-notifications" className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-verdeaceso" />
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
                    <button type="submit" className="px-4 py-2 bg-marieth text-white rounded-md hover:bg-green-700 transition-colors font-medium">
                      Alterar Senha
                    </button>
                  </form>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800">Integrações</h3>
                  <form className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="integrate-payments" className="h-4 w-4 text-marieth border-gray-300 rounded focus:ring-verdeaceso" />
                      <label htmlFor="integrate-payments" className="text-sm text-gray-700">Integração com Pagamentos</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="integrate-shipping" className="h-4 w-4 text-marieth border-gray-300 rounded focus:ring-verdeaceso" />
                      <label htmlFor="integrate-shipping" className="text-sm text-gray-700">Integração com Logística</label>
                    </div>
                    <button type="submit" className="px-4 py-2 bg-marieth text-white rounded-md hover:bg-green-700 transition-colors font-medium">
                      Salvar Integrações
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

       
      </main>
    </div>
  );
}