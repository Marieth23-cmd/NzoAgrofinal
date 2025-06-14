'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

 export default function CompraFinaliza() {
    // Hook para acessar o roteador do Next.js
    const router = useRouter();
    const handleVoltar = () => {
        router.push('/'); 
    };

    return (
        
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-4">Compra Finalizada!</h1>
            <p className="text-lg mb-6">Obrigado por sua compra!</p>
            <button
                onClick={handleVoltar}
                className="px-6 py-2 bg-marieth text-white rounded hover:bg-verdeaceso transition"
            >
                Voltar para a Página Inicial
            </button>
        </div>
    );
}
