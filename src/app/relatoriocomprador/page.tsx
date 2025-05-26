"use client"
import { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import Navbar from "../Components/Navbar"
import Footer from "../Components/Footer"
import { getRelatorioUsuario, getEstatisticas, exportarPDF, exportarCSV } from "../Services/relatorios";

// Registrando os componentes necessários do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// Interface para os dados estatísticos
interface Estatisticas {
  total_pedidos: number;
  total_gasto: number;
  media_por_pedido: number;
  total_produtores: number;
  por_mes: Array<{
    mes: number;
    total_mes: number;
  }>;
}

// Interface para os itens do relatório
interface RelatorioItem {
  Numero_Pedido: number;
  Data_Pedido: string;
  Estado: string;
  Nome_Usuario?: string;
  status_pagamentos: string;
  Nome_Produto: string;
  Quantidade_Total: number;
  Preco_Unitario: number;
  Valor_Total: number;
}

// Interface para itens mensais
interface ItemMensal {
  mes: number;
  total_mes: number;
}

// Constantes para definir limiares de cores
const LIMITE_VALOR_ALTO = 100000; // Valor acima disso é considerado alto (verde)
const LIMITE_VALOR_MEDIO = 50000; // Valor entre isso e LIMITE_VALOR_ALTO é médio (laranja)
// Abaixo de LIMITE_VALOR_MEDIO é considerado baixo (vermelho)

export default function Comprador() {
  // Estado para controlar o dropdown de exportação
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Estados para armazenar os dados
  const [dataInicial, setDataInicial] = useState<string>('');
  const [dataFinal, setDataFinal] = useState<string>('');
  const [relatorio, setRelatorio] = useState<RelatorioItem[]>([]);
  const [estatisticas, setEstatisticas] = useState<Estatisticas | null>(null);
  
  // Estado para controlar se já foi feita a primeira busca
  const [primeiraConsulta, setPrimeiraConsulta] = useState<boolean>(false);
  
  const [dadosGrafico, setDadosGrafico] = useState({
    labels: [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
    datasets: [
      {
        label: 'Total de Compras',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        backgroundColor: Array(12).fill('#E53E3E'), // Inicialmente vermelho
        borderColor: Array(12).fill('#C53030'),
        borderWidth: 1,
      },
    ],
  });
  
  // Estado para controle de carregamento e erros
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exportLoading, setExportLoading] = useState(false);
  
  // Referência para o container do gráfico para evitar redimensionamento
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  
  // Opções para o gráfico com configuração de animação e responsividade
  const options: ChartOptions<'bar'> = { 
    responsive: true,
    maintainAspectRatio: false, // Importante para evitar o redimensionamento
    animation: {
      duration: 500 // Uma pequena animação para mostrar os dados, mas não constante
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

  // Função para determinar a cor com base no valor
  const determinarCor = (valor: number) => {
    if (valor >= LIMITE_VALOR_ALTO) {
      return {
        backgroundColor: '#48BB78', // Verde para valores altos
        borderColor: '#2F855A'
      };
    } else if (valor >= LIMITE_VALOR_MEDIO) {
      return {
        backgroundColor: '#ED8936', // Laranja para valores médios
        borderColor: '#DD6B20'
      };
    } else {
      return {
        backgroundColor: '#E53E3E', // Vermelho para valores baixos
        borderColor: '#C53030'
      };
    }
  };

  // Remover o useEffect que carregava dados automaticamente
  useEffect(() => {
    // Apenas configurar event listeners para redimensionamento se necessário
    const ajustarTamanhoGrafico = () => {
      if (chartRef.current) {
        // Qualquer ajuste adicional pode ser feito aqui se necessário no futuro
        // mas sem manipular diretamente o estilo
      }
    };
    
    window.addEventListener('resize', ajustarTamanhoGrafico);
    
    return () => {
      window.removeEventListener('resize', ajustarTamanhoGrafico);
    };
  }, []);

  // Função para buscar dados com base nas datas selecionadas
  const carregarDados = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Buscar relatório do usuário
      const relatorioData = await getRelatorioUsuario(dataInicial || undefined, dataFinal || undefined);
      setRelatorio(relatorioData || []);
      
      try {
        // Buscar estatísticas gerais
        const estatisticasData = await getEstatisticas();
        setEstatisticas(estatisticasData);
        
        // Atualizar o gráfico com os dados mensais
        if (estatisticasData?.por_mes) {
          const dadosMensais = Array(12).fill(0);
          const coresFundo = Array(12).fill('#E53E3E');
          const coresBorda = Array(12).fill('#C53030');
          
          estatisticasData.por_mes.forEach((item: ItemMensal) => {
            if (item.mes >= 1 && item.mes <= 12) {
              dadosMensais[item.mes - 1] = item.total_mes;
              
              // Determinar a cor com base no valor
              const cores = determinarCor(item.total_mes);
              coresFundo[item.mes - 1] = cores.backgroundColor;
              coresBorda[item.mes - 1] = cores.borderColor;
            }
          });
          
          setDadosGrafico(prev => ({
            ...prev,
            datasets: [{
              ...prev.datasets[0],
              data: dadosMensais,
              backgroundColor: coresFundo,
              borderColor: coresBorda
            }]
          }));
        } else {
          // Nenhum dado mensal disponível, manter o gráfico vazio mas sem erro
          console.log("Nenhum dado mensal disponível");
        }
      } catch (estatisticasError) {
        console.log("Erro ao carregar estatísticas:", estatisticasError);
        // Não exibir erro para o usuário se apenas as estatísticas falharem
        // Apenas mantenha o gráfico vazio
      }
      
      // Marcar que a primeira consulta foi realizada com sucesso
      setPrimeiraConsulta(true);
      
    } catch (error) {
      console.log("Erro ao carregar relatório:", error);
      
      // Verificar se é um erro de "sem dados" ou um erro de conexão/servidor
      if (error instanceof Error && error.message.includes("sem dados")) {
        // Nenhum dado disponível para o período selecionado - não é um erro real
        setRelatorio([]);
        setPrimeiraConsulta(true);
        // Não exibir mensagem de erro, apenas o estado vazio
      } else {
        // Erro real de conexão ou do servidor
        setError("Erro ao carregar dados. Por favor, tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Função para aplicar os filtros de data
  const aplicarFiltro = () => {
    carregarDados();
  };

  // Função para formatar a data para exibição
  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  // Função para formatar valor monetário
  const formatarMoeda = (valor: number) => {
    return `kzs ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  // Função para exportar como PDF
  const handleExportarPDF = async () => {
    if (relatorio.length === 0) {
      setError("Não há dados para exportar");
      return;
    }
    
    setExportLoading(true);
    try {
      const blob = await exportarPDF();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'relatorio.pdf';
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

  // Função para exportar como CSV
  const handleExportarCSV = async () => {
    if (relatorio.length === 0) {
      setError("Não há dados para exportar");
      return;
    }
    
    setExportLoading(true);
    try {
      const blob = await exportarCSV();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'relatorio.csv';
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

  return (
    <div>
      <Navbar/>
      
      {/* Container principal com margens responsivas */}
      <div className="flex flex-col mb-20 md:mb-20 gap-2 mt-[48%] md:[45%] md:mt-[15%] mx-4 md:mx-8 max-w-full md:max-w-[1200px] shadow-custom p-4 md:p-8 rounded-[10px]">
        
        {/* Cabeçalho com layout responsivo */}
        <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-centers mb-6 md:mb-8">
          <h1 className="text-marieth text-xl md:text-[2rem] font-bold mb-4 sm:mb-0">Relatório de Compras</h1>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto sm:ml-auto items-start sm:items-center">
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
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            <button 
              onClick={() => setError(null)}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        )}

        {/* Cards de estatísticas responsivos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6 md:mb-8 gap-4 md:gap-6">
          <div className="p-4 md:p-6 rounded-[10px] text-center shadow-custom bg-white">
            <h3 className="m-0 text-cortexto text-base md:text-[1.17rem]">Total Gasto</h3>
            <p className="text-marieth font-bold p-2 md:p-4 my-2 mx-0 text-xl md:text-[2rem]">
              {estatisticas ? formatarMoeda(estatisticas.total_gasto) : 'kzs 0'}
            </p>
          </div>
          <div className="p-4 md:p-6 rounded-[10px] text-center shadow-custom bg-white">
            <h3 className="m-0 text-cortexto text-base md:text-[1.17rem]">Quantidade de Pedidos</h3>
            <p className="text-marieth font-bold p-2 md:p-4 my-2 mx-0 text-xl md:text-[2rem]">
              {estatisticas ? estatisticas.total_pedidos : '0'}
            </p>
          </div>
          <div className="p-4 md:p-6 rounded-[10px] text-center shadow-custom bg-white">
            <h3 className="m-0 text-cortexto text-base md:text-[1.17rem]">Média por Pedido</h3>
            <p className="text-marieth font-bold p-2 md:p-4 my-2 mx-0 text-xl md:text-[2rem]">
              {estatisticas ? formatarMoeda(estatisticas.media_por_pedido) : 'kzs 0'}
            </p>
          </div>
          <div className="p-4 md:p-6 rounded-[10px] text-center shadow-custom bg-white">
            <h3 className="m-0 text-cortexto text-base md:text-[1.17rem]">Fornecedores</h3>
            <p className="text-marieth font-bold p-2 md:p-4 my-2 mx-0 text-xl md:text-[2rem]">
              {estatisticas ? estatisticas.total_produtores : '0'}
            </p>
          </div>
        </div>

        {/* Container do gráfico responsivo */}
        <div 
          ref={chartContainerRef} 
          className="bg-white p-4 md:p-6 rounded-[10px] mb-6 md:mb-8 border-[1px] border-solid border-tab h-[300px] md:h-[400px]"
        >
          <div className="h-full">
            <Bar 
              ref={chartRef}
              data={dadosGrafico} 
              options={options} 
            />
          </div>
        </div>

        {/* Tabela com scroll horizontal em telas pequenas */}
        <div className="overflow-x-auto bg-white rounded-[10px] shadow-sm border border-gray-100">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 md:p-4 text-left border-b-[1px] border-b-solid border-b-tab text-cortexto bg-th text-xs md:text-sm">Data</th>
                <th className="p-2 md:p-4 text-left border-b-[1px] border-b-solid border-b-tab text-cortexto bg-th text-xs md:text-sm">Produto</th>
                <th className="p-2 md:p-4 text-left border-b-[1px] border-b-solid border-b-tab text-cortexto bg-th text-xs md:text-sm">Fornecedor</th>
                <th className="p-2 md:p-4 text-left border-b-[1px] border-b-solid border-b-tab text-cortexto bg-th text-xs md:text-sm">Qtd</th>
                <th className="p-2 md:p-4 text-left border-b-[1px] border-b-solid border-b-tab text-cortexto bg-th text-xs md:text-sm">Valor Total</th>
                <th className="p-2 md:p-4 text-left border-b-[1px] border-b-solid border-b-tab text-cortexto bg-th text-xs md:text-sm">Estado</th>
              </tr>
            </thead>    

            <tbody>
              {!primeiraConsulta ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center border-b-[1px] border-b-solid border-b-tab text-xs md:text-sm text-gray-500">
                    Clique no botão "Filtrar" para visualizar os dados de compras
                  </td>
                </tr>
              ) : relatorio.length > 0 ? (
                relatorio.map((item, index) => (
                  <tr key={index} className="hover:bg-th">
                    <td className="p-2 md:p-4 text-left border-b-[1px] border-b-solid border-b-tab text-xs md:text-sm">
                      {formatarData(item.Data_Pedido)}
                    </td>
                    <td className="p-2 md:p-4 text-left border-b-[1px] border-b-solid border-b-tab text-xs md:text-sm">
                      {item.Nome_Produto}
                    </td>
                    <td className="p-2 md:p-4 text-left border-b-[1px] border-b-solid border-b-tab text-xs md:text-sm">
                      {item.Nome_Usuario || 'Não informado'}
                    </td>
                    <td className="p-2 md:p-4 text-left border-b-[1px] border-b-solid border-b-tab text-xs md:text-sm">
                      {item.Quantidade_Total} un
                    </td>
                    <td className="p-2 md:p-4 text-left border-b-[1px] border-b-solid border-b-tab text-xs md:text-sm">
                      {formatarMoeda(item.Valor_Total)}
                    </td>
                    <td className="p-2 md:p-4 text-left border-b-[1px] border-b-solid border-b-tab text-xs md:text-sm">
                      {item.Estado}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-4 text-center border-b-[1px] border-b-solid border-b-tab text-xs md:text-sm">
                    {isLoading ? "Carregando..." : "Nenhum dado de compra encontrado no período selecionado"}
                  </td>
                </tr>
              )}
            </tbody>           
          </table>
        </div>
        
        {/* Botão de exportação responsivo */}
        <div className="relative mt-4 flex justify-center sm:justify-start">
          <button 
            className={`bg-marieth cursor-pointer rounded-[10px] border-none
            hover:bg-verdeaceso text-white py-2 px-4 md:py-[0.8rem] md:px-[1.5rem] w-full sm:w-auto
            ${relatorio.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            disabled={relatorio.length === 0 || exportLoading}
          >
            {exportLoading ? 'Exportando...' : 'Exportar Relatório'}
          </button>
          
          {dropdownOpen && (
            <div className="absolute top-full left-0 sm:left-auto z-10 mt-2 w-full sm:w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                <button
                  onClick={handleExportarPDF}
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
        </div>
      </div>
      <Footer/>
    </div>
  );
}