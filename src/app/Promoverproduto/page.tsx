'use client';
import Head from 'next/head';
import React from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { useRouter } from 'next/navigation'; // Importa o hook correto para roteamento

const PromoPage = () => {
  const router = useRouter(); // Inicializa o hook de roteamento

  const selectPackage = (packageName: string) => {
    console.log('Pacote selecionado:', packageName);
    // Redireciona para a tela de pagamento
    router.push(`/telapaga?pacote=${packageName}`);
  };

  return (
    <div>
      <Head>
        <title>Promover Produto</title>
      </Head>
      <Navbar />
      <main className="bg-white min-h-screen py-10 px-4 mb-20 mt-[30%] lg:mt-[15%]">
        <div className="max-w-screen-lg mx-auto">
          <div className="text-center mb-12">
            <img src="/promotion_icon.png" alt="Promoção" className="w-12 h-12 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Destaque seus Produtos</h1>
            <p className="text-gray-600 text-lg max-w-xl mx-auto">
              Escolha o melhor pacote promocional e aumente a visibilidade dos seus produtos na nossa plataforma
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pacote 3 Dias */}
            <div className="bg-white rounded-xl p-6 text-center shadow hover:-translate-y-1 transition transform duration-300">
              <div className="text-xl font-bold text-gray-800 mb-2">3 Dias</div>
              <div className="text-3xl font-extrabold text-green-600 mb-4">
                6.000 <small className="text-sm text-gray-500">KZs</small>
              </div>
              <ul className="text-gray-600 text-sm mb-6 space-y-2">
                <li>Destaque na página principal</li>
                <li>Prioridade nas buscas</li>
                <li>Badge especial no produto</li>
              </ul>
              <button
                onClick={() => selectPackage('3dias')}
                className="bg-marieth text-white font-semibold py-2 px-4 w-full rounded hover:bg-verdeaceso transition"
              >
                Selecionar Pacote
              </button>
            </div>

            {/* Pacote 5 Dias */}
            <div className="bg-white rounded-xl p-6 text-center shadow hover:-translate-y-1 transition transform duration-300">
              <div className="text-xl font-bold text-gray-800 mb-2">5 Dias</div>
              <div className="text-3xl font-extrabold text-marieth mb-4">
                8.000 <small className="text-sm text-gray-500">KZs</small>
              </div>
              <ul className="text-gray-600 text-sm mb-6 space-y-2">
                <li>Destaque na página principal</li>
                <li>Prioridade nas buscas</li>
                <li>Badge especial no produto</li>
                <li>Notificações push</li>
              </ul>
              <button
                onClick={() => selectPackage('5dias')}
                className="bg-marieth text-white font-semibold py-2 px-4 w-full rounded hover:bg-verdeaceso transition"
              >
                Selecionar Pacote
              </button>
            </div>

            {/* Pacote 7 Dias - Mais Popular */}
            <div className="relative bg-white rounded-xl p-6 text-center shadow hover:-translate-y-1 transition transform duration-300">
              <span className="absolute top-4 -right-12 transform rotate-45 bg-yellow-400 text-sm font-bold text-gray-800 py-1 px-12 shadow">
                Mais Popular
              </span>
              <div className="text-xl font-bold text-gray-800 mb-2">7 Dias</div>
              <div className="text-3xl font-extrabold text-marieth mb-4">
                10.000 <small className="text-sm text-gray-500">KZs</small>
              </div>
              <ul className="text-gray-600 text-sm mb-6 space-y-2">
                <li>Destaque na página principal</li>
                <li>Prioridade nas buscas</li>
                <li>Badge especial no produto</li>
                <li>Notificações push</li>
                <li>Relatório de desempenho</li>
              </ul>
              <button
                onClick={() => selectPackage('7dias')}
                className="bg-green-600 text-white font-semibold py-2 px-4 w-full rounded hover:bg-verdeaceso transition"
              >
                Selecionar Pacote
              </button>
            </div>

            {/* Pacote 1 Mês */}
            <div className="bg-white rounded-xl p-6 text-center shadow hover:-translate-y-1 transition transform duration-300">
              <div className="text-xl font-bold text-gray-800 mb-2">1 Mês</div>
              <div className="text-3xl font-extrabold text-marieth mb-4">
                20.000 <small className="text-sm text-gray-500">KZs</small>
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
                onClick={() => selectPackage('1mes')}
                className="bg-marieth text-white font-semibold py-2 px-4 w-full rounded hover:bg-verdeaceso transition"
              >
                Selecionar Pacote
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
