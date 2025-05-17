"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { processarPagamentoDestaque } from '../Services/produtos';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import Image from 'next/image';

type PagamentoParams = {
  id: number;
};

type DadosPagamento = {
  dias_destaque: number;
  total: number;
  // adicione outros campos conforme necessário
};

interface PagamentoDestaqueProps {
  params: PagamentoParams;
}

export default function PagamentoDestaque({ params }: PagamentoDestaqueProps) {
  const idPagamento = params.id;
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [dadosPagamento, setDadosPagamento] = useState<DadosPagamento | null>(null);
  const [metodoPagamento, setMetodoPagamento] = useState('UNITELMONEY');
  
useEffect(() => {
  // Buscar dados do pagamento
  const buscarDadosPagamento = async () => {
    try {
      const response = await fetch(`/api/pagamentos/${idPagamento}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Pagamento não encontrado');
      }

      const data = await response.json();
      setDadosPagamento(data);
    } catch (error: any) {
      setError(error?.message || 'Erro ao buscar dados do pagamento');
    }
  };

  buscarDadosPagamento();
}, [idPagamento]);

const handleProcessarPagamento = async () => {
  setLoading(true);
  setError(null);
  setSuccess(null);
  try {
    await processarPagamentoDestaque(idPagamento, metodoPagamento);
    setSuccess('Pagamento processado com sucesso! Seu produto já está em destaque.');
    setTimeout(() => {
      router.push('/');
    }, 3000);
  } catch (error: any) {
    setError(error?.mensagem || error?.message || 'Erro ao processar pagamento');
  } finally {
    setLoading(false);
  }
};

return (
    <div>
      <Navbar />
      
      <div className="min-h-screen p-8 max-w-4xl mx-auto my-16">
        <h1 className="text-2xl font-bold mb-8 text-center">Pagamento de Destaque</h1>
        
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
        
        {dadosPagamento && !success && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold mb-2">Resumo do Pedido</h2>
              <p className="text-gray-600">ID do Pagamento: {idPagamento}</p>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between mb-4">
                <span>Serviço:</span>
                <span className="font-medium">Destaque de Produto</span>
              </div>
              
              <div className="flex justify-between mb-4">
                <span>Duração:</span>
                <span className="font-medium">{dadosPagamento.dias_destaque} dias</span>
              </div>
              
              <div className="flex justify-between mb-6 text-lg font-bold">
                <span>Total:</span>
                <span className="text-marieth">{dadosPagamento.total} Kz</span>
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
                disabled={loading}
                className={`w-full py-3 px-4 rounded-md font-bold text-white transition-colors ${
                  loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-marieth hover:bg-verdeaceso'
                }`}
              >
                {loading ? 'Processando...' : 'Pagar Agora'}
              </button>
              
              <p className="text-center text-sm text-gray-500 mt-4">
                Ao clicar em "Pagar Agora", você será redirecionado para o sistema de pagamento selecionado.
              </p>
            </div>
          </div>
        )}
        
        {!dadosPagamento && !error && !success && (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-marieth"></div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}