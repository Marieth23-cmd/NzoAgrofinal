'use client'
import React, { useState, useEffect } from 'react';
import { 
  FaHome,  FaTruck,  FaMapMarkerAlt,  FaBell,  FaCog,  FaPaperPlane, FaEnvelope,  FaCheck, 
  FaTimes,FaChartBar,FaBuilding,FaPhone,FaBox,FaArrowUp,FaArrowDown,FaEquals,FaCalendarAlt,
  FaMoneyBillWave,FaSpinner} from 'react-icons/fa';
import { ProdutosProntos,listarMinhasEntregas,listarMinhasFiliais,aceitarPedidoNotificar,
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
  nome_cliente?: string;
  endereco_entrega?: string;
}

interface Notificacao {
  id: number;
  titulo?: string;
  mensagem: string;
  created_at: string;
  lida:string;
}

interface Pedido {
  id: number;
  estado_entrega?: string;
  nome_cliente?: string;
  endereco_entrega?: string;
  contacto_cliente?: string;
  descricao_produtos?: string;
  valor_total?: number;
  tipo_entrega?: string;
  distancia?: string;
}

interface Filial {
  id: number;
  provincia: string;
  bairro?: string;
  descricao?: string;
  created_at?: string;
}

interface NovaFilial {
  provincia: string;
  bairro: string;
  descricao: string;
}

