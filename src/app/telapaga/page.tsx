'use client'
import { useState, FormEvent } from 'react'
import Footer from '../Components/Footer'
import Navbar from '../Components/Navbar'
import { useRouter } from 'next/navigation'

type MetodoPagamento = 'unitel_money' | 'afrimoney' | 'multicaixa'
type StatusPagamento = 'gerando' | 'aguardando' | 'pago' | 'expirado'

type MetodoInfo = {
  nome: string
  taxa: number
  instrucoes: string[]
  icon: string
}

const metodos: Record<MetodoPagamento, MetodoInfo> = {
  unitel_money: {
    nome: 'Unitel Money',
    taxa: 0.02, // 2%
    instrucoes: [
      'Abra o app Unitel Money no seu telemóvel',
      'Vá em "Pagar Serviços" ou "Transferir"',
      'Digite a referência de pagamento',
      'Confirme o valor e autorize com seu PIN'
    ],
    icon: '📱'
  },
  afrimoney: {
    nome: 'Afrimoney',
    taxa: 0.015, // 1.5%
    instrucoes: [
      'Abra o app Afrimoney',
      'Selecione "Pagamentos"',
      'Insira a referência fornecida',
      'Confirme o pagamento com sua senha'
    ],
    icon: '💳'
  },
  multicaixa: {
    nome: 'Multicaixa Express',
    taxa: 0.025, // 2.5%
    instrucoes: [
      'Acesse o app Multicaixa Express',
      'Vá em "Pagar Conta"',
      'Digite a referência do pagamento',
      'Autorize a transação'
    ],
    icon: '🏦'
  }
}

