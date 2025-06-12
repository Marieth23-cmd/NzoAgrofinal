"use client";
import { useState, useEffect } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import {
 MdMenu, MdDashboard, MdGroup, MdShield, MdShoppingCart, MdInventory, MdBarChart,
  MdLocalShipping, MdHeadset, MdDeliveryDining, MdAssignment, MdNotifications, MdPerson,
  MdSearch, MdAttachMoney, MdEdit, MdDelete,MdLogout , MdAdd, MdSettings, MdCheck, MdClose
} from 'react-icons/md';
import { FaChartBar, FaUsers, FaBox, FaMoneyBillWave, FaSearch, FaSpinner } from 'react-icons/fa';
import { getProdutos, deletarProduto } from '../Services/produtos';
import { logout } from '../Services/auth';
import { useRouter } from 'next/navigation';
import { getUsuarios } from '../Services/user';
import { getPedidos } from '../Services/pedidos';
import { cadastrarTransportadora } from '../Services/transportadora';
import { ToastContainer, toast } from 'react-toastify';
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
  | 'Cadastrar Transportadora'
  | 'Gerenciamento de Usuarios'
  | 'Logout';

type UserType = 'Agricultor' | 'Comprador' | 'Fornecedor';
type UserStatus = 'Pendente' | 'Aprovado' | 'Rejeitado';
type NotificationType = 'info' | 'warning' | 'success' | 'error';
interface Produto {
  id_produtos: number;
  nome: string;
  foto_produto: string;
  quantidade: number;
  Unidade: string;
  preco: number;
  idUsuario: number;
  peso_kg: number;
  categoria: 'Frutas' | 'Graos' | 'Tubérculos' | 'Insumos' | 'Verduras';
}

interface Usuario {
  id_usuario: number;
  nome: string;
  tipo_usuario: string;
  data_criacao: string;
  status: UserStatus;
  foto?: string; // Made optional
}

interface Notificacao {
  id_notificacoes: number;
  titulo: string;
  mensagem: string;
  data_legivel: string;
  is_lida: number;
  type?: NotificationType;
}

interface ItemPedido {
  id_produto: number;
  quantidade_comprada: number;
  preco: number;
  subtotal: number;
  nome_produto?: string;
}

interface CategoriaContagem {
  Frutas: number;
  Graos: number;
  Tuberculos: number;
  Insumos: number;
  Verduras: number;
}

// Update the categorias object
const categorias: CategoriaContagem = {
  Frutas: 0,
  Graos: 0,
  Tuberculos: 0,
  Insumos: 0,
  Verduras: 0
};