interface Stats {
  entreguesHoje: number;
  emTransito: number;
  receitaMensal: number;
  pedidosProntos:number;
}

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('pedidos');
  const [selectedFilial, setSelectedFilial] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [autenticado, setAutenticado] = useState<boolean | null>(null);
  const [showNotificacoes, setShowNotificacoes] = useState<boolean>(false);
  const router = useRouter();

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
      setAutenticado(false);
      router.push("/login");
    } catch (error) {
      console.log("Erro ao terminar sessão:", error);
    }
  };

  // Estados para dados da API - Tipados corretamente
  const [pedidosProntos, setPedidosProntos] = useState<Pedido[]>([]);
  const [minhasEntregas, setMinhasEntregas] = useState<Entrega[]>([]);
  const [minhasFiliais, setMinhasFiliais] = useState<Filial[]>([]);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  
  const [stats, setStats] = useState<Stats>({
    pedidosProntos: 0,
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
  const [showNovaFilialForm, setShowNovaFilialForm] = useState<boolean>(false);

  // useEffects individuais para carregar dados
  useEffect(() => {
    carregarProdutosProntos();
  }, []);

  useEffect(() => {
    carregarMinhasEntregas();
  }, []);

  useEffect(() => {
    carregarMinhasFiliais();
  }, []);

  useEffect(() => {
    carregarNotificacoes();
  }, []);

  useEffect(() => {
    if (minhasEntregas.length > 0 || pedidosProntos.length > 0) {
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
       pedidosProntos: pedidosProntos.length,
        entreguesHoje,
        emTransito,
        receitaMensal
      });
    }
  }, [minhasEntregas, pedidosProntos]);

  // Funções para carregar dados individuais
  const carregarProdutosProntos = async (): Promise<void> => {
  try {
    const response = await ProdutosProntos();
    setPedidosProntos(response.pedidos || []);
  } catch (error) {
    console.error('Erro ao carregar pedidos prontos:', error);
  }
};

  const carregarMinhasEntregas = async (): Promise<void> => {
    try {
      const response = await listarMinhasEntregas();
      if (response.sucesso) {
        const entregas: Entrega[] = response.dados || [];
        setMinhasEntregas(entregas);
      }
    } catch (error) {
      console.error('Erro ao carregar minhas entregas:', error);
    }
  };

  const carregarMinhasFiliais = async (): Promise<void> => {
    try {
      const response = await listarMinhasFiliais();
      
        setMinhasFiliais(response.filiais || []);
     
    } catch (error) {
      console.error('Erro ao carregar filiais:', error);
    }
  };

  const carregarNotificacoes = async (): Promise<void> => {
    try {
      const response = await buscarMinhasNotificacoes();
      
        setNotificacoes(response.notificacoes|| []);
      
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    }
  };

  // Nova função para recarregar todos os dados
  const recarregarTodosDados = async (): Promise<void> => {
    setLoading(true);
    try {
      await Promise.all([
        carregarProdutosProntos(),
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

  const handleFilialSelect = (pedidoId: number, filialId: number): void => {
    setSelectedFilial({ ...selectedFilial, [pedidoId]: filialId });
  };

  const aceitarPedido = async (pedido: Pedido): Promise<void> => {
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
        await carregarProdutosProntos();
        await carregarMinhasEntregas();
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

  const atualizarStatus = async (entregaId: number, novoStatus: string): Promise<void> => {
    setLoading(true);
    try {
      const response = await atualizarStatusEntrega(entregaId, novoStatus);
      if (response.sucesso) {
        toast.success('Status atualizado com sucesso!');
        await carregarMinhasEntregas();
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

  const criarNovaFilial = async (): Promise<void> => {
    if (!novaFilial.provincia) {
      toast.error('Província é obrigatória!');
      return;
    }

    setLoading(true);
    try {
      const response = await cadastrarFilial(novaFilial);
      if (response.sucesso) {
        toast.success('Filial cadastrada com sucesso!');
        setShowNovaFilialForm(false);
        setNovaFilial({ provincia: '', bairro: '', descricao: '' });
        await carregarMinhasFiliais();
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

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pendente': return 'bg-orange-100 text-orange-800';
      case 'em_transito': return 'bg-blue-100 text-blue-800';
      case 'entregue': return 'bg-green-100 text-green-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'pendente': return 'Pendente';
      case 'em_transito': return 'Em Trânsito';
      case 'entregue': return 'Entregue';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };



  const renderPedidos = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-2xl text-orange-500 font-bold">{pedidosProntos.length}</div>
          <div className="text-gray-700 mt-2">Pedidos em Trânsito</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-2xl text-green-600 font-bold">{stats.entreguesHoje}</div>
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
        {pedidosProntos.length === 0 ? (
          <div className="col-span-2 text-center py-8 text-gray-500">
            Nenhum pedido pendente encontrado
          </div>
        ) : (
          pedidosProntos.map((pedido: Pedido) => (
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
                      <p className="text-sm text-green-600">{pedido.distancia || 'Calculando...'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <FaPhone className="text-green-600" />
                    <span className="text-sm text-gray-700">{pedido.contacto_cliente}</span>
                  </div>

                  <div className="flex items-start gap-2">
                    <FaBox className="text-orange-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-700">{pedido.descricao_produtos || 'Produtos diversos'}</p>
                      <p className="font-bold text-lg text-green-600 mt-1">{formatarMoeda(pedido.valor_total || 0)}</p>
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
                        {minhasFiliais.map((filial: Filial) => (
                          <option key={filial.id} value={filial.id}>
                            {filial.provincia} - {filial.bairro || 'Centro'}
                          </option>
                        ))}
                      </select>
                      <button 
                        onClick={() => aceitarPedido(pedido)}
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors disabled:opacity-50"
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
              .filter((entrega: Entrega) => entrega.estado_entrega !== 'entregue')
              .map((entrega: Entrega) => (
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
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm flex-1 disabled:opacity-50"
                        >
                          Iniciar Entrega
                        </button>
                      )}
                      {entrega.estado_entrega === 'em_transito' && (
                        <button 
                          onClick={() => atualizarStatus(entrega.id, 'entregue')}
                          disabled={loading}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm flex-1 disabled:opacity-50"
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
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
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
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
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
          minhasFiliais.map((filial: Filial) => (
            <div key={filial.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center gap-3 mb-4">
                <FaBuilding className="text-green-600 text-xl" />
                <h3 className="font-bold text-lg text-gray-800">{filial.provincia}</h3>
              </div>
              <div className="space-y-2 mb-4">
                <p className="text-gray-600"><strong>Bairro:</strong> {filial.bairro || 'Não informado'}</p>
                <p className="text-gray-600"><strong>Descrição:</strong> {filial.descricao || 'Não informado'}</p>
                <p className="text-sm text-gray-500">Criada em: {filial.created_at ? new Date(filial.created_at).toLocaleDateString('pt-AO') : 'N/A'}</p>
              </div>
              <div className="flex gap-2">
                <button className="bg-white border border-green-600 text-green-600 px-3 py-1 rounded text-sm flex-1">
                  Editar
                </button>
                <button className="bg-green-600 text-white px-3 py-1 rounded text-sm flex-1">
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
              <p className="text-3xl font-bold text-green-600">{minhasEntregas.length}</p>
              <div className="flex items-center mt-2 text-green-600">
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
              <p className="text-3xl font-bold text-green-600">{formatarMoeda(stats.receitaMensal)}</p>
              <div className="flex items-center mt-2 text-green-600">
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
          <FaChartBar className="text-green-600" />
          Histórico de Entregas
        </h3>
        <div className="space-y-3">
          {minhasEntregas.slice(0, 10).map((entrega: Entrega) => (
            <div key={entrega.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <span className="font-medium">#{entrega.id}</span>
                <span className="text-gray-600 ml-2">{entrega.nome_cliente}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded text-xs ${getStatusColor(entrega.estado_entrega)}`}>
                  {getStatusText(entrega.estado_entrega)}
                </span>
                <span className="text-green-600 font-bold">{formatarMoeda(entrega.valor_total || 0)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderNotificacoes = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Notificações</h2>
      
      <div className="bg-white rounded-lg shadow">
        {notificacoes.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Nenhuma notificação encontrada
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {notificacoes.map((notificacao: Notificacao) => (
              <div key={notificacao.id} className={`p-4 hover:bg-gray-50 ${!notificacao.lida ? 'bg-blue-50' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{notificacao.mensagem}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notificacao.created_at).toLocaleString('pt-AO')}
                    </p>
                  </div>
                  {!notificacao.lida && (
                    <span className="inline-block w-2 h-2 bg-blue-600 rounded-full ml-2 mt-1"></span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (loading && pedidosProntos.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-green-600 mx-auto mb-4" />
          <p>Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={4000} />
      
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <div className="text-center mb-8">
            <h1 className="text-xl font-bold text-green-600">Transporte NzoAgro</h1>
          </div>
          
          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('pedidos')}
              className={`flex items-center w-full p-3 text-left rounded-lg transition-colors ${
                activeTab === 'pedidos' ? 'bg-green-50 text-green-600 border-r-2 border-green-600' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FaTruck className="mr-3" /> Pedidos
            </button>
            
            <button 
              onClick={() => setActiveTab('filiais')}
              className={`flex items-center w-full p-3 text-left rounded-lg transition-colors ${
                activeTab === 'filiais' ? 'bg-green-50 text-green-600 border-r-2 border-green-600' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FaBuilding className="mr-3" /> Filiais
            </button>
            
            <button 
              onClick={() => setActiveTab('relatorios')}
              className={`flex items-center w-full p-3 text-left rounded-lg transition-colors ${
                activeTab === 'relatorios' ? 'bg-green-50 text-green-600 border-r-2 border-green-600' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FaChartBar className="mr-3" /> Relatórios
            </button>
            
            <button 
              onClick={() => {
                setActiveTab('notificacoes');
                carregarNotificacoes();
              }}
              className={`flex items-center w-full p-3 text-left rounded-lg transition-colors ${
                activeTab === 'notificacoes' ? 'bg-green-50 text-green-600 border-r-2 border-green-600' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FaBell className="mr-3" /> 
              Notificações 
              {notificacoes.length > 0 && (
                <span className="bg-green-600 text-white text-xs rounded-full px-2 py-1 ml-auto">
                  {notificacoes.length}
                </span>
              )}
            </button>
            
            <button className="flex items-center w-full p-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <FaCog className="mr-3" /> Configurações
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {activeTab === 'pedidos' ? 'Painel de Pedidos' :
             activeTab === 'filiais' ? 'Gestão de Filiais' :
             activeTab === 'relatorios' ? 'Relatórios e Estatísticas' :
             'Notificações'}
          </h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={recarregarTodosDados}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <FaArrowUp />}
              Atualizar
            </button>

            <div className="text-sm text-gray-600">
              Última atualização: {new Date().toLocaleString('pt-AO')}
            </div>
            
            <button 
              onClick={handleLogout}
              className="text-gray-600 hover:text-red-600 transition-colors"
              title="Sair"
            >
              <MdLogout size={24} />
            </button>
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