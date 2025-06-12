"use client"
import { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import Navbar from "../Components/Navbar"
import Footer from "../Components/Footer"
import { 
  getRelatorioComprasComprador, 
  getEstatisticasComprasComprador, // Função correta para comprador
  exportarPDF, 
  exportarCSV,
  getEstatisticasVendasFornecedor, // Para fornecedores
  getRelatorioVendasFornecedor, // Para fornecedores
  exportarPDFVendasFornecedor,
  exportarCSVVendasFornecedor,
  actualizarStatusdoPedido
} from "../Services/relatorios";

// Registrando os componentes necessários do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// Interface para os dados estatísticos de compras
interface EstatisticasCompras {
  total_pedidos: number;
  total_gasto: number;
  media_por_pedido: number;
  total_produtores: number;
  por_mes: Array<{
    mes: number;
    total_mes: number;
  }>;
}

// Interface para os itens do relatório de compras
interface RelatorioComprasItem {
  Numero_Pedido: number;
  Data_Pedido: string;
  Estado: string;
  Status_Pagamento: string;  
  Nome_Produto: string;
  Categoria_Produto: string;  
  Quantidade_Comprada: number;  
  Preco_Unitario: string;  
  Valor_Total: string;  
  Nome_Vendedor: string;  
  Email_Vendedor: string;  
}

// Interface para estatísticas de vendas
interface EstatisticasVendas {
  total_pedidos: number;
  total_vendas: number;
  media_por_pedido: number;
  total_compradores: number;
  pedidos_pendentes: number;
  pedidos_prontos: number;
  por_mes: Array<{
    mes: number;
    total_mes: number;
  }>;
}

// Interface para relatório de vendas
interface RelatorioVendasItem {
  Numero_Pedido: number;
  Data_Pedido: string;
  Nome_Comprador: string;
  Email_Comprador: string;
  Telefone_Comprador?: string;
  Nome_Produto: string;
  Quantidade_Total: number;
  Preco_Unitario: number;
  Valor_Total: number;
  Status_Pedido: 'pendente' | 'aceito' | 'pronto' | 'entregue' | 'cancelado';
  status_pagamentos: string;
}

// Interface para itens mensais
interface ItemMensal {
  mes: number;
  total_mes: number;
}

// Constantes para definir limiares de cores
const LIMITE_VALOR_ALTO = 100000;
const LIMITE_VALOR_MEDIO = 50000;

export default function Relatorios() {
  // Estados de controle
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [tipoRelatorio, setTipoRelatorio] = useState<'compras' | 'vendas'>('compras');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [primeiraConsulta, setPrimeiraConsulta] = useState<boolean>(false);

  // Estados para filtros de data
  const [dataInicial, setDataInicial] = useState<string>('');
  const [dataFinal, setDataFinal] = useState<string>('');

  // Estados para dados de compras
  const [relatorioCompras, setRelatorioCompras] = useState<RelatorioComprasItem[]>([]);
  const [estatisticasCompras, setEstatisticasCompras] = useState<EstatisticasCompras | null>(null);

  // Estados para dados de vendas
  const [relatorioVendas, setRelatorioVendas] = useState<RelatorioVendasItem[]>([]);
  const [estatisticasVendas, setEstatisticasVendas] = useState<EstatisticasVendas | null>(null);

  // Referências
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);

  // Estados para gráficos
  const [dadosGraficoCompras, setDadosGraficoCompras] = useState({
    labels: [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
    datasets: [
      {
        label: 'Total de Compras',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        backgroundColor: Array(12).fill('#E53E3E'),
        borderColor: Array(12).fill('#C53030'),
        borderWidth: 1,
      },
    ],
  });

  const [dadosGraficoVendas, setDadosGraficoVendas] = useState({
    labels: [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
    datasets: [
      {
        label: 'Total de Vendas',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        backgroundColor: Array(12).fill('#48BB78'),
        borderColor: Array(12).fill('#2F855A'),
        borderWidth: 1,
      },
    ],
  });

  // Função para obter tipo de usuário
  const getTipoUsuario = (): 'Comprador' | 'Agricultor' | 'Fornecedor' => {
  // Verificar se estamos no cliente antes de acessar localStorage
  if (typeof window !== 'undefined') {
    const tipoUsuario = localStorage.getItem('tipo_usuario');
    return tipoUsuario as 'Comprador' | 'Agricultor' | 'Fornecedor' || 'Comprador';
  }
  // Retornar valor padrão durante o SSR
  return 'Comprador';
};

// Verificar se pode ver vendas (também corrigida)
const podeVerVendas = () => {
  const tipo_usuario = getTipoUsuario();
  return tipo_usuario === 'Agricultor' || tipo_usuario === 'Fornecedor';
};

  // Opções do gráfico
  const options: ChartOptions<'bar'> = { 
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 500
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Total: ${formatarMoeda(context.parsed.y)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return 'kzs ' + Number(value).toLocaleString('pt-BR');
          }
        }
      }
    }
  };

  // Função para determinar cores
  const determinarCor = (valor: number) => {
    if (valor >= LIMITE_VALOR_ALTO) {
      return {
        backgroundColor: '#48BB78',
        borderColor: '#2F855A'
      };
    } else if (valor >= LIMITE_VALOR_MEDIO) {
      return {
        backgroundColor: '#ED8936',
        borderColor: '#DD6B20'
      };
    } else {
      return {
        backgroundColor: '#E53E3E',
        borderColor: '#C53030'
      };
    }
  };

  const determinarCorVendas = (valor: number) => {
    if (valor >= LIMITE_VALOR_ALTO) {
      return {
        backgroundColor: '#22C55E',
        borderColor: '#16A34A'
      };
    } else if (valor >= LIMITE_VALOR_MEDIO) {
      return {
        backgroundColor: '#48BB78',
        borderColor: '#2F855A'
      };
    } else {
      return {
        backgroundColor: '#F87171',
        borderColor: '#DC2626'
      };
    }
  };

  // Função para carregar dados de compras
  const carregarDadosCompras = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Buscar relatório de compras do comprador
      const relatorioData = await getRelatorioComprasComprador(dataInicial || undefined, dataFinal || undefined);
      setRelatorioCompras(relatorioData || []);
      
      try {
        // Buscar estatísticas de compras do comprador
        const estatisticasData = await getEstatisticasComprasComprador();
        setEstatisticasCompras(estatisticasData);
        
        // Atualizar gráfico
        if (estatisticasData?.por_mes) {
          const dadosMensais = Array(12).fill(0);
          const coresFundo = Array(12).fill('#E53E3E');
          const coresBorda = Array(12).fill('#C53030');
          
          estatisticasData.por_mes.forEach((item: ItemMensal) => {
            if (item.mes >= 1 && item.mes <= 12) {
              dadosMensais[item.mes - 1] = item.total_mes;
              
              const cores = determinarCor(item.total_mes);
              coresFundo[item.mes - 1] = cores.backgroundColor;
              coresBorda[item.mes - 1] = cores.borderColor;
            }
          });
          
          setDadosGraficoCompras(prev => ({
            ...prev,
            datasets: [{
              ...prev.datasets[0],
              data: dadosMensais,
              backgroundColor: coresFundo,
              borderColor: coresBorda
            }]
          }));
        }
      } catch (estatisticasError) {
        console.log("Erro ao carregar estatísticas de compras:", estatisticasError);
      }
      
      setPrimeiraConsulta(true);
      
    } catch (error) {
      console.log("Erro ao carregar relatório de compras:", error);
      
      if (error instanceof Error && error.message.includes("sem dados")) {
        setRelatorioCompras([]);
        setPrimeiraConsulta(true);
      } else {
        setError("Erro ao carregar dados de compras. Por favor, tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Função para carregar dados de vendas
  const carregarDadosVendas = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Buscar relatório de vendas do fornecedor
      const relatorioVendasData = await getRelatorioVendasFornecedor(dataInicial || undefined, dataFinal || undefined);
      setRelatorioVendas(relatorioVendasData || []);
      
      try {
        // Buscar estatísticas de vendas do fornecedor
        const estatisticasVendasData = await getEstatisticasVendasFornecedor();
        setEstatisticasVendas(estatisticasVendasData);
        
        // Atualizar gráfico de vendas
        if (estatisticasVendasData?.por_mes) {
          const dadosMensais = Array(12).fill(0);
          const coresFundo = Array(12).fill('#48BB78');
          const coresBorda = Array(12).fill('#2F855A');
          
          estatisticasVendasData.por_mes.forEach((item: ItemMensal) => {
            if (item.mes >= 1 && item.mes <= 12) {
              dadosMensais[item.mes - 1] = item.total_mes;
              
              const cores = determinarCorVendas(item.total_mes);
              coresFundo[item.mes - 1] = cores.backgroundColor;
              coresBorda[item.mes - 1] = cores.borderColor;
            }
          });
          
          setDadosGraficoVendas(prev => ({
            ...prev,
            datasets: [{
              ...prev.datasets[0],
              data: dadosMensais,
              backgroundColor: coresFundo,
              borderColor: coresBorda
            }]
          }));
        }
      } catch (estatisticasError) {
        console.log("Erro ao carregar estatísticas de vendas:", estatisticasError);
      }
      
      setPrimeiraConsulta(true);
      
    } catch (error) {
      console.log("Erro ao carregar relatório de vendas:", error);
      
      if (error instanceof Error && error.message.includes("sem dados")) {
        setRelatorioVendas([]);
        setPrimeiraConsulta(true);
      } else {
        setError("Erro ao carregar dados de vendas. Por favor, tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

//carregar dados ao montar o componente
  useEffect(() => {
    if (tipoRelatorio === 'compras') {
      carregarDadosCompras();
    } else {
      carregarDadosVendas();
    }
  }, [tipoRelatorio]);

  // Função para aplicar filtros ao carregar dados
  useEffect(() => {
    if (dataInicial && dataFinal) {
      aplicarFiltro();
    }
  }, [dataInicial, dataFinal]);






  // Função para aplicar filtros
  const aplicarFiltro = () => {
    if (tipoRelatorio === 'compras') {
      carregarDadosCompras();
    } else {
      carregarDadosVendas();
    }
  };

  // Função para atualizar status do pedido
  const handleAtualizarStatus = async (numeroPedido: number, novoStatus: string) => {
    try {
      setIsLoading(true);
      await actualizarStatusdoPedido(String(numeroPedido), novoStatus);

      // Recarregar dados após atualização
      if (tipoRelatorio === 'compras') {
        await carregarDadosCompras();
      } else {
        await carregarDadosVendas();
      }

      alert('Status do pedido atualizado com sucesso!');
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      setError("Erro ao atualizar status do pedido. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Função para obter status com cor
  const getStatusComCor = (status: string) => {
    const statusConfig = {
      'pendente': { texto: 'Pendente', cor: 'bg-yellow-100 text-yellow-800' },
      'aceito': { texto: 'Aceito', cor: 'bg-blue-100 text-blue-800' },
      'pronto': { texto: 'Pronto', cor: 'bg-green-100 text-green-800' },
      'entregue': { texto: 'Entregue', cor: 'bg-gray-100 text-gray-800' },
      'cancelado': { texto: 'Cancelado', cor: 'bg-red-100 text-red-800' }
    };
    
    return statusConfig[status as keyof typeof statusConfig] || { texto: status, cor: 'bg-gray-100 text-gray-800' };
  };

  // Funções de exportação
  const handleExportarPDF = async () => {
    const dados = tipoRelatorio === 'compras' ? relatorioCompras : relatorioVendas;
    if (dados.length === 0) {
      setError("Não há dados para exportar");
      return;
    }
    
    setExportLoading(true);
    try {
      const blob = tipoRelatorio === 'compras' 
        ? await exportarPDF()
        : await exportarPDFVendasFornecedor();
        
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-${tipoRelatorio}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      setError(error.mensagem || "Erro ao exportar PDF");
      
    } finally {
      setExportLoading(false);
      setDropdownOpen(false);
    }
  };

  const handleExportarCSV = async () => {
    const dados = tipoRelatorio === 'compras' ? relatorioCompras : relatorioVendas;
    if (dados.length === 0) {
      setError("Não há dados para exportar");
      return;
    }
    
    setExportLoading(true);
    try {
      const blob = tipoRelatorio === 'compras' 
        ? await exportarCSV()
        : await exportarCSVVendasFornecedor();
        
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-${tipoRelatorio}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      setError(error.mensagem || "Erro ao exportar CSV");
    } finally {
      setExportLoading(false);
      setDropdownOpen(false);
    }
  };

  // Funções utilitárias
  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  const formatarMoeda = (valor: number) => {
    return `kzs ${valor && valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  // Effect para ajustar gráfico
  useEffect(() => {
    const ajustarTamanhoGrafico = () => {
      if (chartRef.current) {
        // Qualquer ajuste adicional pode ser feito aqui se necessário
      }
    };
    
    window.addEventListener('resize', ajustarTamanhoGrafico);
    
    return () => {
      window.removeEventListener('resize', ajustarTamanhoGrafico);
    };
  }, []);

  return (
    <div>
      <Navbar/>
      
      {/* Container principal */}
      <div className="flex flex-col mb-20 md:mb-20 gap-2 mt-[48%] md:[45%] md:mt-[15%] mx-4 md:mx-8 max-w-full md:max-w-[1200px] shadow-custom p-4 md:p-8 rounded-[10px]">
        
        {/* Cabeçalho e filtros */}
        <div className="flex flex-col gap-6 sm:flex-row flex-wrap items-start sm:items-centers mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-4 sm:mb-0">
            <h1 className="text-marieth text-xl md:text-[2rem] font-bold">
              Relatório de {tipoRelatorio === 'compras' ? 'Compras' : 'Vendas'}
            </h1>
            
            {/* Toggle de tipo de relatório */}
            {podeVerVendas() && (
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    tipoRelatorio === 'compras'
                      ? 'bg-white text-marieth shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setTipoRelatorio('compras')}
                >
                  Compras
                </button>
                <button
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    tipoRelatorio === 'vendas'
                      ? 'bg-white text-marieth shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setTipoRelatorio('vendas')}
                >
                  Vendas
                </button>
              </div>
            )}
          </div>
          
          {/* Filtros de data */}
          <label htmlFor="data_inicial" className="text-sm text-gray-600 sm:sr-only">Data Inicial</label>
          <input 
            type="date" 
            id="data_inicial" 
            className="p-2 rounded-[5px] w-full sm:w-auto items-center border-[1px] border-solid border-tab"
            value={dataInicial}
            onChange={(e) => setDataInicial(e.target.value)}
          />

          <label htmlFor="data_final" className="text-sm text-gray-600 sm:sr-only">Data Final</label>
          <input 
            type="date" 
            id="data_final" 
            name="data_final" 
            className="p-2 rounded-[5px] w-full sm:w-auto items-center border-[1px] border-solid border-tab"
            value={dataFinal}
            onChange={(e) => setDataFinal(e.target.value)}
          />

          <button 
            className="bg-marieth border-none hover:bg-verdeaceso text-white py-2 px-4 rounded-[5px] cursor-pointer w-full sm:w-auto mt-2 sm:mt-0"
            onClick={aplicarFiltro}
            disabled={isLoading}
          >
            {isLoading ? 'Carregando...' : 'Filtrar'}
          </button>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {tipoRelatorio === 'compras' ? (
            <>
              <div className="p-4 md:p-6 rounded-[10px] text-center shadow-custom bg-white">
                <h3 className="m-0 text-cortexto text-base md:text-[1.17rem]">Total Gasto</h3>
                <p className="text-marieth font-bold p-2 md:p-4 my-2 mx-0 text-xl md:text-[2rem]">
                  {estatisticasCompras ? formatarMoeda(estatisticasCompras.total_gasto) : 'kzs 0'}
                </p>
              </div>
              <div className="p-4 md:p-6 rounded-[10px] text-center shadow-custom bg-white">
                <h3 className="m-0 text-cortexto text-base md:text-[1.17rem]">Quantidade de Pedidos</h3>
                <p className="text-marieth font-bold p-2 md:p-4 my-2 mx-0 text-xl md:text-[2rem]">
                  {estatisticasCompras ? estatisticasCompras.total_pedidos : '0'}
                </p>
              </div>
              <div className="p-4 md:p-6 rounded-[10px] text-center shadow-custom bg-white">
                <h3 className="m-0 text-cortexto text-base md:text-[1.17rem]">Média por Pedido</h3>
                <p className="text-marieth font-bold p-2 md:p-4 my-2 mx-0 text-xl md:text-[2rem]">
                  {estatisticasCompras ? formatarMoeda(estatisticasCompras.media_por_pedido) : 'kzs 0'}
                </p>
              </div>
              <div className="p-4 md:p-6 rounded-[10px] text-center shadow-custom bg-white">
                <h3 className="m-0 text-cortexto text-base md:text-[1.17rem]">Fornecedores</h3>
                <p className="text-marieth font-bold p-2 md:p-4 my-2 mx-0 text-xl md:text-[2rem]">
                  {estatisticasCompras ? estatisticasCompras.total_produtores : '0'}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="p-4 md:p-6 rounded-[10px] text-center shadow-custom bg-white">
                <h3 className="m-0 text-cortexto text-base md:text-[1.17rem]">Total Vendido</h3>
                <p className="text-green-600 font-bold p-2 md:p-4 my-2 mx-0 text-xl md:text-[2rem]">
                  {estatisticasVendas ? formatarMoeda(estatisticasVendas.total_vendas) : 'kzs 0'}
                </p>
              </div>
              <div className="p-4 md:p-6 rounded-[10px] text-center shadow-custom bg-white">
                <h3 className="m-0 text-cortexto text-base md:text-[1.17rem]">Pedidos Atendidos</h3>
                <p className="text-green-600 font-bold p-2 md:p-4 my-2 mx-0 text-xl md:text-[2rem]">
                  {estatisticasVendas ? estatisticasVendas.total_pedidos : '0'}
                </p>
              </div>
              <div className="p-4 md:p-6 rounded-[10px] text-center shadow-custom bg-white">
                <h3 className="m-0 text-cortexto text-base md:text-[1.17rem]">Pedidos Pendentes</h3>
                <p className="text-yellow-600 font-bold p-2 md:p-4 my-2 mx-0 text-xl md:text-[2rem]">
                  {estatisticasVendas ? estatisticasVendas.pedidos_pendentes : '0'}
                </p>
              </div>
              <div className="p-4 md:p-6 rounded-[10px] text-center shadow-custom bg-white">
                <h3 className="m-0 text-cortexto text-base md:text-[1.17rem]">Pedidos Prontos</h3>
                <p className="text-blue-600 font-bold p-2 md:p-4 my-2 mx-0 text-xl md:text-[2rem]">
                  {estatisticasVendas ? estatisticasVendas.pedidos_prontos : '0'}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Gráfico */}
        {/* Gráfico */}
        <div 
          ref={chartContainerRef} 
          className="bg-white p-4 md:p-6 rounded-[10px] mb-6 md:mb-8 border-[1px] border-solid border-tab h-[300px] md:h-[400px]"
        >
          <div className="h-full">
            <Bar 
              ref={chartRef}
              data={tipoRelatorio === 'compras' ? dadosGraficoCompras : dadosGraficoVendas} 
              options={options} 
            />
          </div>
        </div>

       
        {primeiraConsulta && (
          <div className="bg-white rounded-[10px] border-[1px] border-solid border-tab overflow-hidden">
            {/* Cabeçalho da tabela com botões de exportação */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 md:p-6 bg-gray-50 border-b">
              <h2 className="text-lg md:text-xl font-semibold text-marieth mb-4 sm:mb-0">
                Detalhes do Relatório
              </h2>
              
              {/* Botões de exportação */}
              {(tipoRelatorio === 'compras' ? relatorioCompras : relatorioVendas).length > 0 && (
                <div className="relative">
                  <button
                    className="bg-marieth text-white px-4 py-2 rounded-[5px] hover:bg-verdeaceso transition-colors"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    disabled={exportLoading}
                  >
                    {exportLoading ? 'Exportando...' : 'Exportar ▼'}
                  </button>
                  
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={handleExportarPDF}
                      >
                        Exportar PDF
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={handleExportarCSV}
                      >
                        Exportar CSV
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Conteúdo da tabela */}
            <div className="p-4 md:p-6">
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Carregando dados...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-600">{error}</p>
                  <button 
                    className="mt-4 bg-marieth text-white px-4 py-2 rounded-[5px] hover:bg-verdeaceso"
                    onClick={aplicarFiltro}
                  >
                    Tentar Novamente
                  </button>
                </div>
              ) : (tipoRelatorio === 'compras' ? relatorioCompras : relatorioVendas).length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Nenhum dado encontrado para o período selecionado.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  {tipoRelatorio === 'compras' ? (
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Nº Pedido</th>
                          <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Data</th>
                          <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Produto</th>
                          <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Categoria</th>
                          <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Vendedor</th>
                          <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Qtd</th>
                          <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Preço Unit.</th>
                          <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Total</th>
                          <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Pagamento</th>
                          <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {relatorioCompras.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-3 text-sm">{item.Numero_Pedido}</td>
                            <td className="border border-gray-300 px-4 py-3 text-sm">{formatarData(item.Data_Pedido)}</td>
                            <td className="border border-gray-300 px-4 py-3 text-sm">{item.Nome_Produto}</td>
                            <td className="border border-gray-300 px-4 py-3 text-sm">{item.Categoria_Produto}</td>
                            <td className="border border-gray-300 px-4 py-3 text-sm">
                              <div>
                                <div className="font-medium">{item.Nome_Vendedor}</div>
                                <div className="text-gray-500 text-xs">{item.Email_Vendedor}</div>
                              </div>
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-sm">{item.Quantidade_Comprada}</td>
                            <td className="border border-gray-300 px-4 py-3 text-sm">{formatarMoeda(parseFloat(item.Preco_Unitario))}</td>
                            <td className="border border-gray-300 px-4 py-3 text-sm font-semibold">{formatarMoeda(parseFloat(item.Valor_Total))}</td>
                            <td className="border border-gray-300 px-4 py-3 text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusComCor(item.Status_Pagamento).cor}`}>
                                {getStatusComCor(item.Status_Pagamento).texto}
                              </span>
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusComCor(item.Estado).cor}`}>
                                {getStatusComCor(item.Estado).texto}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Nº Pedido</th>
                          <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Data</th>
                          <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Comprador</th>
                          <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Produto</th>
                          <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Qtd</th>
                          <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Preço Unit.</th>
                          <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Total</th>
                          <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                          <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Pagamento</th>
                          <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {relatorioVendas.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-3 text-sm">{item.Numero_Pedido}</td>
                            <td className="border border-gray-300 px-4 py-3 text-sm">{formatarData(item.Data_Pedido)}</td>
                            <td className="border border-gray-300 px-4 py-3 text-sm">
                              <div>
                                <div className="font-medium">{item.Nome_Comprador}</div>
                                <div className="text-gray-500 text-xs">{item.Email_Comprador}</div>
                                {item.Telefone_Comprador && (
                                  <div className="text-gray-500 text-xs">{item.Telefone_Comprador}</div>
                                )}
                              </div>
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-sm">{item.Nome_Produto}</td>
                            <td className="border border-gray-300 px-4 py-3 text-sm">{item.Quantidade_Total}</td>
                            <td className="border border-gray-300 px-4 py-3 text-sm">{formatarMoeda(item.Preco_Unitario)}</td>
                            <td className="border border-gray-300 px-4 py-3 text-sm font-semibold">{formatarMoeda(item.Valor_Total)}</td>
                            <td className="border border-gray-300 px-4 py-3 text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusComCor(item.Status_Pedido).cor}`}>
                                {getStatusComCor(item.Status_Pedido).texto}
                              </span>
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusComCor(item.status_pagamentos).cor}`}>
                                {getStatusComCor(item.status_pagamentos).texto}
                              </span>
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-sm">
                              {item.Status_Pedido !== 'entregue' && item.Status_Pedido !== 'cancelado' && (
                                <label htmlFor={`status-${item.Numero_Pedido}`} className="sr-only">Atualizar Status
                                <select
                                  id={`status-${item.Numero_Pedido}`}
                                  className="text-xs border rounded px-2 py-1"
                                  value={item.Status_Pedido}
                                  onChange={(e) => handleAtualizarStatus(item.Numero_Pedido, e.target.value)}
                                >
                                  <option value="pendente">Pendente</option>
                                  <option value="aceito">Aceito</option>
                                  <option value="pronto">Pronto</option>
                                  <option value="entregue">Entregue</option>
                                  <option value="cancelado">Cancelado</option>

                                </select>
                                </label>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          </div>
        )}




<div className="relative mt-4 flex justify-center sm:justify-start">
  <button 
    className={`bg-marieth cursor-pointer rounded-[10px] border-none
    hover:bg-verdeaceso text-white py-2 px-4 md:py-[0.8rem] md:px-[1.5rem] w-full sm:w-auto
    ${(tipoRelatorio === 'compras' ? relatorioCompras.length === 0 : relatorioVendas.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
    onClick={() => setDropdownOpen(!dropdownOpen)}
    disabled={(tipoRelatorio === 'compras' ? relatorioCompras.length === 0 : relatorioVendas.length === 0) || exportLoading}
  >
    {exportLoading ? 'Exportando...' : `Exportar Relatório de ${tipoRelatorio === 'compras' ? 'Compras' : 'Vendas'}`}
  </button>
  </div>
  
  {dropdownOpen && (
    <div className="absolute top-full left-0 sm:left-auto z-10 mt-2 w-full sm:w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
      <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
<button
  onClick={tipoRelatorio === 'compras' ? handleExportarPDF : () => {}} // Replace with correct handler for vendas if needed
  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
  role="menuitem"
>
  Exportar como PDF
</button>
<button
  onClick={handleExportarCSV}
  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
  role="menuitem"
>
  Exportar como CSV
</button>
      </div>
    </div>
  )}
      {/* Exibir mensagem de erro se houver */}
      {error && (
        <div className="bg-red-100 text-vermelho p-4 rounded-md mt-4">
          <p className="text-sm">{error}</p>
        </div>
      )}
      
     
    </div>
 <Footer/>
    </div>
  );


 } 