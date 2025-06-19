'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CompraFinalizada() {
    const router = useRouter();
    const [animacao, setAnimacao] = useState(false);

    // Animação de entrada
    useEffect(() => {
        const timer = setTimeout(() => setAnimacao(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const handleVoltar = () => {
        router.push('/'); 
    };

    const handleVerPedidos = () => {
        router.push('/pedidos'); // Ajuste a rota conforme necessário
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50 px-4">
            <div className={`max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center transform transition-all duration-700 ${
                animacao ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
                
                {/* Ícone de sucesso animado */}
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <div className={`transform transition-all duration-1000 delay-300 ${
                        animacao ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
                    }`}>
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>

                {/* Título principal */}
                <h1 className="text-3xl font-bold mb-3 text-gray-800">
                    Compra Finalizada!
                </h1>

                {/* Mensagem de agradecimento */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                    Obrigado por sua compra! Seu pedido foi processado com sucesso e você receberá uma confirmação em breve.
                </p>

                {/* Informações adicionais */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-sm text-gray-700">
                    <div className="flex items-center justify-center mb-2">
                        <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">Próximos passos:</span>
                    </div>
                    <ul className="text-left space-y-1 text-xs">
                        <li>• Você receberá um e-mail de confirmação</li>
                        <li>• Acompanhe o status do seu pedido</li>
                        <li>• Entre em contato se tiver dúvidas</li>
                    </ul>
                </div>

                {/* Botões de ação */}
                <div className="space-y-3">
                    <button
                        onClick={handleVerPedidos}
                        className="w-full px-6 py-3 bg-marieth text-white rounded-lg hover:bg-marieth/90 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                        Ver Meus Pedidos
                    </button>
                    
                    <button
                        onClick={handleVoltar}
                        className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
                    >
                        Voltar à Página Inicial
                    </button>
                </div>

                {/* Elementos decorativos */}
                <div className="mt-8 flex justify-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-100"></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-200"></div>
                </div>
            </div>

            {/* Confetti effect (opcional) */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className={`absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-pink-400 transform transition-all duration-3000 ${
                            animacao ? 'translate-y-screen opacity-0' : '-translate-y-4 opacity-100'
                        }`}
                        style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`,
                            transform: `rotate(${Math.random() * 360}deg)`,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}