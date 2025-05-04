"use client"
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import Navbar from "../Components/Navbar"
import Footer from "../Components/Footer"
import { getRelatorioUsuario, getEstatisticas, exportarPDF, exportarCSV } from "../Services/relatorios"; // Ajuste o caminho conforme a estrutura do seu projeto

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

export default function Comprador() {
  // Estado para controlar o dropdown de exportação
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Estados para armazenar os dados
  const [dataInicial, setDataInicial] = useState<string>('');
  const [dataFinal, setDataFinal] = useState<string>('');
  const [relatorio, setRelatorio] = useState<RelatorioItem[]>([]);
  const [estatisticas, setEstatisticas] = useState<Estatisticas | null>(null);
  const [dadosGrafico, setDadosGrafico] = useState({
    labels: [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
    datasets: [
      {
        label: 'Total de Compras',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        backgroundColor: '#48BB78',
        borderColor: '#2F855A',
        borderWidth: 1,
      },
    ],
  });
  
  // Estado para controle de carregamento e erros
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exportLoading, setExportLoading] = useState(false);
  
  const options: ChartOptions<'bar'> = { 
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  // Função para carregar os dados iniciais
  useEffect(() => {
    carregarDados();
  }, []);

  // Função para buscar dados com base nas datas selecionadas
  const carregarDados = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Buscar relatório do usuário
      const relatorioData = await getRelatorioUsuario(dataInicial || undefined, dataFinal || undefined);
      setRelatorio(relatorioData || []);
      
      // Buscar estatísticas gerais
      const estatisticasData = await getEstatisticas();
      setEstatisticas(estatisticasData);
      
      // Atualizar o gráfico com os dados mensais
      if (estatisticasData?.por_mes) {
        const dadosMensais = Array(12).fill(0);
        estatisticasData.por_mes.forEach((item: ItemMensal) => {
          if (item.mes >= 1 && item.mes <= 12) {
            dadosMensais[item.mes - 1] = item.total_mes;
          }
        });
        
        setDadosGrafico(prev => ({
          ...prev,
          datasets: [{
            ...prev.datasets[0],
            data: dadosMensais
          }]
        }));
      }
    } catch (error) {
      setError("Erro ao carregar dados. Por favor, tente novamente.");
      console.log("Erro:", error);
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
    } catch (err: any) {
      setError(err.mensagem || "Erro ao exportar PDF");
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
    } catch (err: any) {
      setError(err.mensagem || "Erro ao exportar CSV");
    } finally {
      setExportLoading(false);
      setDropdownOpen(false);
    }
  };

  return (
    <div>
      <Navbar/>
      
      <div className="flex flex-col mb-20 gap-2 mt-[15%] max-w-[1200px] shadow-custom p-8 rounded-[10px] ml-8">
        
        <div className="flex items-center mb-8">
          <div className="flex gap-4 items-center">
            <h1 className="text-marieth text-[2rem] font-bold">Relatório de Compras</h1>
            <label htmlFor="data_inicial" className="sr-only">Data Inicial</label>
            <input 
              type="date" 
              id="data_inicial" 
              className="ml-80 p-2 rounded-[5px] items-center border-[1px] border-solid border-tab"
              value={dataInicial}
              onChange={(e) => setDataInicial(e.target.value)}
            />

            <label htmlFor="data_final" className="sr-only">Data Final</label>
            <input 
              type="date" 
              id="data_final" 
              name="data_final" 
              className="p-2 rounded-[5px] items-center border-[1px] border-solid border-tab"
              value={dataFinal}
              onChange={(e) => setDataFinal(e.target.value)}
            />

            <button 
              className="bg-marieth border-none hover:bg-verdeaceso text-white py-2 px-4 rounded-[5px] cursor-pointer"
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
          </div>
        )}

        <div className="grid grid-cols-4 mb-8 gap-6">
          <div className="p-6 rounded-[10px] text-center shadow-custom bg-white">
            <h3 className="m-0 text-cortexto text-[1.17rem]">Total Gasto</h3>
            <p className="text-marieth font-bold p-4 my-2 mx-0 text-[2rem]">
              {estatisticas ? formatarMoeda(estatisticas.total_gasto) : 'kzs 0'}
            </p>
          </div>
          <div className="p-6 rounded-[10px] text-center shadow-custom bg-white">
            <h3 className="m-0 text-cortexto text-[1.17rem]">Quantidade de Pedidos</h3>
            <p className="text-marieth font-bold p-4 my-2 mx-0 text-[2rem]">
              {estatisticas ? estatisticas.total_pedidos : '0'}
            </p>
          </div>
          <div className="p-6 rounded-[10px] text-center shadow-custom bg-white">
            <h3 className="m-0 text-cortexto text-[1.17rem]">Média por Pedido</h3>
            <p className="text-marieth font-bold p-4 my-2 mx-0 text-[2rem]">
              {estatisticas ? formatarMoeda(estatisticas.media_por_pedido) : 'kzs 0'}
            </p>
          </div>
          <div className="p-6 rounded-[10px] text-center shadow-custom bg-white">
            <h3 className="m-0 text-cortexto text-[1.17rem]">Fornecedores</h3>
            <p className="text-marieth font-bold p-4 my-2 mx-0 text-[2rem]">
              {estatisticas ? estatisticas.total_produtores : '0'}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded[10px] mb-8 border-[1px] border-solid border-tab">
          <Bar data={dadosGrafico} options={options} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-4 text-left border-b-[1px] border-b-solid border-b-tab text-cortexto bg-th">Data</th>
                <th className="p-4 text-left border-b-[1px] border-b-solid border-b-tab text-cortexto bg-th">Produto</th>
                <th className="p-4 text-left border-b-[1px] border-b-solid border-b-tab text-cortexto bg-th">Fornecedor</th>
                <th className="p-4 text-left border-b-[1px] border-b-solid border-b-tab text-cortexto bg-th">Quantidade</th>
                <th className="p-4 text-left border-b-[1px] border-b-solid border-b-tab text-cortexto bg-th">Valor Total</th>
                <th className="p-4 text-left border-b-[1px] border-b-solid border-b-tab text-cortexto bg-th">Estado</th>
              </tr>
            </thead>    

            <tbody>
              {relatorio.length > 0 ? (
                relatorio.map((item, index) => (
                  <tr key={index} className="hover:bg-th">
                    <td className="p-4 text-left border-b-[1px] border-b-solid border-b-tab">
                      {formatarData(item.Data_Pedido)}
                    </td>
                    <td className="p-4 text-left border-b-[1px] border-b-solid border-b-tab">
                      {item.Nome_Produto}
                    </td>
                    <td className="p-4 text-left border-b-[1px] border-b-solid border-b-tab">
                      {item.Nome_Usuario || 'Não informado'}
                    </td>
                    <td className="p-4 text-left border-b-[1px] border-b-solid border-b-tab">
                      {item.Quantidade_Total} un
                    </td>
                    <td className="p-4 text-left border-b-[1px] border-b-solid border-b-tab">
                      {formatarMoeda(item.Valor_Total)}
                    </td>
                    <td className="p-4 text-left border-b-[1px] border-b-solid border-b-tab">
                      {item.Estado}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-4 text-center border-b-[1px] border-b-solid border-b-tab">
                    {isLoading ? "Carregando..." : "Nenhum dado encontrado"}
                  </td>
                </tr>
              )}
            </tbody>           
          </table>
        </div>
        
        <div className="relative mt-4">
          <button 
            className={`bg-marieth cursor-pointer rounded-[10px] border-none
            hover:bg-verdeaceso text-white py-[0.8rem] px-[1.5rem] ${relatorio.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            disabled={relatorio.length === 0 || exportLoading}
          >
            {exportLoading ? 'Exportando...' : 'Exportar Relatório'}
          </button>
          
          {dropdownOpen && (
            <div className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
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