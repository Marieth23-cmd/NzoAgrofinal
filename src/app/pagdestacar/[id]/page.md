"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { buscarDadosPagamento, processarPagamentoDestaque } from '../../Services/produtos';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import Image from 'next/image';

type PagamentoParams = {
  id: number;
};

type DadosPagamento = {
  id: number;
  valor: number;
  status: string;
  tipo: string;
  id_produto: number;
  id_usuario: number;
  diasDestaque: number;
  nome_produto?: string;
  created_at?: string;
};

interface PagamentoDestaqueProps {
  params: PagamentoParams;
}

export default function PagamentoDestaque({ params }: PagamentoDestaqueProps) {
  const idPagamento = params.id;
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [loadingDados, setLoadingDados] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [dadosPagamento, setDadosPagamento] = useState<DadosPagamento | null>(null);
  const [metodoPagamento, setMetodoPagamento] = useState('UNITELMONEY');
  
  useEffect(() => {
    // Buscar dados do pagamento
    const fetchDadosPagamento = async () => {
      setLoadingDados(true);
      try {
        const data = await buscarDadosPagamento(idPagamento);
        
        // Determinando a duração do destaque com base no valor
        let diasDestaque = 3; // valor padrão
        if (data.valor === 6000) diasDestaque = 3;
        else if (data.valor === 8000) diasDestaque = 5;
        else if (data.valor === 10000) diasDestaque = 7;
        else if (data.valor === 20000) diasDestaque = 30;
        
        setDadosPagamento({
          ...data,
          diasDestaque
        });
        
        // Se o pagamento já foi processado, mostrar mensagem de sucesso
        if (data.status === 'pago') {
          setSuccess('Este pagamento já foi processado. Seu produto já está em destaque!');
          setTimeout(() => {
            router.push('/');
          }, 3000);
        }
        
      } catch (error: any) {
        setError(error?.mensagem || 'Erro ao buscar dados do pagamento');
      } finally {
        setLoadingDados(false);
      }
    };

    fetchDadosPagamento();
  }, [idPagamento, router]);

  const handleProcessarPagamento = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await processarPagamentoDestaque(idPagamento, metodoPagamento);
      setSuccess('Pagamento processado com sucesso! Seu produto já está em destaque.');
      setTimeout(() => {
        router.push('/meus-produtos');
      }, 3000);
    } catch (error: any) {
      setError(error?.mensagem || 'Erro ao processar pagamento');
    } finally {
      setLoading(false);
    }
  };

  // Mapear a duração dos dias para texto legível
  const obterTextoDuracao = (dias: number) => {
    if (dias === 1) return "1 dia";
    return `${dias} dias`;
  };

  // Formatação de valor para moeda local (Kwanzas)
  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valor);
  };

  return (
    <div>
      <Navbar />
      
      <div className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto my-8 md:my-16">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => router.back()} 
            className="flex items-center text-gray-600 hover:text-marieth transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </button>
        </div>
        <h1 className="text-2xl font-bold mb-6 md:mb-8 text-center">Pagamento de Destaque</h1>
        
        {error && (
          <div className="bg-red-50 p-4 rounded-md border border-red-200 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 p-4 rounded-md border border-green-200 mb-6">
            <p className="text-green-700">{success}</p>
            <p className="mt-2 text-green-700">Redirecionando para seus produtos...</p>
          </div>
        )}
        
        {loadingDados && (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-marieth"></div>
          </div>
        )}
        
        {dadosPagamento && !success && !loadingDados && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold mb-2">Resumo do Pedido</h2>
              <p className="text-gray-600">ID do Pagamento: {idPagamento}</p>
              {dadosPagamento.nome_produto && (
                <p className="text-gray-600">Produto: {dadosPagamento.nome_produto}</p>
              )}
            </div>
            
            <div className="p-6">
              <div className="flex justify-between mb-4">
                <span>Serviço:</span>
                <span className="font-medium">Destaque de Produto</span>
              </div>
              
              <div className="flex justify-between mb-4">
                <span>Duração:</span>
                <span className="font-medium">{obterTextoDuracao(dadosPagamento.diasDestaque)}</span>
              </div>
              
              <div className="flex justify-between mb-6 text-lg font-bold">
                <span>Total:</span>
                <span className="text-marieth">{formatarValor(dadosPagamento.valor)}</span>
              </div>
              
              <div className="mb-6">
                <h3 className="font-bold mb-3">Selecione o método de pagamento:</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div 
                    onClick={() => setMetodoPagamento('UNITELMONEY')}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      metodoPagamento === 'UNITELMONEY' 
                      ? 'border-marieth bg-green-50' 
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-center h-12 mb-2">
                      <Image 
                        src="/images/unitel-money.png" 
                        alt="UNITELMONEY" 
                        width={80} 
                        height={40}
                        className="object-contain" 
                      />
                    </div>
                    <p className="text-center text-sm">UNITELMONEY</p>
                  </div>
                  
                  <div 
                    onClick={() => setMetodoPagamento('AFRIMONEY')}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      metodoPagamento === 'AFRIMONEY' 
                      ? 'border-marieth bg-green-50' 
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-center h-12 mb-2">
                      <Image 
                        src="/images/afrimoney.png" 
                        alt="AFRIMONEY" 
                        width={80} 
                        height={40}
                        className="object-contain" 
                      />
                    </div>
                    <p className="text-center text-sm">AFRIMONEY</p>
                  </div>
                  
                  <div 
                    onClick={() => setMetodoPagamento('MulticaixaExpres')}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      metodoPagamento === 'MulticaixaExpres' 
                      ? 'border-marieth bg-green-50' 
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-center h-12 mb-2">
                      <Image 
                        src="/images/multicaixa.png" 
                        alt="MulticaixaExpres" 
                        width={80} 
                        height={40}
                        className="object-contain" 
                      />
                    </div>
                    <p className="text-center text-sm">Multicaixa Express</p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleProcessarPagamento}
                disabled={loading || dadosPagamento.status === 'pago'}
                className={`w-full py-3 px-4 rounded-md font-bold text-white transition-colors ${
                  loading || dadosPagamento.status === 'pago'
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-marieth hover:bg-verdeaceso'
                }`}
              >
                {loading ? 'Processando...' : dadosPagamento.status === 'pago' ? 'Pagamento Confirmado' : 'Pagar Agora'}
              </button>
              
              <p className="text-center text-sm text-gray-500 mt-4">
                {dadosPagamento.status !== 'pago' && 'Ao clicar em "Pagar Agora", você será redirecionado para o sistema de pagamento selecionado.'}
              </p>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}