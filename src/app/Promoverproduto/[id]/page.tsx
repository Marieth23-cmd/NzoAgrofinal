'use client';
import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import { useRouter, useSearchParams } from 'next/navigation';
import { obterPacotesDestaque, destacarProduto, getProdutoById } from '../../Services/produtos';

type Pacote = { dias: number; valor: number; descricao: string };
type ProdutoInfo = { 
  id?: number; 
  id_produtos?: number; 
  nome: string; 
  [key: string]: any 
};

const PromoPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [produtoId, setProdutoId] = useState<number | null>(null);
  const [produtoInfo, setProdutoInfo] = useState<ProdutoInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pacotes de destaque padrão (fallback caso a API falhe)
  const [pacotes, setPacotes] = useState<Pacote[]>([
    { dias: 3, valor: 6000, descricao: "Pacote básico - 3 dias de destaque" },
    { dias: 5, valor: 8000, descricao: "Pacote intermediário - 5 dias de destaque" },
    { dias: 7, valor: 10000, descricao: "Pacote avançado - 7 dias de destaque" },
    { dias: 30, valor: 20000, descricao: "Pacote premium - 30 dias de destaque" }
  ]);

  // Função para extrair parâmetros da URL e carregar produto
  const carregarIdProduto = () => {
    try {
      console.log('Iniciando carregamento do ID do produto...');
      console.log('Search params:', searchParams?.toString());
      console.log('Current pathname:', window.location.pathname);
      console.log('Current search:', window.location.search);
      
      let idString: string | null = null;
      
      // Tentar obter ID dos search params primeiro
      if (searchParams) {
        idString = searchParams.get('id') || searchParams.get('id_produtos') || searchParams.get('produto');
        console.log('ID dos search params:', idString);
      }
      
      // Se não encontrar nos search params, tentar extrair da URL atual
      if (!idString) {
        const currentPath = window.location.pathname;
        const pathSegments = currentPath.split('/').filter(segment => segment.length > 0);
        console.log('Path segments:', pathSegments);
        
        // Buscar o último segmento que seja um número
        for (let i = pathSegments.length - 1; i >= 0; i--) {
          const segment = pathSegments[i];
          const decodedSegment = decodeURIComponent(segment);
          const potentialId = parseInt(decodedSegment, 10);
          
          if (!isNaN(potentialId) && potentialId > 0) {
            idString = decodedSegment;
            console.log('ID encontrado no path:', idString);
            break;
          }
        }
      }
      
      // Também tentar obter da query string manualmente
      if (!idString) {
        const urlParams = new URLSearchParams(window.location.search);
        idString = urlParams.get('id') || urlParams.get('id_produtos') || urlParams.get('produto');
        console.log('ID da query string manual:', idString);
      }
      
      if (!idString) {
        console.log('Nenhum ID encontrado na URL');
        setError('ID do produto não fornecido. Acesse esta página através de um produto específico.');
        return;
      }

      // Decodificar a URL para lidar com caracteres especiais
      const decodedId = decodeURIComponent(idString);
      console.log('ID decodificado:', decodedId);
      
      const id = parseInt(decodedId, 10);
      console.log('ID convertido para número:', id);

      if (isNaN(id) || id <= 0) {
        console.log('ID inválido:', decodedId);
        setError(`ID do produto inválido: "${decodedId}". Por favor, verifique o link e tente novamente.`);
        return;
      }

      setProdutoId(id);
      console.log('ID do produto definido com sucesso:', id);

      // Buscar informações do produto
      carregarInfoProduto(id);
    } catch (error) {
      console.error('Erro ao extrair ID do produto:', error);
      setError('Erro ao processar ID do produto. Tente acessar novamente.');
    }
  };

  // Carregar informações do produto
  const carregarInfoProduto = async (id: number) => {
    try {
      console.log('Buscando informações do produto ID:', id);
      const infoProduto = await getProdutoById(id);
      console.log('Informações do produto retornadas:', infoProduto);
      
      if (!infoProduto) {
        setError('Produto não encontrado. Verifique se o ID está correto.');
        return;
      }
      
      setProdutoInfo(infoProduto);
      console.log('Informações do produto carregadas com sucesso');
    } catch (error) {
      console.error('Erro ao carregar informações do produto:', error);
      setError('Não foi possível carregar as informações do produto. Tente novamente.');
    }
  };

  // Carregar pacotes da API
  const carregarPacotes = async () => {
    try {
      console.log('Carregando pacotes de destaque...');
      const data = await obterPacotesDestaque();
      if (data && data.length > 0) {
        setPacotes(data);
        console.log('Pacotes carregados com sucesso:', data);
      } else {
        console.log('Usando pacotes padrão (API não retornou dados)');
      }
    } catch (error) {
      console.error('Erro ao carregar pacotes:', error);
      console.log('Usando pacotes padrão devido ao erro');
      // Os pacotes padrão já estão definidos no estado inicial
    }
  };

  // Selecionar pacote
  const selectPackage = async (dias: number) => {
    if (!produtoId) {
      setError('Selecione um produto antes de escolher um pacote');
      return;
    }

    setLoading(true);
    setError(null);
    console.log(`Iniciando processo de destaque para produto ID: ${produtoId} por ${dias} dias`);

    try {
      // Chamar a API para destacar o produto
      const resposta = await destacarProduto(produtoId, dias);
      console.log('Resposta da API de destaque:', resposta);

      if (!resposta || !resposta.idPagamento) {
        throw new Error('ID de pagamento não retornado pela API');
      }

      // Redirecionar para a página de pagamento
      console.log(`Redirecionando para pagamento ID: ${resposta.idPagamento}`);
      router.push(`/pagdestacar/${resposta.idPagamento}`);
    } catch (error: any) {
      console.error('Erro ao destacar produto:', error);
      setError(error?.mensagem || 'Erro ao processar solicitação de destaque');
    } finally {
      setLoading(false);
    }
  };

  // Formatação de valor para moeda local (Kwanzas)
  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valor).replace('AOA', 'Kz');
  };

  // Função para obter o ID real do produto (considerando ambos os formatos)
  const obterIdProduto = (produto: ProdutoInfo): number => {
    return produto.id_produtos || produto.id || 0;
  };

  useEffect(() => {
    // Aguardar um pouco para garantir que o componente foi montado
    const timer = setTimeout(() => {
      console.log('Executando useEffect - carregando dados...');
      carregarIdProduto();
      carregarPacotes();
    }, 100);

    return () => clearTimeout(timer);
  }, [searchParams]);

  return (
    <div>
      <Head>
        <title>Promover Produto</title>
      </Head>
      <Navbar />
      <main className="bg-white min-h-screen py-10 px-4 mb-20 mt-[40%] lg:mt-[15%]">
        <div className="max-w-screen-lg mx-auto">
          <div className="text-center mb-12">
            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-green-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h1 className="text-2xl lg:text-4xl font-bold text-gray-800 mb-4">Destaque seus Produtos</h1>
            <p className="text-gray-600 text-lg max-w-xl mx-auto">
              Escolha o melhor pacote promocional e aumente a visibilidade dos seus produtos na nossa plataforma
            </p>
            {produtoId && produtoInfo && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium">
                  Produto selecionado: {produtoInfo.nome}
                </p>
                <p className="text-sm text-green-600">
                  ID: {obterIdProduto(produtoInfo)}
                </p>
              </div>
            )}
            {produtoId && !produtoInfo && !error && (
              <p className="mt-2 text-green-600">
                Carregando informações do produto ID: {produtoId}...
              </p>
            )}
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-md text-center">
              <p className="font-medium">Erro:</p>
              <p>{error}</p>
              <button 
                onClick={() => {
                  setError(null);
                  carregarIdProduto();
                }}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {/* Debug info - remover em produção */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-6 p-4 bg-gray-100 rounded-md text-sm">
              <p><strong>Debug Info:</strong></p>
              <p>URL atual: {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
              <p>Produto ID: {produtoId}</p>
              <p>Search Params: {searchParams?.toString() || 'N/A'}</p>
              <p>Produto Info: {produtoInfo ? JSON.stringify(produtoInfo) : 'N/A'}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pacote 3 Dias */}
            <div className="bg-white rounded-xl p-6 text-center shadow hover:-translate-y-1 transition transform duration-300 flex flex-col h-full">
              <div className="flex-grow">
                <div className="text-xl font-bold text-gray-800 mb-2">{pacotes[0].dias} Dias</div>
                <div className="text-3xl font-extrabold text-green-600 mb-4">
                  {formatarValor(pacotes[0].valor)}
                </div>
                <ul className="text-gray-600 text-sm mb-6 space-y-2 text-left">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Destaque na página principal
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Prioridade nas buscas
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Badge especial no produto
                  </li>
                </ul>
              </div>
              <button
                onClick={() => selectPackage(pacotes[0].dias)}
                disabled={loading || !produtoId}
                className={`bg-marieth text-white font-semibold py-3 px-4 w-full rounded transition mt-auto ${
                  loading || !produtoId ? 'opacity-50 cursor-not-allowed' : 'hover:bg-verdeaceso'
                }`}
              >
                {loading ? 'Processando...' : 'Selecionar Pacote'}
              </button>
            </div>

            {/* Pacote 5 Dias */}
            <div className="bg-white rounded-xl p-6 text-center shadow hover:-translate-y-1 transition transform duration-300 flex flex-col h-full">
              <div className="flex-grow">
                <div className="text-xl font-bold text-gray-800 mb-2">{pacotes[1].dias} Dias</div>
                <div className="text-3xl font-extrabold text-marieth mb-4">
                  {formatarValor(pacotes[1].valor)}
                </div>
                <ul className="text-gray-600 text-sm mb-6 space-y-2 text-left">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Destaque na página principal
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Prioridade nas buscas
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Badge especial no produto
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Notificações push
                  </li>
                </ul>
              </div>
              <button
                onClick={() => selectPackage(pacotes[1].dias)}
                disabled={loading || !produtoId}
                className={`bg-marieth text-white font-semibold py-3 px-4 w-full rounded transition mt-auto ${
                  loading || !produtoId ? 'opacity-50 cursor-not-allowed' : 'hover:bg-verdeaceso'
                }`}
              >
                {loading ? 'Processando...' : 'Selecionar Pacote'}
              </button>
            </div>

            {/* Pacote 7 Dias - Mais Popular */}
            <div className="relative bg-white rounded-xl p-6 text-center shadow hover:-translate-y-1 transition transform duration-300 flex flex-col h-full">
              <span className="absolute top-4 -right-12 transform rotate-45 bg-yellow-400 text-sm font-bold text-gray-800 py-1 px-12 shadow z-10">
                Mais Popular
              </span>
              <div className="flex-grow">
                <div className="text-xl font-bold text-gray-800 mb-2">{pacotes[2].dias} Dias</div>
                <div className="text-3xl font-extrabold text-marieth mb-4">
                  {formatarValor(pacotes[2].valor)}
                </div>
                <ul className="text-gray-600 text-sm mb-6 space-y-2 text-left">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Destaque na página principal
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Prioridade nas buscas
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Badge especial no produto
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Notificações push
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Relatório de desempenho
                  </li>
                </ul>
              </div>
              <button
                onClick={() => selectPackage(pacotes[2].dias)}
                disabled={loading || !produtoId}
                className={`bg-green-600 text-white font-semibold py-3 px-4 w-full rounded transition mt-auto ${
                  loading || !produtoId ? 'opacity-50 cursor-not-allowed' : 'hover:bg-verdeaceso'
                }`}
              >
                {loading ? 'Processando...' : 'Selecionar Pacote'}
              </button>
            </div>

            {/* Pacote 1 Mês */}
            <div className="bg-white rounded-xl p-6 text-center shadow hover:-translate-y-1 transition transform duration-300 flex flex-col h-full">
              <div className="flex-grow">
                <div className="text-xl font-bold text-gray-800 mb-2">{pacotes[3].dias} Dias</div>
                <div className="text-3xl font-extrabold text-marieth mb-4">
                  {formatarValor(pacotes[3].valor)}
                </div>
                <ul className="text-gray-600 text-sm mb-6 space-y-2 text-left">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Destaque na página principal
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Prioridade máxima nas buscas
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Badge especial no produto
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Notificações push
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Relatório de desempenho
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Suporte prioritário
                  </li>
                </ul>
              </div>
              <button
                onClick={() => selectPackage(pacotes[3].dias)}
                disabled={loading || !produtoId}
                className={`bg-marieth text-white font-semibold py-3 px-4 w-full rounded transition mt-auto ${
                  loading || !produtoId ? 'opacity-50 cursor-not-allowed' : 'hover:bg-verdeaceso'
                }`}
              >
                {loading ? 'Processando...' : 'Selecionar Pacote'}
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PromoPage;