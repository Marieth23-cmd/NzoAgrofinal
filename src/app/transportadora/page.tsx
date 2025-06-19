'use client'
import React, { useState, useEffect } from 'react';
import { 
  FaHome,  FaTruck,  FaMapMarkerAlt,  FaBell,  FaCog,  FaPaperPlane, FaEnvelope,  FaCheck, 
  FaTimes,FaChartBar,FaBuilding,FaPhone,FaBox,FaArrowUp,FaArrowDown,FaEquals,FaCalendarAlt,
  FaMoneyBillWave,FaSpinner} from 'react-icons/fa';
import {listarEntregasPendentes,listarMinhasEntregas,listarMinhasFiliais,aceitarPedidoNotificar,
  atualizarStatusEntrega,cadastrarFilial,buscarMinhasNotificacoes} from '../Services/transportadora';
import {logout} from '../Services/auth'
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import { MdLogout } from 'react-icons/md';



interface Entrega {
  id: number;
  estado_entrega: string;
  data_entrega?: string;
  valor_total?: number;
}

interface Notificacao {
  id: number;
  titulo?: string;
  mensagem: string;
  created_at: string;
}

interface Pedido {
  id: number;
  // Adicione outras propriedades do pedido conforme necessário
}

interface Filial {
  id: number;
  provincia: string;
  bairro?: string;
  descricao?: string;
  // Adicione outras propriedades da filial conforme necessário
}

interface NovaFilial {
  provincia: string;
  bairro: string;
  descricao: string;
}

interface Stats {
  pedidosPendentes: number;
  entreguesHoje: number;
  emTransito: number;
  receitaMensal: number;
}