interface Pedido {
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

interface FormDataTransportadora {
  nome: string;
  nif: string;
  contacto:string;
  email: string;
  senha: string;
  confirmar_senha: string;
  provincia_base: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('Dashboard');
  const [sidebarActive, setSidebarActive] = useState(false);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [notifications, setNotifications] = useState<Notificacao[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
 const [isLoadingTransportadoras, setIsLoadingTransportadoras] = useState(true);
  const [autenticado, setAutenticado] = useState<boolean | null>(null);
  const [errorTransportadoras, setErrorTransportadoras] = useState<string | null>(null);
  const [transportadoras, setTransportadoras] = useState<any[]>([]);
  const [formData, setFormData] = useState<FormDataTransportadora>({
    nome: '',
    nif: '',
    contacto: '',
    email: '',
    senha: '',
    confirmar_senha: '',
    provincia_base: ''
  });
  const [termoBusca, setTermoBusca] = useState('');
  const [carregandoPedidos, setCarregandoPedidos] = useState(true);
  const [erro, setErro] = useState<string>('');
  // No início do seu componente
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

  // Initial notifications data
  useEffect(() => {
    setNotifications([
      { id_notificacoes: 1, titulo: 'Novo Usuário', mensagem: 'João Silva solicitou cadastro como Agricultor', data_legivel: '5 min atrás', is_lida: 0 },
      { id_notificacoes: 2, titulo: 'Produto Esgotado', mensagem: 'Tomate - estoque zerado', data_legivel: '1 hora atrás', is_lida: 0 },
      { id_notificacoes: 3, titulo: 'Pedido Entregue', mensagem: 'Pedido #12343 foi entregue com sucesso', data_legivel: '2 horas atrás', is_lida: 1 },
      { id_notificacoes: 4, titulo: 'Problema de Pagamento', mensagem: 'Erro no pagamento do pedido #12340', data_legivel: '3 horas atrás', is_lida: 0 },
      { id_notificacoes: 5, titulo: 'Nova Transportadora', mensagem: 'TransRápido solicitou parceria', data_legivel: '1 dia atrás', is_lida: 1 }
    ]);
  }, []);

  // Fetch produtos
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

  const fetchUsuarios = async () => {
    try {
      const data = await getUsuarios();
      setUsuarios(data);
      console.log("Usuários carregados:", data);
    } catch (error) {
      setUsuarios([]);
      console.error("Erro ao buscar usuários:", error);
    }
  };
 useEffect(() => {
    fetchUsuarios();
  }, []); 

  const fetchPedidos = async () => {
    try {
      setCarregandoPedidos(true);
      setErro('');
      const data = await getPedidos();
      setPedidos(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Erro ao carregar pedidos:', error);
      setErro(error?.mensagem || 'Erro ao carregar pedidos');
      setPedidos([]);
    } finally {
      setCarregandoPedidos(false);
    }
  };

  // Fetch pedidos
  useEffect(() => {
    fetchPedidos();
  }, []);




  useEffect(() => {
  async function fetchCardsData() {
    try {
      // Contagem de usuários ativos
      const usuariosAtivos = Array.isArray(usuarios) 
        ? usuarios.filter(u => u.status === 'Aprovado').length 
        : 0;

      // Pedidos de hoje
      const hoje = new Date().toISOString().split('T')[0];
      const pedidosHoje = Array.isArray(pedidos)
        ? pedidos.filter(p => p.data_pedido.startsWith(hoje)).length
        : 0;

      // Produtos ativos e contagem por categoria
      const produtosAtivos = Array.isArray(produtos) ? produtos.length : 0;
      
      // Calcular total por categoria
      const categorias = {
        Frutas: 0,
        Graos: 0,
        Tuberculos: 0,
        Insumos: 0,
        Verduras: 0
      };

      produtos.forEach(produto => {
        const normalizedCategoria = produto.categoria.normalize('NFD').replace(/[\u0300-\u036f]/g, '') as keyof CategoriaContagem;
        if (normalizedCategoria in categorias) {
          categorias[normalizedCategoria]++;
        }
      });

      // Calcular receita mensal
      const mesAtual = new Date().getMonth() + 1;
      const receitaMensal = Array.isArray(pedidos)
        ? pedidos
            .filter(p => new Date(p.data_pedido).getMonth() + 1 === mesAtual)
            .reduce((total, pedido) => total + pedido.valor_total, 0)
        : 0;

      setCardsData({
        UsuariosActivo: usuariosAtivos,
        PedidosHoje: pedidosHoje,
        ProdutosAtivos: produtosAtivos,
        ReceitaMensal: receitaMensal / 1000 // Converter para milhares
      });

      // Atualizar dados do gráfico de categorias
      // Update setCategoryData call
setCategoryData({
  labels: ['Frutas', 'Graos', 'Tuberculos', 'Insumos', 'Verduras'],
  datasets: [{
    label: 'Produtos por Categoria',
    data: [
      categorias.Frutas,
      categorias.Graos,
      categorias.Tuberculos,
      categorias.Insumos,
      categorias.Verduras
    ],
    backgroundColor: ['#10b981', '#f59e42', '#3b82f6', '#f43f5e', '#8b5cf6'],
    borderWidth: 1,
  }]
});

    } catch (error) {
      console.error("Erro ao buscar dados dos cartões:", error);
      // ... error handling ...
    }
  }
  fetchCardsData();
}, [produtos, usuarios, pedidos]);

  const [Cardsdata, setCardsData] = useState({
    UsuariosActivo: 0,
    PedidosHoje: 0,
    ProdutosAtivos: 0,
    ReceitaMensal: 0
  });

  const markNotificationAsRead = (id_notificacoes: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id_notificacoes === id_notificacoes ? { ...n, is_lida: 1 } : n))
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'processando':
      case 'em trânsito':
        return 'bg-blue-100 text-blue-800';
      case 'entregue':
        return 'bg-green-100 text-green-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const formatarValor = (valor: number) => {
    return `AOA ${Number(valor).toLocaleString()}`;
  };

