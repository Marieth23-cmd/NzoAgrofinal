'use client';
import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { useRouter } from 'next/navigation';
import { obterPacotesDestaque, destacarProduto } from '../Services/produtos';
import Image from 'next/image'; 

const PromoPage = () => {
  const router = useRouter();
  const [produtoId, setProdutoId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pacotes, setPacotes] = useState([
    { dias: 3, valor: 6000, descricao: "Pacote básico - 3 dias de destaque" },
    { dias: 5, valor: 8000, descricao: "Pacote intermediário - 5 dias de destaque" },
    { dias: 7, valor: 10000, descricao: "Pacote avançado - 7 dias de destaque" },
    { dias: 30, valor: 20000, descricao: "Pacote premium - 30 dias de destaque" }
  ]);

  useEffect(() => {
    // Obter o ID do produto da URL
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get('produtoId');
    if (id) {
      setProdutoId(parseInt(id));
    } else {
      setError('ID do produto não fornecido. Selecione um produto para destacar.');
    }

    // Carregar pacotes da API
    const carregarPacotes = async () => {
      try {
        const data = await obterPacotesDestaque();
        if (data && data.length > 0) {
          setPacotes(data);
        }
      } catch (error) {
        console.error('Erro ao carregar pacotes:', error);
      }
    };

    carregarPacotes();
  }, []);

  const selectPackage = async (dias: number) => {
    if (!produtoId) {
      setError('Selecione um produto antes de escolher um pacote');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Chamar a API para destacar o produto
      const resposta = await destacarProduto(produtoId, dias);
      
      // Redirecionar para a página de pagamento
      router.push(`/pagamento-destaque/${resposta.idPagamento}`);
    } catch (error: any) {
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
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-md text-center">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pacote 3 Dias */}
            <div className="bg-white rounded-xl p-6 text-center shadow hover:-translate-y-1 transition transform duration-300">
              <div className="text-xl font-bold text-gray-800 mb-2">{pacotes[0].dias} Dias</div>
              <div className="text-3xl font-extrabold text-green-600 mb-4">
                {formatarValor(pacotes[0].valor)}
              </div>
              <ul className="text-gray-600 text-sm mb-6 space-y-2">
                <li>Destaque na página principal</li>
                <li>Prioridade nas buscas</li>
                <li>Badge especial no produto</li>
              </ul>
              <button
                onClick={() => selectPackage(pacotes[0].dias)}
                disabled={loading || !produtoId}
                className={`bg-marieth text-white font-semibold py-2 px-4 w-full rounded transition ${
                  loading || !produtoId ? 'opacity-50 cursor-not-allowed' : 'hover:bg-verdeaceso'
                }`}
              >
                {loading ? 'Processando...' : 'Selecionar Pacote'}
              </button>
            </div>

            {/* Pacote 5 Dias */}
            <div className="bg-white rounded-xl p-6 text-center shadow hover:-translate-y-1 transition transform duration-300">
              <div className="text-xl font-bold text-gray-800 mb-2">{pacotes[1].dias} Dias</div>
              <div className="text-3xl font-extrabold text-marieth mb-4">
                {formatarValor(pacotes[1].valor)}
              </div>
              <ul className="text-gray-600 text-sm mb-6 space-y-2">
                <li>Destaque na página principal</li>
                <li>Prioridade nas buscas</li>
                <li>Badge especial no produto</li>
                <li>Notificações push</li>
              </ul>
              <button
                onClick={() => selectPackage(pacotes[1].dias)}
                disabled={loading || !produtoId}
                className={`bg-marieth text-white font-semibold py-2 px-4 w-full rounded transition ${
                  loading || !produtoId ? 'opacity-50 cursor-not-allowed' : 'hover:bg-verdeaceso'
                }`}
              >
                {loading ? 'Processando...' : 'Selecionar Pacote'}
              </button>
            </div>

            {/* Pacote 7 Dias - Mais Popular */}
            <div className="relative bg-white rounded-xl p-6 text-center shadow hover:-translate-y-1 transition transform duration-300">
              <span className="absolute top-4 -right-12 transform rotate-45 bg-yellow-400 text-sm font-bold text-gray-800 py-1 px-12 shadow">
                Mais Popular
              </span>
              <div className="text-xl font-bold text-gray-800 mb-2">{pacotes[2].dias} Dias</div>
              <div className="text-3xl font-extrabold text-marieth mb-4">
                {formatarValor(pacotes[2].valor)}
              </div>
              <ul className="text-gray-600 text-sm mb-6 space-y-2">
                <li>Destaque na página principal</li>
                <li>Prioridade nas buscas</li>
                <li>Badge especial no produto</li>
                <li>Notificações push</li>
                <li>Relatório de desempenho</li>
              </ul>
              <button
                onClick={() => selectPackage(pacotes[2].dias)}
                disabled={loading || !produtoId}
                className={`bg-green-600 text-white font-semibold py-2 px-4 w-full rounded transition ${
                  loading || !produtoId ? 'opacity-50 cursor-not-allowed' : 'hover:bg-verdeaceso'
                }`}
              >
                {loading ? 'Processando...' : 'Selecionar Pacote'}
              </button>
            </div>

            {/* Pacote 1 Mês */}
            <div className="bg-white rounded-xl p-6 text-center shadow hover:-translate-y-1 transition transform duration-300">
              <div className="text-xl font-bold text-gray-800 mb-2">{pacotes[3].dias} Dias</div>
              <div className="text-3xl font-extrabold text-marieth mb-4">
                {formatarValor(pacotes[3].valor)}
              </div>
              <ul className="text-gray-600 text-sm mb-6 space-y-2">
                <li>Destaque na página principal</li>
                <li>Prioridade máxima nas buscas</li>
                <li>Badge especial no produto</li>
                <li>Notificações push</li>
                <li>Relatório de desempenho</li>
                <li>Suporte prioritário</li>
              </ul>
              <button
                onClick={() => selectPackage(pacotes[3].dias)}
                disabled={loading || !produtoId}
                className={`bg-marieth text-white font-semibold py-2 px-4 w-full rounded transition ${
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