export default function PagamentoPage() {
  const [metodo, setMetodo] = useState<MetodoPagamento>('unitel_money')
  const [status, setStatus] = useState<StatusPagamento>('gerando')
  const [referenciaPagamento, setReferenciaPagamento] = useState('')
  const [transacaoId, setTransacaoId] = useState('')
  const [copiado, setCopiado] = useState(false)
  const router = useRouter()

  const valorSubtotal = 2500
  const valorFrete = 50
  const valorBruto = valorSubtotal + valorFrete
  const valorTaxa = valorBruto * metodos[metodo].taxa
  const valorLiquido = valorBruto - valorTaxa

  const gerarReferencia = () => {
    const novaReferencia = `REF_${Date.now()}`
    const novoTransacaoId = `TXN_${Math.random().toString(36).substr(2, 8).toUpperCase()}`
    
    setReferenciaPagamento(novaReferencia)
    setTransacaoId(novoTransacaoId)
    setStatus('aguardando')
    
    // Simular confirmação após 10 segundos (para demonstração)
    setTimeout(() => {
      setStatus('pago')
    }, 10000)
  }

  const copiarReferencia = async () => {
    await navigator.clipboard.writeText(referenciaPagamento)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  const verificarStatus = () => {
    alert(`Verificando status da transação: ${transacaoId}`)
  }

  // TELA DE AGUARDANDO/PAGO
  if (status === 'aguardando' || status === 'pago') {
    return (
      <main className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow mb-20 mt-[40%] md:mt-[30%] lg:mt-[15%]">
          <div className="min-h-screen flex items-center justify-center bg-white p-2 sm:p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-4 sm:p-6 md:p-8">
              
              {/* Status Header */}
              <div className="text-center mb-6">
                {status === 'aguardando' ? (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
                      <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-marieth">Aguardando Pagamento</h2>
                    <p className="text-gray-600 text-sm">Complete o pagamento no seu app bancário</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
                      <svg className="w-8 h-8 text-verdeaceso" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-verdeaceso">Pagamento Confirmado!</h2>
                    <p className="text-gray-600 text-sm">Seu pedido está sendo processado</p>
                  </div>
                )}
              </div>

              {/* Método Selecionado */}
              <div className="bg-marieth text-white rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl mr-2">{metodos[metodo].icon}</span>
                    <span className="font-semibold">{metodos[metodo].nome}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{valorBruto.toLocaleString()} Kz</div>
                    <div className="text-sm opacity-90">Taxa: {valorTaxa.toFixed(0)} Kz</div>
                  </div>
                </div>
              </div>

              {/* Referência de Pagamento */}
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">📋 Referência de Pagamento:</h3>
                <div className="flex items-center justify-between bg-white rounded p-3 border">
                  <code className="font-mono text-lg font-bold text-marieth">{referenciaPagamento}</code>
                  <button
                    onClick={copiarReferencia}
                    className="flex items-center space-x-1 text-marieth hover:text-verdeaceso"
                  >
                    {copiado ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                    <span className="text-sm">{copiado ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>

              {/* Instruções */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-marieth" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Como pagar:
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                  {metodos[metodo].instrucoes.map((instrucao, index) => (
                    <li key={index}>{instrucao}</li>
                  ))}
                </ol>
              </div>

              {/* Timer */}
              {status === 'aguardando' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-red-700">
                    ⏰ <strong>Atenção:</strong> Esta referência expira em 24h
                  </p>
                </div>
              )}

              {/* Ações */}
              <div className="space-y-3">
                {status === 'aguardando' && (
                  <button
                    onClick={verificarStatus}
                    className="w-full bg-marieth hover:bg-verdeaceso text-white py-3 rounded-[5px] font-semibold transition"
                  >
                    Verificar Status do Pagamento
                  </button>
                )}
                
                {status === 'pago' && (
                  <button
                    onClick={() => router.push('/confirmacao-pedido')}
                    className="w-full bg-verdeaceso hover:bg-marieth text-white py-3 rounded-[5px] font-semibold transition"
                  >
                    Continuar para Confirmação
                  </button>
                )}

                <button
                  onClick={() => setStatus('gerando')}
                  className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-[5px] transition"
                >
                  Voltar
                </button>
              </div>

              {/* Info Transação */}
              <div className="mt-6 pt-4 border-t text-center">
                <p className="text-xs text-gray-500">
                  ID da Transação: <code className="bg-gray-100 px-1 rounded">{transacaoId}</code>
                </p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  // TELA PRINCIPAL DE SELEÇÃO
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow mb-20 mt-[40%] md:mt-[30%] lg:mt-[15%]">
        <div className="min-h-screen flex items-center justify-center bg-white p-2 sm:p-4">
          <div className="w-full max-w-[800px] bg-white rounded-2xl shadow-md p-4 sm:p-6 md:p-8">
            
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-xl sm:text-2xl font-bold text-marieth">Pagamento Digital</h1>
              <p className="text-sm sm:text-base text-gray-600">Escolha seu método de pagamento</p>
            </div>

            {/* Resumo da Compra */}
            <div className="bg-gray-100 rounded-lg p-4 sm:p-6 mb-6">
              <h3 className="text-base sm:text-lg font-semibold mb-3">Resumo da Compra</h3>
              <div className="flex justify-between mb-2">
                <span className="text-sm sm:text-base">Subtotal:</span>
                <span className="text-sm sm:text-base">kzs {valorSubtotal.toLocaleString()},00</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm sm:text-base">Frete:</span>
                <span className="text-sm sm:text-base">kzs {valorFrete.toLocaleString()},00</span>
              </div>
              <div className="flex justify-between mb-2 text-red-600">
                <span className="text-sm sm:text-base">Taxa {metodos[metodo].nome} ({(metodos[metodo].taxa * 100).toFixed(1)}%):</span>
                <span className="text-sm sm:text-base">-kzs {valorTaxa.toFixed(0)},00</span>
              </div>
              <div className="flex justify-between border-t pt-3 mt-3 text-marieth font-bold text-base sm:text-lg">
                <span>Total a Pagar:</span>
                <span>kzs {valorBruto.toLocaleString()},00</span>
              </div>
            </div>

            {/* Métodos de Pagamento */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-base sm:text-lg">Selecione o método:</h3>
              <div className="space-y-3">
                {Object.entries(metodos).map(([key, info]) => {
                  const metodoKey = key as MetodoPagamento
                  const isSelected = metodo === metodoKey
                  return (
                    <div
                      key={key}
                      onClick={() => setMetodo(metodoKey)}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                        isSelected 
                          ? 'border-marieth bg-green-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{info.icon}</span>
                          <div>
                            <div className="font-semibold text-sm sm:text-base">{info.nome}</div>
                            <div className="text-xs sm:text-sm text-gray-500">Taxa: {(info.taxa * 100).toFixed(1)}%</div>
                          </div>
                        </div>
                        {isSelected && (
                          <svg className="w-6 h-6 text-marieth" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Botão Gerar Referência */}
            <button
              onClick={gerarReferencia}
              className="w-full bg-marieth hover:bg-verdeaceso text-white py-2 sm:py-3 rounded-[5px] font-semibold transition flex items-center justify-center space-x-2"
            >
              <span className="text-sm sm:text-base">Gerar Referência de Pagamento</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Info */}
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-marieth">
                <strong>Como funciona:</strong> Você receberá uma referência única para pagar no seu app bancário. 
                É como pagar uma conta de luz - simples e seguro!
              </p>
            </div>
          </div>
        </div>

        
      </div>
      <Footer />
    </main>
  )
}



{/* // Componente React para demonstração
const TestarPagamento = () => {
  const [referencia, setReferencia] = useState('');
  const [resultado, setResultado] = useState(null);

  const simular = async () => {
    // Sua função de simulação aqui
    const res = await simularPagamento(referencia);
    setResultado(res);
  };


//     <div>
//       <input 
//         value={referencia} 
//         onChange={(e) => setReferencia(e.target.value)} */}
//        
 {/* // Componente React para demonstração
const TestarPagamento = () => {
  const [referencia, setReferencia] = useState('');
  const [resultado, setResultado] = useState(null);

  const simular = async () => {
    // Sua função de simulação aqui
    const res = await simularPagamento(referencia);
    setResultado(res);
  };


//     <div>
//       <input 
//         value={referencia} 
//         onChange={(e) => setReferencia(e.target.value)} */}
{/* //         placeholder="Cole a referência aqui"
//       />
//       <button onClick={simular}>🧪 Simular Pagamento</button>
      
//       {resultado && (
//         <div className="resultado">
//           ✅ Pagamento simulado! Valor recebido: {resultado.valor_recebido}
//         </div>
//       )}
//     </div>
//   );
// }; */}