  const pedidosFiltrados = pedidos.filter(pedido =>
    pedido.id_pedido.toString().includes(termoBusca) ||
    pedido.nome_usuario?.toLowerCase().includes(termoBusca.toLowerCase()) ||
    pedido.estado?.toLowerCase().includes(termoBusca.toLowerCase())
  );

  const getNotificationIcon = (type?: NotificationType) => {
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

  const [categoryData, setCategoryData] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
      borderWidth: number;
    }[];
  }>({
    labels: ['Grãos', 'Tubérculos', 'Legumes', 'Frutas'],
    datasets: [
      {
        label: 'Produtos',
        data: [12, 19, 7, 5],
        backgroundColor: ['#10b981', '#f59e42', '#3b82f6', '#f43f5e'],
        borderWidth: 1,
      },
    ],
  });

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
      legend: { display: true, position: 'top' as const },
      title: { display: false },
    },
  };

useEffect(() => {
  if (activeTab === 'Controle de Pedidos') {
    fetchPedidos();
  }
}, [activeTab]);



const atualizarStatusPedido = async (idPedido: number, novoStatus: string) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Token não encontrado');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pedidos/${idPedido}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ estado: novoStatus })
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar status');
    }

    // Atualiza a lista de pedidos
    setPedidos(pedidos.map(pedido => 
      pedido.id_pedido === idPedido 
        ? { ...pedido, estado: novoStatus }
        : pedido
    ));

    toast.success('Status atualizado com sucesso!');
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    toast.error('Erro ao atualizar status do pedido');
  }
};

