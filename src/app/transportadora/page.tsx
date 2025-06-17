'use client'
import React, { useState } from 'react';
import { 
  FaHome, 
  FaTruck, 
  FaMapMarkerAlt, 
  FaBell, 
  FaCog, 
  FaPaperPlane, 
  FaEnvelope, 
  FaCheck, 
  FaTimes,
  FaChartBar,
  FaBuilding,
  FaPhone,
  FaBox,
  FaArrowUp,
  FaArrowDown,
  FaEquals,
  FaCalendarAlt,
  FaMoneyBillWave
} from 'react-icons/fa';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('pedidos');
  const [selectedFilial, setSelectedFilial] = useState<Record<string, number>>({});
  const [notifications, setNotifications] = useState(3);

  // Dados mockados
  const filiais = [
    { id: 1, nome: 'Filial Luanda Centro', endereco: 'Rua da Samba, Luanda' },
    { id: 2, nome: 'Filial Viana', endereco: 'Estrada de Viana, Luanda' },
    { id: 3, nome: 'Filial Benguela', endereco: 'Rua 4 de Fevereiro, Benguela' }
  ];

  const pedidos = [
    {
      id: 'PED0001',
      cliente: 'Maria Silva',
      telefone: '+244 923 456 789',
      endereco: 'Rua Kwame Nkrumah, 123 - Maianga, Luanda',
      itens: ['2x Sacos de Milho (50kg)', '1x Caixa de Tomates (20kg)'],
      total: 'Kz 15.000',
      distancia: '2.5 km',
      status: 'Pendente',
      urgencia: 'normal'
    },
    {
      id: 'PED0002',
      cliente: 'João Pedro',
      telefone: '+244 912 345 678',
      endereco: 'Avenida Mortala Mohamed, 456 - Ingombota, Luanda',
      itens: ['5x Sacos de Arroz (25kg)', '3x Garrafas de Óleo (5L)'],
      total: 'Kz 32.500',
      distancia: '4.1 km',
      status: 'Pendente',
      urgencia: 'alta'
    },
    {
      id: 'PED0003',
      cliente: 'Ana Costa',
      telefone: '+244 934 567 890',
      endereco: 'Rua Circular, 789 - Alvalade, Luanda',
      itens: ['1x Cesta de Vegetais Mista (15kg)'],
      total: 'Kz 8.500',
      distancia: '6.2 km',
      status: 'Em Trânsito',
      urgencia: 'normal'
    }
  ];

  const dadosGraficos = [
    { mes: 'Jan', entregas: 45, receita: 450000 },
    { mes: 'Fev', entregas: 52, receita: 520000 },
    { mes: 'Mar', entregas: 61, receita: 610000 },
    { mes: 'Abr', entregas: 58, receita: 580000 },
    { mes: 'Mai', entregas: 67, receita: 670000 },
    { mes: 'Jun', entregas: 73, receita: 730000 }
  ];

  const handleFilialSelect = (pedidoId: string, filialId: number) => {
    setSelectedFilial({ ...selectedFilial, [pedidoId]: filialId });
  };

  const enviarPedido = (pedidoId: string) => {
    const filial = selectedFilial[pedidoId];
    if (filial) {
      alert(`Pedido ${pedidoId} enviado para ${filiais.find(f => f.id === filial)?.nome}`);
    } else {
      alert('Selecione uma filial primeiro!');
    }
  };

  const renderPedidos = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-2xl text-orange-500 font-bold">12</div>
          <div className="text-gray-700 mt-2">Pedidos Pendentes</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-2xl text-green-600 font-bold">85</div>
          <div className="text-gray-700 mt-2">Entregues Hoje</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-2xl text-blue-600 font-bold">13</div>
          <div className="text-gray-700 mt-2">Em Trânsito</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-2xl text-purple-600 font-bold">Kz 2.1M</div>
          <div className="text-gray-700 mt-2">Receita Mensal</div>
        </div>
      </div>

      {/* Lista de Pedidos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {pedidos.map((pedido) => (
          <div key={pedido.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              {/* Header do Pedido */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{pedido.id}</h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    pedido.status === 'Pendente' ? 'bg-orange-100 text-orange-800' :
                    pedido.status === 'Em Trânsito' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {pedido.status}
                  </span>
                </div>
                <div className={`text-sm font-medium ${
                  pedido.urgencia === 'alta' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {pedido.urgencia === 'alta' ? '🔥 URGENTE' : '📦 Normal'}
                </div>
              </div>

              {/* Informações do Cliente */}
              <div className="space-y-3 mb-4">
                <div className="flex items-start gap-2">
                  <FaMapMarkerAlt className="text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-800">{pedido.cliente}</p>
                    <p className="text-sm text-gray-600">{pedido.endereco}</p>
                    <p className="text-sm text-blue-600">{pedido.distancia} da filial mais próxima</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <FaPhone className="text-marieth" />
                  <span className="text-sm text-gray-700">{pedido.telefone}</span>
                </div>

                <div className="flex items-start gap-2">
                  <FaBox className="text-brown-500 mt-1 flex-shrink-0" />
                  <div>
                    {pedido.itens.map((item, idx) => (
                      <p key={idx} className="text-sm text-gray-700">{item}</p>
                    ))}
                    <p className="font-bold text-lg text-marieth mt-1">{pedido.total}</p>
                  </div>
                </div>
              </div>

              {/* Ações */}
              {pedido.status === 'Pendente' && (
                <div className="border-t pt-4 space-y-3">
                  <div className="flex gap-2">
                    <select
                      className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
                      value={selectedFilial[pedido.id] || ''}
                      onChange={(e) => handleFilialSelect(pedido.id, parseInt(e.target.value))}
                      aria-label="Selecionar Filial"
                    >
                      <option value="">Selecionar Filial</option>
                      {filiais.map(filial => (
                        <option key={filial.id} value={filial.id}>{filial.nome}</option>
                      ))}
                    </select>
                    <button 
                      onClick={() => enviarPedido(pedido.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
                    >
                      <FaPaperPlane className="text-sm" />
                      Enviar
                    </button>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex-1 flex items-center justify-center gap-2 transition-colors">
                      <FaCheck /> Aceitar
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex-1 flex items-center justify-center gap-2 transition-colors">
                      <FaEnvelope /> Mensagem
                    </button>
                    <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex-1 flex items-center justify-center gap-2 transition-colors">
                      <FaTimes /> Rejeitar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFiliais = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Gestão de Filiais</h2>
        <button className="bg-marieth hover:bg-verdeaceso text-white px-4 py-2 rounded-md flex items-center gap-2">
          <FaBuilding /> Nova Filial
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filiais.map(filial => (
          <div key={filial.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3 mb-4">
              <FaBuilding className="text-marieth text-xl" />
              <h3 className="font-bold text-lg text-gray-800">{filial.nome}</h3>
            </div>
            <p className="text-gray-600 mb-4">{filial.endereco}</p>
            <div className="flex gap-2">
              <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm flex-1">
                Editar
              </button>
              <button className="bg-marieth  text-white px-3 py-1 rounded text-sm flex-1">
                Ver Entregas
              </button>
            </div>
          </div>
        ))}
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
              <h3 className="text-lg font-semibold text-gray-700">Entregas Este Mês</h3>
              <p className="text-3xl font-bold text-blue-600">73</p>
              <div className="flex items-center mt-2 text-marieth">
                <FaArrowUp className="mr-1" />
                <span className="text-sm">+12% vs mês anterior</span>
              </div>
            </div>
            <FaTruck className="text-4xl text-blue-200" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Receita Mensal</h3>
              <p className="text-3xl font-bold text-marieth">Kz 730K</p>
              <div className="flex items-center mt-2 text-marieth">
                <FaArrowUp className="mr-1" />
                <span className="text-sm">+8% vs mês anterior</span>
              </div>
            </div>
            <FaMoneyBillWave className="text-4xl text-green-200" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Tempo Médio</h3>
              <p className="text-3xl font-bold text-purple-600">2.3h</p>
              <div className="flex items-center mt-2 text-red-600">
                <FaArrowDown className="mr-1" />
                <span className="text-sm">-5min vs mês anterior</span>
              </div>
            </div>
            <FaCalendarAlt className="text-4xl text-purple-200" />
          </div>
        </div>
      </div>

      {/* Histórico Simplificado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaChartBar className="text-blue-600" />
            Histórico de Entregas (Últimos 6 meses)
          </h3>
          <div className="space-y-3">
            {dadosGraficos.map((mes, index) => (
              <div key={mes.mes} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="font-medium">{mes.mes}</span>
                <div className="flex items-center gap-3">
                  <span className="text-blue-600 font-bold">{mes.entregas} entregas</span>
                  <div className={`flex items-center text-sm ${
                    index > 0 && mes.entregas > dadosGraficos[index-1].entregas ? 'text-green-600' :
                    index > 0 && mes.entregas < dadosGraficos[index-1].entregas ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {index > 0 && mes.entregas > dadosGraficos[index-1].entregas && <FaArrowUp />}
                    {index > 0 && mes.entregas < dadosGraficos[index-1].entregas && <FaArrowDown />}
                    {(index === 0 || mes.entregas === dadosGraficos[index-1].entregas) && <FaEquals />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaMoneyBillWave className="text-marieth" />
            Histórico de Receitas (Últimos 6 meses)
          </h3>
          <div className="space-y-3">
            {dadosGraficos.map((mes, index) => (
              <div key={mes.mes} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="font-medium">{mes.mes}</span>
                <div className="flex items-center gap-3">
                  <span className="text-marieth font-bold">Kz {(mes.receita/1000).toFixed(0)}K</span>
                  <div className={`flex items-center text-sm ${
                    index > 0 && mes.receita > dadosGraficos[index-1].receita ? 'text-marieth' :
                    index > 0 && mes.receita < dadosGraficos[index-1].receita ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {index > 0 && mes.receita > dadosGraficos[index-1].receita && <FaArrowUp />}
                    {index > 0 && mes.receita < dadosGraficos[index-1].receita && <FaArrowDown />}
                    {(index === 0 || mes.receita === dadosGraficos[index-1].receita) && <FaEquals />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance por Filial */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FaBuilding className="text-purple-600" />
          Performance por Filial (Este Mês)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filiais.map((filial, index) => {
            const entregas = [25, 32, 16][index];
            const receita = [250000, 320000, 160000][index];
            return (
              <div key={filial.id} className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">{filial.nome}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Entregas:</span>
                    <span className="font-bold text-blue-600">{entregas}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Receita:</span>
                    <span className="font-bold text-marieth">Kz {(receita/1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Média/Dia:</span>
                    <span className="font-bold text-purple-600">{Math.round(entregas/30)} pedidos</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );


   {/* notificações */}




  return (
    <div className="grid grid-cols-[250px_1fr] min-h-screen bg-gray-100">
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
                activeTab === 'filiais' ? 'bg-green-200 text-marieth' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FaBuilding /> Filiais
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveTab('relatorios')}
              className={`flex items-center p-3 w-full text-left rounded-md gap-2 transition-colors ${
                activeTab === 'relatorios' ? 'bg-green-200 text-marieth' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FaChartBar /> Relatórios
            </button>
          </li>
          <li>
            <button className="flex items-center p-3 w-full text-left text-gray-700 hover:bg-gray-100 rounded-md gap-2">
              <FaBell /> 
              Notificações 
              {notifications > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-auto">
                  {notifications}
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
      <main className="p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {activeTab === 'pedidos' ? 'Painel de Pedidos' :
             activeTab === 'filiais' ? 'Gestão de Filiais' :
             'Relatórios e Estatísticas'}
          </h1>
          <div className="text-sm text-gray-600">
            Última atualização: {new Date().toLocaleString('pt-AO')}
          </div>
        </div>

        {activeTab === 'pedidos' && renderPedidos()}
        {activeTab === 'filiais' && renderFiliais()}
        {activeTab === 'relatorios' && renderRelatorios()}
        
      </main>
    </div>
  );
};

export default Dashboard;