const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('pedidos');
  const [selectedFilial, setSelectedFilial] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [auntenticado , setAutenticado]=useState<boolean | null>(null)
  const router =useRouter()

  const handleLogout = async () => {
    try {
      await logout();
      setAutenticado(false);
      router.push("/login");
    } catch (error) {
      console.log("Erro ao terminar sessão:", error);
    }
  };

  // Estados para dados da API - Tipados corretamente
  const [pedidosPendentes, setPedidosPendentes] = useState<Pedido[]>([]);
  const [minhasEntregas, setMinhasEntregas] = useState<Entrega[]>([]);
  const [minhasFiliais, setMinhasFiliais] = useState<Filial[]>([]);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  
  const [stats, setStats] = useState<Stats>({
    pedidosPendentes: 0,
    entreguesHoje: 0,
    emTransito: 0,
    receitaMensal: 0
  });

  // Estados para novo cadastro de filial
  const [novaFilial, setNovaFilial] = useState<NovaFilial>({
    provincia: '',
    bairro: '',
    descricao: ''
  });
  const [showNovaFilialForm, setShowNovaFilialForm] = useState(false);

  // useEffects individuais para carregar dados
  // 1. useEffect para carregar pedidos pendentes
  useEffect(() => {
    carregarPedidosPendentes();
  }, []);

  // 2. useEffect para carregar minhas entregas
  useEffect(() => {
    carregarMinhasEntregas();
  }, []);

  // 3. useEffect para carregar filiais
  useEffect(() => {
    carregarMinhasFiliais();
  }, []);

  // 4. useEffect para carregar notificações
  useEffect(() => {
    carregarNotificacoes();
  }, []);

  // 5. useEffect para atualizar stats quando os dados mudarem
  useEffect(() => {
    if (minhasEntregas.length > 0 || pedidosPendentes.length > 0) {
      const hoje = new Date().toDateString();
      const entreguesHoje = minhasEntregas.filter((e: Entrega) => 
        e.estado_entrega === 'entregue' && 
        e.data_entrega && new Date(e.data_entrega).toDateString() === hoje
      ).length;
      
      const emTransito = minhasEntregas.filter((e: Entrega) => 
        e.estado_entrega === 'em_transito'
      ).length;

      const receitaMensal = minhasEntregas
        .filter((e: Entrega) => e.estado_entrega === 'entregue')
        .reduce((total: number, e: Entrega) => {
          const valorEntrega = Number(e.valor_total) || 0;
          return total + valorEntrega;
        }, 0);

      setStats({
        pedidosPendentes: pedidosPendentes.length,
        entreguesHoje,
        emTransito,
        receitaMensal
      });
    }
  }, [minhasEntregas, pedidosPendentes]);

  // Funções para carregar dados individuais
  const carregarPedidosPendentes = async () => {
    try {
      const response = await listarEntregasPendentes();
      if (response.sucesso) {
        setPedidosPendentes(response.dados || []);
      }
    } catch (error) {
      console.error('Erro ao carregar pedidos pendentes:', error);
    }
  };

  const carregarMinhasEntregas = async () => {
    try {
      const response = await listarMinhasEntregas();
      if (response.sucesso) {
        const entregas: Entrega[] = response.dados || [];
        setMinhasEntregas(entregas);
        // Stats são calculadas no useEffect específico
      }
    } catch (error) {
      console.error('Erro ao carregar minhas entregas:', error);
    }
  };

  const carregarMinhasFiliais = async () => {
    try {
      const response = await listarMinhasFiliais();
      if (response.sucesso) {
        setMinhasFiliais(response.dados || []);
      }
    } catch (error) {
      console.error('Erro ao carregar filiais:', error);
    }
  };

  const carregarNotificacoes = async () => {
    try {
      const response = await buscarMinhasNotificacoes();
      if (response.sucesso) {
        setNotificacoes(response.dados || []);
      }
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    }
  };

  // Nova função para recarregar todos os dados (para botão "Atualizar")
  const recarregarTodosDados = async () => {
    setLoading(true);
    try {
      await Promise.all([
        carregarPedidosPendentes(),
        carregarMinhasEntregas(),
        carregarMinhasFiliais(),
        carregarNotificacoes()
      ]);
    } catch (error) {
      console.error('Erro ao recarregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilialSelect = (pedidoId: string, filialId: number) => {
    setSelectedFilial({ ...selectedFilial, [pedidoId]: filialId });
  };

  const aceitarPedido = async (pedido: Pedido) => {
    const filialId = selectedFilial[pedido.id];
    if (!filialId) {
      toast.warn('Selecione uma filial primeiro!');
      return;
    }

    setLoading(true);
    try {
      const response = await aceitarPedidoNotificar({
        pedidos_id: pedido.id,
        filial_retirada_id: filialId,
        observacoes: 'Pedido aceito via dashboard'
      });

      if (response.sucesso) {
        toast.success('Pedido aceito com sucesso!');
        // Recarregar apenas os dados necessários
        await carregarPedidosPendentes(); // Remove o pedido aceito da lista
        await carregarMinhasEntregas();   // Adiciona à lista de entregas
      } else {
        toast.error(response.mensagem || 'Erro ao aceitar pedido');
      }
    } catch (error: any) {
      console.error('Erro ao aceitar pedido:', error);
      toast.error(error.mensagem || 'Erro ao aceitar pedido');
    } finally {
      setLoading(false);
    }
  };

  const atualizarStatus = async (entregaId: number, novoStatus: string) => {
    setLoading(true);
    try {
      const response = await atualizarStatusEntrega(entregaId, novoStatus);
      if (response.sucesso) {
        alert('Status atualizado com sucesso!');
        await carregarMinhasEntregas(); // Recarrega apenas as entregas
      } else {
        toast.error(response.mensagem || 'Erro ao atualizar status');
      }
    } catch (error: any) {
      console.error('Erro ao atualizar status:', error);
      toast.error(error.mensagem || 'Erro ao atualizar status');
    } finally {
      setLoading(false);
    }
  };

  const criarNovaFilial = async () => {
    if (!novaFilial.provincia) {
      alert('Província é obrigatória!');
      return;
    }

    setLoading(true);
    try {
      const response = await cadastrarFilial(novaFilial);
      if (response.sucesso) {
        toast.success('Filial cadastrada com sucesso!');
        setShowNovaFilialForm(false);
        setNovaFilial({ provincia: '', bairro: '', descricao: '' });
        await carregarMinhasFiliais(); // Recarrega apenas as filiais
      } else {
        toast.error(response.mensagem || 'Erro ao cadastrar filial');
      }
    } catch (error: any) {
      console.error('Erro ao cadastrar filial:', error);
      toast.error(error.mensagem || 'Erro ao cadastrar filial');
    } finally {
      setLoading(false);
    }
  };

  const formatarMoeda = (valor: number): string => {
    const valorNumerico = Number(valor) || 0;
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0
    }).format(valorNumerico).replace('AOA', 'Kz');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-orange-100 text-orange-800';
      case 'em_transito': return 'bg-blue-100 text-blue-800';
      case 'entregue': return 'bg-green-100 text-green-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pendente': return 'Pendente';
      case 'em_transito': return 'Em Trânsito';
      case 'entregue': return 'Entregue';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  const renderNotificacoes = () => (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-gray-800">Notificações</h3>
      </div>
      <div className="max-h-64 overflow-y-auto">
        {notificacoes.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Nenhuma notificação
          </div>
        ) : (
          notificacoes.map((notificacao: Notificacao) => (
            <div key={notificacao.id} className="p-4 border-b hover:bg-gray-50">
              <div className="text-sm font-medium text-gray-800">
                {notificacao.titulo || 'Notificação'}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {notificacao.mensagem}
              </div>
              <div className="text-xs text-gray-400 mt-2">
                {new Date(notificacao.created_at).toLocaleString('pt-AO')}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderPedidos = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-2xl text-orange-500 font-bold">{pedidosPendentes.length}</div>
          <div className="text-gray-700 mt-2">Pedidos Pendentes</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-2xl text-marieth font-bold">{stats.entreguesHoje}</div>
          <div className="text-gray-700 mt-2">Entregues Hoje</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-2xl text-blue-600 font-bold">{stats.emTransito}</div>
          <div className="text-gray-700 mt-2">Em Trânsito</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-2xl text-purple-600 font-bold">{formatarMoeda(stats.receitaMensal)}</div>
          <div className="text-gray-700 mt-2">Receita Mensal</div>
        </div>
      </div>

      {/* Lista de Pedidos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {pedidosPendentes.length === 0 ? (
          <div className="col-span-2 text-center py-8 text-gray-500">
            Nenhum pedido pendente encontrado
          </div>
        ) : (
          pedidosPendentes.map((pedido: any) => (
            <div key={pedido.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                {/* Header do Pedido */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">#{pedido.id}</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(pedido.estado_entrega || 'pendente')}`}>
                      {getStatusText(pedido.estado_entrega || 'pendente')}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    📦 {pedido.tipo_entrega || 'Normal'}
                  </div>
                </div>

                {/* Informações do Cliente */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-start gap-2">
                    <FaMapMarkerAlt className="text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-800">{pedido.nome_cliente || 'Cliente'}</p>
                      <p className="text-sm text-gray-600">{pedido.endereco_entrega}</p>
                      <p className="text-sm text-marieth">{pedido.distancia || 'Calculando...'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <FaPhone className="text-marieth" />
                    <span className="text-sm text-gray-700">{pedido.contacto_cliente}</span>
                  </div>

                  <div className="flex items-start gap-2">
                    <FaBox className="text-orange-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-700">{pedido.descricao_produtos || 'Produtos diversos'}</p>
                      <p className="font-bold text-lg text-marieth mt-1">{formatarMoeda(pedido.valor_total || 0)}</p>
                    </div>
                  </div>
                </div>

                {/* Ações */}
                {pedido.estado_entrega === 'pendente' && (
                  <div className="border-t pt-4 space-y-3">
                    <div className="flex gap-2">
                      <select
                        className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
                        value={selectedFilial[pedido.id] || ''}
                        onChange={(e) => handleFilialSelect(pedido.id, parseInt(e.target.value))}
                        aria-label="Selecionar Filial"
                      >
                        <option value="">Selecionar Filial</option>
                        {minhasFiliais.map((filial: any) => (
                          <option key={filial.id} value={filial.id}>
                            {filial.provincia} - {filial.bairro || 'Centro'}
                          </option>
                        ))}
                      </select>
                      <button 
                        onClick={() => aceitarPedido(pedido)}
                        disabled={loading}
                        className="bg-marieth hover:bg-verdeaceso text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors disabled:opacity-50"
                      >
                        {loading ? <FaSpinner className="animate-spin" /> : <FaPaperPlane className="text-sm" />}
                        Aceitar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Minhas Entregas em Andamento */}
      {minhasEntregas.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Minhas Entregas em Andamento</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {minhasEntregas
              .filter((entrega: any) => entrega.estado_entrega !== 'entregue')
              .map((entrega: any) => (
                <div key={entrega.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">#{entrega.id}</h3>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(entrega.estado_entrega)}`}>
                          {getStatusText(entrega.estado_entrega)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="text-sm"><strong>Cliente:</strong> {entrega.nome_cliente}</p>
                      <p className="text-sm"><strong>Endereço:</strong> {entrega.endereco_entrega}</p>
                      <p className="text-sm"><strong>Valor:</strong> {formatarMoeda(entrega.valor_total || 0)}</p>
                    </div>

                    <div className="flex gap-2">
                      {entrega.estado_entrega === 'aceite' && (
                        <button 
                          onClick={() => atualizarStatus(entrega.id, 'em_transito')}
                          disabled={loading}
                          className="bg-marieth hover:bg-verdeaceso text-white px-3 py-2 rounded text-sm flex-1 disabled:opacity-50"
                        >
                          Iniciar Entrega
                        </button>
                      )}
                      {entrega.estado_entrega === 'em_transito' && (
                        <button 
                          onClick={() => atualizarStatus(entrega.id, 'entregue')}
                          disabled={loading}
                          className="bg-marieth hover:bg-verdeaceso text-white px-3 py-2 rounded text-sm flex-1 disabled:opacity-50"
                        >
                          Finalizar Entrega
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderFiliais = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Gestão de Filiais</h2>
        <button 
          onClick={() => setShowNovaFilialForm(true)}
          className="bg-marieth hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <FaBuilding /> Nova Filial
        </button>
      </div>

      {/* Formulário Nova Filial */}
      {showNovaFilialForm && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4">Cadastrar Nova Filial</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Província *"
              value={novaFilial.provincia}
              onChange={(e) => setNovaFilial({...novaFilial, provincia: e.target.value})}
              className="p-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="Bairro"
              value={novaFilial.bairro}
              onChange={(e) => setNovaFilial({...novaFilial, bairro: e.target.value})}
              className="p-2 border border-gray-300 rounded-md"
            />
          </div>
          <textarea
            placeholder="Descrição"
            value={novaFilial.descricao}
            onChange={(e) => setNovaFilial({...novaFilial, descricao: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
            rows={3}
          />
          <div className="flex gap-2">
            <button 
              onClick={criarNovaFilial}
              disabled={loading}
              className="bg-marieth hover:bg-verdeaceso text-white px-4 py-2 rounded-md disabled:opacity-50"
            >
              {loading ? <FaSpinner className="animate-spin" /> : 'Cadastrar'}
            </button>
            <button 
              onClick={() => setShowNovaFilialForm(false)}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de Filiais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {minhasFiliais.length === 0 ? (
          <div className="col-span-3 text-center py-8 text-gray-500">
            Nenhuma filial cadastrada
          </div>
        ) : (
          minhasFiliais.map((filial: any) => (
            <div key={filial.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center gap-3 mb-4">
                <FaBuilding className="text-marieth text-xl" />
                <h3 className="font-bold text-lg text-gray-800">{filial.provincia}</h3>
              </div>
              <div className="space-y-2 mb-4">
                <p className="text-gray-600"><strong>Bairro:</strong> {filial.bairro || 'Não informado'}</p>
                <p className="text-gray-600"><strong>Descrição:</strong> {filial.descricao || 'Não informado'}</p>
                <p className="text-sm text-gray-500">Criada em: {new Date(filial.created_at).toLocaleDateString('pt-AO')}</p>
              </div>
              <div className="flex gap-2">
                <button className="bg-white  border-marieth text-marieth px-3 py-1 rounded text-sm flex-1">
                  Editar
                </button>
                <button className="bg-marieth text-white px-3 py-1 rounded text-sm flex-1">
                  Ver Entregas
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderRelatorios = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Relatórios e Estatísticas</h2>
      
      {/* Stats Cards Mensais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Total de Entregas</h3>
              <p className="text-3xl font-bold text-marieth">{minhasEntregas.length}</p>
              <div className="flex items-center mt-2 text-marieth">
                <FaArrowUp className="mr-1" />
                <span className="text-sm">Todas as entregas</span>
              </div>
            </div>
            <FaTruck className="text-4xl text-blue-200" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Receita Total</h3>
              <p className="text-3xl font-bold text-marieth">{formatarMoeda(stats.receitaMensal)}</p>
              <div className="flex items-center mt-2 text-marieth">
                <FaArrowUp className="mr-1" />
                <span className="text-sm">Valor acumulado</span>
              </div>
            </div>
            <FaMoneyBillWave className="text-4xl text-green-50" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Filiais Ativas</h3>
              <p className="text-3xl font-bold text-purple-600">{minhasFiliais.length}</p>
              <div className="flex items-center mt-2 text-gray-600">
                <FaEquals className="mr-1" />
                <span className="text-sm">Total cadastradas</span>
              </div>
            </div>
            <FaBuilding className="text-4xl text-purple-200" />
          </div>
        </div>
      </div>

      {/* Histórico de Entregas */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FaChartBar className="text-marieth" />
          Histórico de Entregas
        </h3>
        <div className="space-y-3">
          {minhasEntregas.slice(0, 10).map((entrega: any, index) => (
            <div key={entrega.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <span className="font-medium">#{entrega.id}</span>
                <span className="text-gray-600 ml-2">{entrega.nome_cliente}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded text-xs ${getStatusColor(entrega.estado_entrega)}`}>
                  {getStatusText(entrega.estado_entrega)}
                </span>
                <span className="text-marieth font-bold">{formatarMoeda(entrega.valor_total || 0)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading && pedidosPendentes.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-marieth mx-auto mb-4" />
          <p>Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    
    <div className="grid grid-cols-[250px_1fr] min-h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={4000} />
      {/* Sidebar */}
      <aside className="bg-white p-4 border-r border-gray-200">
        <div className="text-center p-4 mb-8 font-bold text-xl text-marieth">
          Transporte NzoAgro
        </div>
        <ul className="space-y-2">
          <li>
            <button 
              onClick={() => setActiveTab('pedidos')}
              className={`flex items-center p-3 w-full text-left rounded-md gap-2 transition-colors ${
                activeTab === 'pedidos' ? 'bg-green-50 text-marieth' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FaTruck /> Pedidos
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveTab('filiais')}
              className={`flex items-center p-3 w-full text-left rounded-md gap-2 transition-colors ${
                activeTab === 'filiais' ? 'bg-green-50 text-marieth' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FaBuilding /> Filiais
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveTab('relatorios')}
              className={`flex items-center p-3 w-full text-left rounded-md gap-2 transition-colors ${
                activeTab === 'relatorios' ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FaChartBar /> Relatórios
            </button>
          </li>
          <li>
            <button 
              onClick={carregarNotificacoes}
              className="flex items-center p-3 w-full text-left text-gray-700 hover:bg-gray-100 rounded-md gap-2"
            >
              <FaBell /> 
              Notificações 
              {notificacoes.length > 0 && (
                <span className="bg-green-600 text-white text-xs rounded-full px-2 py-1 ml-auto">
                  {notificacoes.length}
                </span>
              )}
            </button>
          </li>
          <li>
            <button className="flex items-center p-3 w-full text-left text-gray-700 hover:bg-gray-100 rounded-md gap-2">
              <FaCog /> Configurações
            </button>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
       <main className="p-8 overflow-y-auto ">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {activeTab === 'pedidos' ? 'Painel de Pedidos' :
             activeTab === 'filiais' ? 'Gestão de Filiais' :
             'Relatórios e Estatísticas'}
          </h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={recarregarTodosDados}
              disabled={loading}
              className="bg-marieth hover:bg-verdeaceso text-white px-4 py-2 rounded-md flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <FaArrowUp />}
              Atualizar
            </button>

            <div className="text-sm text-gray-600">
              Última atualização: {new Date().toLocaleString('pt-AO')}
            </div>
              <div>
                 <button 
                 onClick={handleLogout}
                className="text-gray-600 hover:text-red-600 transition-colors sr-only"
                >terminar <MdLogout size={24} /></button>
                                
              </div>
           
          </div>
        </div>

        {activeTab === 'pedidos' && renderPedidos()}
        {activeTab === 'filiais' && renderFiliais()}
        {activeTab === 'relatorios' && renderRelatorios()}
        {activeTab === 'notificacoes' && renderNotificacoes()}
        
      </main>
    </div>
  );
};

export default Dashboard;