const fetchTransportadoras = () => {
  setIsLoadingTransportadoras(true);
  fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/transportadoras`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao buscar transportadoras');
      }
      return response.json();
    })
    .then(data => {
      setIsLoadingTransportadoras(false);
      setTransportadoras(data);
    })
    .catch(error => {
      setIsLoadingTransportadoras(false);
      setErrorTransportadoras('Erro ao buscar transportadoras');
      console.error('Erro ao buscar transportadoras:', error);
    });
};

useEffect(() => {
  fetchTransportadoras();
}, []);


  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={4000} />
      {/* Menu Toggle Button */}
      <button
        className="menu-toggle md:hidden fixed top-4 left-4 z-50 bg-marieth text-white p-2 rounded-md"
        onClick={handleMenuToggle}
      >
        <MdMenu size={24} />
      </button>

      {/* Sidebar */}
      <aside className={`sidebar fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-200 p-4 transition-transform duration-300 z-40 ${sidebarActive ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="mb-6 flex items-center justify-center">
          <h1 className="text-marieth text-2xl font-bold">NzoAgro</h1>
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Pesquisar..."
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <nav className="space-y-2">
          {(['Dashboard', 'Usuários', 'Produtos', 'Pedidos', 'Transportadoras', 'Relatórios', 'Logística', 'Suporte', 'Controle de Pedidos', 'Configurações',  'Cadastrar Transportadora', 'Gerenciamento de Usuarios'] as TabType[]).map((tab) => (
            <a
              key={tab}
              href="#"
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === tab ? 'bg-marieth text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-marieth'}`}
              onClick={(e) => { e.preventDefault(); handleTabChange(tab); }}
            >
              {tab === 'Dashboard' && <MdDashboard className="mr-3" size={20} />}
              {tab === 'Usuários' && <MdGroup className="mr-3" size={20} />}
              {tab === 'Produtos' && <MdInventory className="mr-3" size={20} />}
              {tab === 'Pedidos' && <MdShoppingCart className="mr-3" size={20} />}
              {tab === 'Transportadoras' && <MdDeliveryDining className="mr-3" size={20} />}
              {tab === 'Relatórios' && <MdBarChart className="mr-3" size={20} />}
              {tab === 'Logística' && <MdLocalShipping className="mr-3" size={20} />}
              {tab === 'Suporte' && <MdHeadset className="mr-3" size={20} />}
              {tab === 'Controle de Pedidos' && <MdAssignment className="mr-3" size={20} />}
              {tab === 'Configurações' && <MdSettings className="mr-3" size={20} />}
              {tab === 'Notificações' && <MdNotifications className="mr-3" size={20} />}
              {tab === 'Cadastrar Transportadora' && <MdAdd className="mr-3" size={20} />}
              {tab === 'Gerenciamento de Usuarios' && <MdEdit className="mr-3" size={20} />}
              
              {tab}
            </a>
          ))}
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
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{notifications.filter(n => n.is_lida === 0).length}</span>
            {notificationsOpen && (
              <div className="notifications-dropdown absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-800">Notificações</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notificacao) => (
                    <div
                      key={notificacao.id_notificacoes}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${notificacao.is_lida === 0 ? 'bg-blue-50' : ''}`}
                      onClick={() => markNotificationAsRead(notificacao.id_notificacoes)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">{getNotificationIcon(notificacao.type)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{notificacao.titulo}</p>
                          <p className="text-sm text-gray-500 mt-1">{notificacao.mensagem}</p>
                          <p className="text-xs text-gray-400 mt-1">{notificacao.data_legivel}</p>
                        </div>
                        {notificacao.is_lida === 0 && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-200">
                  <button className="text-sm text-marieth hover:text-green-700 font-medium">Ver todas as notificações</button>
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
                    <button 
              onClick={handleLogout}
              className="text-gray-600 hover:text-red-600 transition-colors"
            >
              <MdLogout size={24} />
            </button>
                  </div>

        </div>
      </header>


      {/* Main Content */}
      <main className="md:ml-72 mt-16 p-8">
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-2 min-w-max px-2 py-1">
            {(['Dashboard', 'Usuários', 'Produtos', 'Pedidos', 'Transportadoras', 'Relatórios', 'Logística', 'Suporte', 'Controle de Pedidos', 'Configurações', 'Notificações', 'Cadastrar Transportadora', 'Gerenciamento de Usuarios', 'Logout'] as TabType[]).map((tab) => (
              <button
                key={tab}
                className={`px-6 py-3 rounded-lg whitespace-nowrap transition-colors flex-shrink-0 ${activeTab === tab ? 'bg-marieth text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
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
                <div className="text-3xl font-bold text-marieth">
                    AOA {new Intl.NumberFormat('pt-AO').format(Cardsdata.ReceitaMensal)}K
                  </div>
                 </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Últimos Cadastros</h2>
                <button className="bg-marieth text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">Ver Todos</button>
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
                  {Array.isArray(usuarios) && usuarios.map((user, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <img src={user.foto || '/default-user.png'} alt={user.nome} className="w-8 h-8 rounded-full mr-3 inline-block" />
                        {user.nome}
                      </td>
                      <td className="py-3 px-4">{user.tipo_usuario}</td>
                      <td className="py-3 px-4">{user.data_criacao}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(user.status)}`}>{user.status}</span>
                      </td>
                      <td className="py-3 px-4">
                        <button className="bg-marieth text-white px-3 py-1 rounded hover:bg-green-700 transition-colors">
                          {user.status === 'Pendente' ? 'Aprovar' : user.status === 'Rejeitado' ? 'Revisar' : 'Detalhes'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
                <input type="search" placeholder="Buscar produtos..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.isArray(produtos) && produtos.map((produto) => (
                  <div key={produto.id_produtos} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-gray-100 flex items-center justify-center">
                      {produto.foto_produto ? <img src={produto.foto_produto} alt={produto.nome} className="h-full object-cover" /> : <span className="text-gray-400">Imagem do Produto</span>}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{produto.nome}</h3>
                      <p className="text-gray-600 mb-1">Vendedor: {produto.idUsuario}</p>
                      <p className="text-gray-600 mb-1">Preço: {produto.preco} AOA</p>
                      <p className="text-gray-600 mb-4">Quantidade: {produto.quantidade} {produto.Unidade}</p>
                      <div className="flex justify-between items-center">
                        <button className="flex items-center bg-marieth text-white px-3 py-2 rounded hover:bg-green-700 transition-colors">
                          <MdEdit className="mr-1" size={16} /> Editar
                        </button>
                        <button onClick={() => excluirProduto(produto.id_produtos)} className="flex items-center bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition-colors">
                          <MdDelete className="mr-1" size={16} /> Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
{activeTab === 'Usuários' && (
  <div className="bg-white rounded-lg shadow-sm mb-6">
    <div className="p-6 border-b border-gray-200 flex justify-between items-center">
      <h2 className="text-xl font-semibold text-gray-800">Gerenciamento de Usuários</h2>
      <div className="relative">
        <input 
          type="search" 
          placeholder="Buscar usuários..." 
          className="px-4 py-2 border border-gray-300 rounded-md w-80" 
        />
      </div>
    </div>
    <div className="p-6">
      {isLoading ? (
        <div className="text-center py-12">
          <FaSpinner className="animate-spin mx-auto h-8 w-8 text-marieth mb-4" />
          <p className="text-gray-600">Carregando usuários...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => fetchUsuarios()} 
            className="mt-4 px-4 py-2 bg-marieth text-white rounded-md"
          >
            Tentar novamente
          </button>
        </div>
      ) : usuarios.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Nenhum usuário encontrado</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="p-4 text-left">ID</th>
                <th className="p-4 text-left">Nome</th>
                <th className="p-4 text-left">Tipo</th>
                <th className="p-4 text-left">Data Cadastro</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((user) => (
                <tr key={user.id_usuario} className="hover:bg-gray-50">
                  <td className="p-4 border-b">{user.id_usuario}</td>
                  <td className="p-4 border-b">{user.nome}</td>
                  <td className="p-4 border-b">{user.tipo_usuario}</td>
                  <td className="p-4 border-b">{new Date(user.data_criacao).toLocaleDateString()}</td>
                  <td className="p-4 border-b">
                    <span className={`inline-block px-2 py-1 rounded-full text-sm ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 border-b">
                    <button className="px-3 py-1 bg-marieth text-white rounded hover:bg-green-700">
                      Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
)}
        {/* Cadastrar Transportadora Tab */}
        {activeTab === 'Cadastrar Transportadora' && (
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Cadastro de Transportadoras</h2>
              <div className="relative">
                <input type="search" placeholder="Buscar transportadoras..." className="px-4 py-2 border border-gray-300 rounded-md w-80 focus:outline-none focus:ring-2 focus:ring-marieth focus:border-transparent" />
              </div>
            </div>
            <div className="p-6">
              <form onSubmit={cadastrarTransportadoraHandler} className="space-y-4">
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome</label>
                  <input id="nome" value={formData.nome} onChange={handleInputChange} name="nome" type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-marieth focus:border-transparent" placeholder="Nome da Transportadora" />
                </div>
                <div>
                  <label htmlFor="nif" className="block text-sm font-medium text-gray-700">NIF</label>
                  <input id="nif" value={formData.nif} onChange={handleInputChange} name="nif" type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-marieth focus:border-transparent" placeholder="Número de Identificação Fiscal" />
                </div>
                <div>
                  <label htmlFor="contacto" className="block text-sm font-medium text-gray-700">Telefone</label>
                  <input id="contacto" value={formData.contacto} onChange={handleInputChange} name="contacto" type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-marieth focus:border-transparent" placeholder="Telefone de Contato" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input id="email" value={formData.email} onChange={handleInputChange} name="email" type="email" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-marieth focus:border-transparent" placeholder="Email de Contato" />
                </div>
                <div>
                  <label htmlFor="senha" className="block text-sm font-medium text-gray-700">Senha</label>
                  <input id="senha" value={formData.senha} onChange={handleInputChange} name="senha" type="password" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-marieth focus:border-transparent" placeholder="Senha de Acesso" />
                </div>
                <div>
                  <label htmlFor="confirmar_senha" className="block text-sm font-medium text-gray-700">Confirmação de Senha</label>
                  <input id="confirmar_senha" value={formData.confirmar_senha} onChange={handleInputChange} name="confirmar_senha" type="password" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-marieth focus:border-transparent" placeholder="Confirme sua senha" />
                </div>
                <div>
                  <label htmlFor="provincia_base" className="block text-sm font-medium text-gray-700">Província Base</label>
                  <input id="provincia_base" value={formData.provincia_base} onChange={handleInputChange} name="provincia_base" type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-marieth focus:border-transparent" placeholder="Província Base" />
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="px-6 py-2 bg-marieth text-white rounded-md hover:bg-green-700 transition-colors font-medium">Cadastrar Transportadora</button>
                </div>
              </form>
            </div>
          </div>
        )}

{/* VER TRANSPORTADORAS*/}
        {activeTab === 'Transportadoras' && (
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Gerenciamento de Transportadoras</h2>
              <div className="relative">
                <input type="search" placeholder="Buscar transportadoras..." className="px-4 py-2 border border-gray-300 rounded-md w-80 focus:outline-none focus:ring-2 focus:ring-marieth focus:border-transparent" />
              </div>
            </div>
            <div className="p-6">
              {isLoadingTransportadoras ? (
                <div className="text-center py-12">
                  <FaSpinner className="animate-spin mx-auto h-8 w-8 text-marieth mb-4" />
                  <p className="text-gray-600">Carregando transportadoras...</p>
                </div>
              ) : errorTransportadoras ? (
                <div className="text-center py-12">
                  <p className="text-red-600">{errorTransportadoras}</p>
                  <button 
                    onClick={() => fetchTransportadoras()} 
                    className="mt-4 px-4 py-2 bg-marieth text-white rounded-md"
                  >
                    Tentar novamente
                  </button>
                </div>
              ) : transportadoras.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">Nenhuma transportadora encontrada</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="p-4 text-left">ID</th>
                        <th className="p-4 text-left">Nome</th>
                        <th className="p-4 text-left">NIF</th>
                        <th className="p-4 text-left">Telefone</th>
                        <th className="p-4 text-left">Email</th>
                        <th className="p-4 text-left">Província Base</th>
                        <th className="p-4 text-left">Ações</th>
                      </
tr>
                    </thead>
                    <tbody>
                      {transportadoras.map((transportadora) => (
                        <tr key={transportadora.id_transportadora} className="hover:bg-gray-50">
                          <td className="p-4 border-b">{transportadora.id_transportadora}</td>
                          <td className="p-4 border-b">{transportadora.nome}</td>
                          <td className="p-4 border-b">{transportadora.nif}</td>
                          <td className="p-4 border-b">{transportadora.telefone}</td>
                          <td className="p-4 border-b">{transportadora.email}</td>
                          <td className="p-4 border-b">{transportadora.provincia_base}</td>
                          <td className="p-4 border-b">
                            <button className="px-3 py-1 bg-marieth text-white rounded hover:bg-green-700">
                              Detalhes
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}  







        {/* Pedidos Tab */}
        {activeTab === 'Pedidos' && (
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Gestão de Pedidos</h2>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  placeholder="Buscar pedidos..."
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-80 focus:outline-none focus:ring-2 focus:ring-marieth focus:border-transparent"
                />
              </div>
            </div>
            <div className="p-6">
              {carregandoPedidos ? (
                <div className="text-center py-12">
                  <FaSpinner className="animate-spin mx-auto h-8 w-8 text-marieth mb-4" />
                  <p className="text-gray-600">Carregando pedidos...</p>
                </div>
              ) : erro ? (
                <div className="text-center py-12">
                  <FaBox className="mx-auto h-16 w-16 text-red-400 mb-4" />
                  <p className="text-red-600 mb-4">{erro}</p>
                  <button onClick={() => fetchPedidos()} className="px-4 py-2 bg-marieth text-white rounded-md hover:bg-green-700 transition-colors">Tentar novamente</button>
                </div>
              ) : pedidos.length === 0 ? (
                <div className="text-center py-12">
                  <FaBox className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhum pedido encontrado</h3>
                  <p className="text-gray-600 mb-4">Ainda não há pedidos na plataforma ou nenhum pedido corresponde à sua busca.</p>
                  <button onClick={() => fetchPedidos()} className="px-4 py-2 bg-marieth text-white rounded-md hover:bg-green-700 transition-colors">Atualizar lista</button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-blue-600">Total de Pedidos</h4>
                      <p className="text-2xl font-bold text-blue-900">{pedidos.length}</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-yellow-600">Pendentes</h4>
                      <p className="text-2xl font-bold text-yellow-900">{pedidos.filter(p => p.estado?.toLowerCase() === 'pendente').length}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-green-600">Entregues</h4>
                      <p className="text-2xl font-bold text-green-900">{pedidos.filter(p => p.estado?.toLowerCase() === 'entregue').length}</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-red-600">Cancelados</h4>
                      <p className="text-2xl font-bold text-red-900">{pedidos.filter(p => p.estado?.toLowerCase() === 'cancelado').length}</p>
                    </div>
                  </div>
                  {termoBusca && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">
                        {pedidosFiltrados.length} pedido(s) encontrado(s) para "{termoBusca}"
                        {pedidosFiltrados.length === 0 && <span className="block mt-1 text-gray-500">Tente buscar por ID do pedido, nome do cliente ou status</span>}
                      </p>
                    </div>
                  )}
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
                        {Array.isArray(pedidosFiltrados) && pedidosFiltrados.map((pedido) => (
                          <tr key={pedido.id_pedido} className="hover:bg-gray-50">
                            <td className="p-4 border-b border-gray-200">#{pedido.id_pedido}</td>
                            <td className="p-4 border-b border-gray-200">
                              <div>
                                <p className="font-medium text-gray-900">{pedido.nome_usuario || 'Nome não disponível'}</p>
                                <p className="text-sm text-gray-500">{pedido.itens?.length || 0} item(s) no pedido</p>
                              </div>
                            </td>
                            <td className="p-4 border-b border-gray-200">{formatarData(pedido.data_pedido)}</td>
                            <td className="p-4 border-b border-gray-200 font-medium">{formatarValor(pedido.valor_total)}</td>
                            <td className="p-4 border-b border-gray-200">
                              <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(pedido.estado)}`}>{pedido.estado || 'Status não definido'}</span>
                            </td>
                            <td className="p-4 border-b border-gray-200">
                              <button className="px-4 py-2 bg-marieth text-white rounded-md hover:bg-green-700 transition-colors font-medium mr-2" onClick={() => console.log('Ver detalhes do pedido:', pedido)}>Detalhes</button>
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{pedido.itens?.length || 0} itens</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Relatórios Tab */}
        {activeTab === 'Relatórios' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Relatórios</h2>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center justify-center gap-4 cursor-pointer hover:-translate-y-1 transition-transform" onClick={() => alert("Gerando relatório de vendas...")}>
                  <FaChartBar className="text-5xl text-marieth" />
                  <h3 className="text-lg font-medium text-gray-800 text-center">Relatório de Vendas</h3>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center justify-center gap-4 cursor-pointer hover:-translate-y-1 transition-transform" onClick={() => alert("Gerando relatório de usuários...")}>
                  <FaUsers className="text-5xl text-marieth" />
                  <h3 className="text-lg font-medium text-gray-800 text-center">Relatório de Usuários</h3>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center justify-center gap-4 cursor-pointer hover:-translate-y-1 transition-transform" onClick={() => alert("Gerando relatório de produtos...")}>
                  <FaBox className="text-5xl text-marieth" />
                  <h3 className="text-lg font-medium text-gray-800 text-center">Relatório de Produtos</h3>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center justify-center gap-4 cursor-pointer hover:-translate-y-1 transition-transform" onClick={() => alert("Gerando relatório financeiro...")}>
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
              <button className="px-4 py-2 bg-marieth text-white rounded-md hover:bg-emerald-700 transition-colors">
                <MdAdd className="inline mr-2" size={16} /> Nova Rota
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
                      <td className="p-4 border-b border-gray-200"><span className="inline-block px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">Em Trânsito</span></td>
                      <td className="p-4 border-b border-gray-200">18:00</td>
                      <td className="p-4 border-b border-gray-200"><button className="px-3 py-1 bg-marieth text-white rounded hover:bg-green-700 transition-colors mr-2">Rastrear</button></td>
                    </tr>
                    <tr>
                      <td className="p-4 border-b border-gray-200">#RT002</td>
                      <td className="p-4 border-b border-gray-200">Expresso Angola</td>
                      <td className="p-4 border-b border-gray-200">Luanda - Huambo</td>
                      <td className="p-4 border-b border-gray-200"><span className="inline-block px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">Programada</span></td>
                      <td className="p-4 border-b border-gray-200">20:00</td>
                      <td className="p-4 border-b border-gray-200"><button className="px-3 py-1 bg-marieth text-white rounded hover:bg-green-700 transition-colors mr-2">Rastrear</button></td>
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
                    <div className="text-3xl font-bold text-marieth">47</div>
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
                  <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="">Todos os Status</option>
                    <option value="Aberto">Aberto</option>
                    <option value="Em Andamento">Em Andamento</option>
                    <option value="Resolvido">Resolvido</option>
                  </select>
                  <div className="relative">
                    <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input type="search" placeholder="Buscar tickets..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" />
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
                        <td className="p-4 border-b border-gray-200"><span className="inline-block px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">Alta</span></td>
                        <td className="p-4 border-b border-gray-200"><span className="inline-block px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">Em Andamento</span></td>
                        <td className="p-4 border-b border-gray-200">2023-08-17</td>
                        <td className="p-4 border-b border-gray-200"><button className="px-3 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors mr-2">Responder</button></td>
                      </tr>
                      <tr>
                        <td className="p-4 border-b border-gray-200">#SUP002</td>
                        <td className="p-4 border-b border-gray-200">Maria Santos</td>
                        <td className="p-4 border-b border-gray-200">Dúvida sobre entrega</td>
                        <td className="p-4 border-b border-gray-200"><span className="inline-block px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">Média</span></td>
                        <td className="p-4 border-b border-gray-200"><span className="inline-block px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">Aberto</span></td>
                        <td className="p-4 border-b border-gray-200">2023-08-17</td>
                        <td className="p-4 border-b border-gray-200"><button className="px-3 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors mr-2">Responder</button></td>
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
    {/* ... cards existentes ... */}
    
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            Controle Detalhado de Pedidos
          </h2>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Buscar pedido..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {carregandoPedidos ? (
          <div className="text-center py-12">
            <FaSpinner className="animate-spin mx-auto h-8 w-8 text-marieth mb-4" />
            <p className="text-gray-600">Carregando pedidos...</p>
          </div>
        ) : erro ? (
          <div className="text-center py-12">
            <p className="text-red-600">{erro}</p>
            <button 
              onClick={fetchPedidos}
              className="mt-4 px-4 py-2 bg-marieth text-white rounded-md hover:bg-green-700"
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="p-4 text-left">ID</th>
                  <th className="p-4 text-left">Cliente</th>
                  <th className="p-4 text-left">Valor Total</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Data</th>
                  <th className="p-4 text-left">Ações</th>
                </tr>
              </thead>
              <tbody>
                {pedidosFiltrados.map((pedido) => (
                  <tr key={pedido.id_pedido}>
                    <td className="p-4 border-b">#{pedido.id_pedido}</td>
                    <td className="p-4 border-b">{pedido.nome_usuario}</td>
                    <td className="p-4 border-b">{formatarValor(pedido.valor_total)}</td>
                    <td className="p-4 border-b">
                      <select
                        value={pedido.estado}
                        onChange={(e) => atualizarStatusPedido(pedido.id_pedido, e.target.value)}
                        className={`px-3 py-1 rounded-full text-sm ${getStatusColor(pedido.estado)}`}
                      >
                        <option value="Pendente">Pendente</option>
                        <option value="Em Processamento">Em Processamento</option>
                        <option value="Em Trânsito">Em Trânsito</option>
                        <option value="Entregue">Entregue</option>
                        <option value="Cancelado">Cancelado</option>
                      </select>
                    </td>
                    <td className="p-4 border-b">{formatarData(pedido.data_pedido)}</td>
                    <td className="p-4 border-b">
                      <button
                        onClick={() => console.log('Ver detalhes do pedido')}
                        className="px-3 py-1 bg-marieth text-white rounded-md hover:bg-green-700 mr-2"
                      >
                        Detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
                    <input type="text" id="username" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Seu nome de usuário" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
                    <input type="email" id="email" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Seu e-mail" />
                  </div>
                  <button type="submit" className="px-4 py-2 bg-marieth text-white rounded-md hover:bg-green-700 transition-colors font-medium">Salvar Alterações</button>
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
                  <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium">Salvar Preferências</button>
                </form>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">Segurança</h3>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Nova Senha</label>
                    <input type="password" id="password" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Digite a nova senha" />
                  </div>
                  <button type="submit" className="px-4 py-2 bg-marieth text-white rounded-md hover:bg-green-700 transition-colors font-medium">Alterar Senha</button>
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
                  <button type="submit" className="px-4 py-2 bg-marieth text-white rounded-md hover:bg-green-700 transition-colors font-medium">Salvar Integrações</button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Logout Tab */}
        {activeTab === 'Logout' ? null : null}
      </main>
    </div>
  );
}