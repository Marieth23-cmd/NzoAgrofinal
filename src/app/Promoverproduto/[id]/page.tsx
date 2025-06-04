'use client';
import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
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
  const params = useParams();
  
  const [produtoId, setProdutoId] = useState<number | null>(null);
  const [produtoInfo, setProdutoInfo] = useState<ProdutoInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingPacote, setLoadingPacote] = useState<number | null>(null); // Para controlar qual pacote está carregando
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>({});
  
  // Pacotes de destaque padrão (fallback caso a API falhe)
  const [pacotes, setPacotes] = useState<Pacote[]>([
    { dias: 3, valor: 6000, descricao: "Pacote básico - 3 dias de destaque" },
    { dias: 5, valor: 8000, descricao: "Pacote intermediário - 5 dias de destaque" },
    { dias: 7, valor: 10000, descricao: "Pacote avançado - 7 dias de destaque" },
    { dias: 30, valor: 20000, descricao: "Pacote premium - 30 dias de destaque" }
  ]);

  // Função melhorada para extrair ID do produto
  const extrairIdProduto = (): string | null => {
    try {
      console.log('=== DEBUG: Extraindo ID do produto ===');
      
      const debugData: any = {
        timestamp: new Date().toISOString(),
        windowLocation: typeof window !== 'undefined' ? {
          href: window.location.href,
          pathname: window.location.pathname,
          search: window.location.search,
          hash: window.location.hash
        } : null,
        searchParams: searchParams?.toString() || null,
        params: params || null
      };

      console.log('Debug data:', debugData);
      setDebugInfo(debugData);

      let idString: string | null = null;

      // 1. Tentar pegar dos parâmetros da rota dinâmica (useParams)
      if (params) {
        console.log('Params disponíveis:', params);
        
        // Verificar todas as propriedades possíveis
        const possibleKeys = ['id', 'id_produtos', 'produto', 'produtoId'];
        for (const key of possibleKeys) {
          if (params[key]) {
            idString = String(params[key]);
            console.log(`ID encontrado em params.${key}:`, idString);
            break;
          }
        }

        // Se não encontrou com chaves específicas, pegar qualquer valor que pareça um ID
        if (!idString) {
          const paramValues = Object.values(params);
          for (const value of paramValues) {
            const strValue = String(value);
            // Verificar se não é a string template literal mal formada
            if (strValue && !strValue.includes('${') && !strValue.includes('%7B')) {
              const potentialId = parseInt(strValue, 10);
              if (!isNaN(potentialId) && potentialId > 0) {
                idString = strValue;
                console.log('ID encontrado nos valores dos params:', idString);
                break;
              }
            }
          }
        }
      }

      // 2. Tentar pegar dos search params
      if (!idString && searchParams) {
        const possibleKeys = ['id', 'id_produtos', 'produto', 'produtoId'];
        for (const key of possibleKeys) {
          const value = searchParams.get(key);
          if (value && !value.includes('${') && !value.includes('%7B')) {
            idString = value;
            console.log(`ID encontrado em searchParams.${key}:`, idString);
            break;
          }
        }
      }

      // 3. Tentar extrair do pathname
      if (!idString && typeof window !== 'undefined') {
        const pathname = window.location.pathname;
        console.log('Analisando pathname:', pathname);
        
        const segments = pathname.split('/').filter(s => s.length > 0);
        console.log('Segmentos do path:', segments);

        for (let i = segments.length - 1; i >= 0; i--) {
          const segment = decodeURIComponent(segments[i]);
          console.log(`Analisando segmento ${i}:`, segment);
          
          // Pular segmentos que contenham template literals mal formados
          if (segment.includes('${') || segment.includes('%7B') || segment.includes('produtoId')) {
            console.log('Pulando segmento com template literal:', segment);
            continue;
          }

          const potentialId = parseInt(segment, 10);
          if (!isNaN(potentialId) && potentialId > 0) {
            idString = segment;
            console.log('ID válido encontrado no segmento:', idString);
            break;
          }
        }
      }

      // 4. Tentar extrair da query string manualmente
      if (!idString && typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const possibleKeys = ['id', 'id_produtos', 'produto', 'produtoId'];
        
        for (const key of possibleKeys) {
          const value = urlParams.get(key);
          if (value && !value.includes('${') && !value.includes('%7B')) {
            idString = value;
            console.log(`ID encontrado na query string manual (${key}):`, idString);
            break;
          }
        }
      }

      console.log('ID final extraído:', idString);
      return idString;
    } catch (error) {
      console.error('Erro ao extrair ID do produto:', error);
      return null;
    }
  };

  // Função para validar e processar o ID
  const processarIdProduto = () => {
    try {
      setError(null);
      
      const idString = extrairIdProduto();
      
      if (!idString) {
        console.log('Nenhum ID encontrado');
        setError('ID do produto não encontrado na URL. Verifique se você acessou esta página através de um link válido de produto.');
        return;
      }

      // Decodificar possíveis caracteres especiais
      const decodedId = decodeURIComponent(idString);
      console.log('ID decodificado:', decodedId);

      // Verificar se ainda contém template literals
      if (decodedId.includes('${') || decodedId.includes('produtoId')) {
        console.log('ID contém template literal não resolvido:', decodedId);
        setError('Erro na URL: o link parece estar mal formado. Tente acessar o produto novamente.');
        return;
      }

      const id = parseInt(decodedId, 10);
      console.log('ID convertido para número:', id);

      if (isNaN(id) || id <= 0) {
        console.log('ID inválido:', decodedId);
        setError(`ID do produto inválido: "${decodedId}". Verifique se o link está correto.`);
        return;
      }

      console.log('✅ ID do produto válido:', id);
      setProdutoId(id);
      carregarInfoProduto(id);
    } catch (error) {
      console.error('Erro ao processar ID do produto:', error);
      setError('Erro ao processar o ID do produto. Tente acessar novamente.');
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
      console.log('✅ Informações do produto carregadas com sucesso');
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
        console.log('✅ Pacotes carregados com sucesso:', data);
      } else {
        console.log('Usando pacotes padrão (API não retornou dados)');
      }
    } catch (error) {
      console.error('Erro ao carregar pacotes:', error);
      console.log('Usando pacotes padrão devido ao erro');
      // Os pacotes padrão já estão definidos no estado inicial
    }
  };

  // Selecionar pacote - FUNÇÃO CORRIGIDA
  const selectPackage = async (dias: number) => {
    if (!produtoId) {
      setError('Selecione um produto antes de escolher um pacote');
      return;
    }

    // Verificar se já está processando algum pacote
    if (loadingPacote !== null) {
      console.log('Já está processando um pacote, ignorando clique');
      return;
    }

    setLoading(true);
    setLoadingPacote(dias); // Marcar qual pacote está sendo processado
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
      setLoadingPacote(null); // Limpar o estado de loading do pacote
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

  // Função para tentar novamente
  const tentarNovamente = () => {
    setError(null);
    setProdutoId(null);
    setProdutoInfo(null);
    setLoadingPacote(null); // Limpar estado de loading
    processarIdProduto();
  };

  useEffect(() => {
    // Aguardar um pouco para garantir que o componente foi montado e os parâmetros estão disponíveis
    const timer = setTimeout(() => {
      console.log('🔄 Executando useEffect - carregando dados...');
      processarIdProduto();
      carregarPacotes();
    }, 100);

    return () => clearTimeout(timer);
  }, [searchParams, params]);

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
                  ✅ Produto selecionado: {produtoInfo.nome}
                </p>
                <p className="text-sm text-green-600">
                  ID: {obterIdProduto(produtoInfo)}
                </p>
              </div>
            )}
            {produtoId && !produtoInfo && !error && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-600">
                  🔄 Carregando informações do produto ID: {produtoId}...
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg text-center">
              <div className="flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-medium text-lg">Ops! Algo deu errado</p>
              </div>
              <p className="mb-4">{error}</p>
              <div className="space-y-2">
                <button 
                  onClick={tentarNovamente}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition mr-3"
                >
                  🔄 Tentar Novamente
                </button>
                <button 
                  onClick={() => router.back()}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
                >
                  ← Voltar
                </button>
              </div>
            </div>
          )}

          {/* Debug info - mostrar apenas se houver erro ou em desenvolvimento */}
          {(error || process.env.NODE_ENV === 'development') && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <details className="text-sm">
                <summary className="font-medium text-yellow-800 cursor-pointer mb-2">
                  🐛 Informações de Debug (clique para expandir)
                </summary>
                <div className="bg-yellow-100 p-3 rounded text-xs font-mono space-y-1">
                  <p><strong>Timestamp:</strong> {debugInfo.timestamp}</p>
                  <p><strong>URL atual:</strong> {debugInfo.windowLocation?.href || 'N/A'}</p>
                  <p><strong>Pathname:</strong> {debugInfo.windowLocation?.pathname || 'N/A'}</p>
                  <p><strong>Search:</strong> {debugInfo.windowLocation?.search || 'N/A'}</p>
                  <p><strong>Produto ID extraído:</strong> {produtoId || 'N/A'}</p>
                  <p><strong>Search Params:</strong> {debugInfo.searchParams || 'N/A'}</p>
                  <p><strong>Params (useParams):</strong> {JSON.stringify(debugInfo.params) || 'N/A'}</p>
                  <p><strong>Produto Info:</strong> {produtoInfo ? `✅ ${produtoInfo.nome}` : '❌ Não carregado'}</p>
                </div>
              </details>
            </div>
          )}

          {/* Cards dos pacotes - ESTRUTURA CORRIGIDA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pacotes.map((pacote, index) => (
              <div key={index} className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 ${index === 2 ? 'relative border-green-300' : ''}`}>
                {index === 2 && (
                  <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-sm font-bold text-gray-800 py-1 px-4 rounded-full shadow-md">
                    Mais Popular
                  </span>
                )}
                
                {/* Header do card */}
                <div className="text-center mb-6">
                  <div className={`text-2xl font-bold mb-2 ${index === 2 ? 'text-green-600' : 'text-gray-800'}`}>
                    {pacote.dias} Dias
                  </div>
                  <div className={`text-3xl font-extrabold ${index === 2 ? 'text-green-600' : 'text-marieth'}`}>
                    {formatarValor(pacote.valor)}
                  </div>
                </div>

                {/* Lista de benefícios */}
                <ul className="text-gray-600 text-sm mb-8 space-y-3">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                    <span>Destaque na página principal</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                    <span>{pacote.dias >= 30 ? 'Prioridade máxima nas buscas' : 'Prioridade nas buscas'}</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                    <span>Badge especial no produto</span>
                  </li>
                  {pacote.dias >= 5 && (
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                      <span>Notificações push</span>
                    </li>
                  )}
                  {pacote.dias >= 7 && (
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                      <span>Relatório de desempenho</span>
                    </li>
                  )}
                  {pacote.dias >= 30 && (
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                      <span>Suporte prioritário</span>
                    </li>
                  )}
                </ul>

                {/* Botão - CORRIGIDO */}
                <button
                  onClick={() => selectPackage(pacote.dias)}
                  disabled={loading || !produtoId || loadingPacote !== null}
                  className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 ${
                    index === 2 
                      ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg' 
                      : 'bg-gradient-to-r from-marieth to-verdeaceso hover:shadow-lg'
                  } ${
                    loading || !produtoId || loadingPacote !== null
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:scale-105 active:scale-95'
                  }`}
                  title={!produtoId ? 'Carregue um produto válido primeiro' : ''}
                >
                  {loadingPacote === pacote.dias ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processando...
                    </div>
                  ) : (
                    <>
                      <span className="mr-2">✨</span>
                      Selecionar Pacote
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PromoPage;