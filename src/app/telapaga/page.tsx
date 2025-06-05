'use client'
import { useState, FormEvent } from 'react'
import Footer from '../Components/Footer'
import Navbar from '../Components/Navbar'
import { useRouter } from 'next/navigation'

type MetodoPagamento = 'unitel_money' | 'afrimoney' | 'multicaixa'
type StatusPagamento = 'inicial' | 'referencia_gerada' | 'processando' | 'sucesso' | 'erro'

type MetodoInfo = {
  nome: string
  taxa: number
  instrucoes: string[]
  icon: React.ReactNode
  cor: string
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
    cor: '#FF4F00',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#FF4F00"/>
        <path d="M8 12h16v8H8z" fill="white"/>
        <path d="M10 14h12v1H10zM10 16h8v1H10zM10 18h6v1H10z" fill="#FF4F00"/>
        <circle cx="20" cy="17" r="2" fill="#FF4F00"/>
      </svg>
    )
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
    cor: '#A64AC9',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#A64AC9"/>
        <path d="M16 6L22 12H18V20H14V12H10L16 6Z" fill="white"/>
        <rect x="8" y="22" width="16" height="4" rx="2" fill="white"/>
      </svg>
    )
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
    cor: '#FFB347',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#FFB347"/>
        <rect x="6" y="10" width="20" height="12" rx="2" fill="white"/>
        <rect x="8" y="12" width="16" height="2" fill="#FFB347"/>
        <rect x="8" y="16" width="8" height="1" fill="#FFB347"/>
        <rect x="8" y="18" width="6" height="1" fill="#FFB347"/>
        <circle cx="20" cy="17" r="1.5" fill="#FFB347"/>
      </svg>
    )
  }
}

export default function PagamentoPage() {
  const [metodo, setMetodo] = useState<MetodoPagamento>('unitel_money')
  const [status, setStatus] = useState<StatusPagamento>('inicial')
  const [referenciaPagamento, setReferenciaPagamento] = useState('')
  const [referenciaInput, setReferenciaInput] = useState('')
  const [transacaoId, setTransacaoId] = useState('')
  const [copiado, setCopiado] = useState(false)
  const [mostrarModal, setMostrarModal] = useState(false)
  const [mensagemErro, setMensagemErro] = useState('')
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
    setStatus('referencia_gerada')
  }

  const copiarReferencia = async () => {
    await navigator.clipboard.writeText(referenciaPagamento)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  const abrirModalPagamento = () => {
    setMostrarModal(true)
    setReferenciaInput('')
    setMensagemErro('')
  }

  const processarPagamento = (e: FormEvent) => {
    e.preventDefault()
    setStatus('processando')
    setMensagemErro('')

    // Simular processamento
    setTimeout(() => {
      if (referenciaInput.trim() === referenciaPagamento) {
        setStatus('sucesso')
      } else {
        setStatus('erro')
        setMensagemErro('Referência inválida. Verifique e tente novamente.')
      }
    }, 2000)
  }

  const finalizarCompra = () => {
    setMostrarModal(false)
    router.push('/confirmacao-pedido')
  }

  const fecharModal = () => {
    setMostrarModal(false)
    setStatus('referencia_gerada')
    setReferenciaInput('')
    setMensagemErro('')
  }

  const reiniciar = () => {
    setStatus('inicial')
    setReferenciaPagamento('')
    setTransacaoId('')
    setReferenciaInput('')
    setMensagemErro('')
  }

  // MODAL DE PAGAMENTO
  const ModalPagamento = () => {
    if (!mostrarModal) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          
          {/* Header do Modal */}
          <div className="sticky top-0 bg-white border-b p-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-green-600">
                {status === 'processando' ? 'Processando...' : 
                 status === 'sucesso' ? 'Pagamento Confirmado!' : 
                 status === 'erro' ? 'Erro no Pagamento' : 'Inserir Referência'}
              </h2>
              <button
                onClick={fecharModal}
                className="text-gray-400 hover:text-gray-600 transition sr-only"
              >jh
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Status Icon - Só aparece APÓS tentar pagar */}
            {(status === 'processando' || status === 'sucesso' || status === 'erro') && (
              <div className="text-center mb-6">
                {status === 'processando' && (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
                      <svg className="w-8 h-8 text-yellow-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-600 text-sm">Verificando pagamento...</p>
                  </div>
                )}
                
                {status === 'sucesso' && (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-green-600 text-sm font-semibold">Pagamento realizado com sucesso!</p>
                  </div>
                )}

                {status === 'erro' && (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-3">
                      <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <p className="text-red-600 text-sm font-semibold">Falha no pagamento</p>
                  </div>
                )}
              </div>
            )}

            {/* Método Selecionado */}
            <div className="rounded-lg p-4 mb-6" style={{ backgroundColor: metodos[metodo].cor, color: 'white' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-3">
                    {metodos[metodo].icon}
                  </div>
                  <span className="font-semibold">{metodos[metodo].nome}</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{valorBruto.toLocaleString()} Kz</div>
                  <div className="text-sm opacity-90">Taxa: {valorTaxa.toFixed(0)} Kz</div>
                </div>
              </div>
            </div>

            {/* Formulário de Pagamento */}
            {(status === 'inicial' || status === 'referencia_gerada') && (
              <form onSubmit={processarPagamento} className="mb-6">
                <label className="block font-semibold text-green-600 mb-2">
                  Digite a referência de pagamento:
                </label>
                <input
                  type="text"
                  value={referenciaInput}
                  onChange={(e) => setReferenciaInput(e.target.value)}
                  placeholder="Ex: REF_1234567890"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none font-mono"
                  required
                />
                {mensagemErro && (
                  <p className="text-red-600 text-sm mt-2 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {mensagemErro}
                  </p>
                )}
              </form>
            )}

            {/* Instruções */}
            {(status === 'inicial' || status === 'referencia_gerada') && (
              <div className="mb-6">
                <h4 className="font-semibold mb-3 flex items-center text-green-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            )}

            {/* Ações */}
            <div className="space-y-3">
              {(status === 'inicial' || status === 'referencia_gerada') && (
                <button
                  type="submit"
                  onClick={processarPagamento}
                  disabled={!referenciaInput.trim()}
                  className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center space-x-2 ${
                    !referenciaInput.trim() 
                      ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>{!referenciaInput.trim() ? 'Digite a Referência' : 'Processar Pagamento'}</span>
                </button>
              )}
              
              {status === 'sucesso' && (
                <button
                  onClick={finalizarCompra}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Finalizar Compra</span>
                </button>
              )}

              {status === 'erro' && (
                <button
                  onClick={() => {setStatus('referencia_gerada'); setMensagemErro(''); setReferenciaInput('')}}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-lg font-semibold transition flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Tentar Novamente</span>
                </button>
              )}

              <button
                onClick={fecharModal}
                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg transition"
              >
                {status === 'sucesso' ? 'Fechar' : 'Cancelar'}
              </button>
            </div>

            {/* Info Transação */}
            {transacaoId && (
              <div className="mt-6 pt-4 border-t text-center">
                <p className="text-xs text-gray-500">
                  ID da Transação: <code className="bg-gray-100 px-1 rounded">{transacaoId}</code>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
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
              <h1 className="text-xl sm:text-2xl font-bold text-green-600">Pagamento Digital</h1>
              <p className="text-sm sm:text-base text-gray-600">Escolha seu método de pagamento</p>
            </div>

            {/* Resumo da Compra */}
            <div className="bg-gray-100 rounded-lg p-4 sm:p-6 mb-6">
              <h3 className="text-base sm:text-lg font-semibold mb-3 text-green-600">Resumo da Compra</h3>
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
              <div className="flex justify-between border-t pt-3 mt-3 text-green-600 font-bold text-base sm:text-lg">
                <span>Total a Pagar:</span>
                <span>kzs {valorBruto.toLocaleString()},00</span>
              </div>
            </div>

            {/* Métodos de Pagamento */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-base sm:text-lg text-green-600">Selecione o método:</h3>
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
                          ? 'border-green-600 bg-green-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="mr-3">
                            {info.icon}
                          </div>
                          <div>
                            <div className="font-semibold text-sm sm:text-base">{info.nome}</div>
                            <div className="text-xs sm:text-sm text-gray-500">Taxa: {(info.taxa * 100).toFixed(1)}%</div>
                          </div>
                        </div>
                        {isSelected && (
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            {status === 'inicial' && (
              <button
                onClick={gerarReferencia}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 sm:py-3 rounded-lg font-semibold transition flex items-center justify-center space-x-2 mb-4"
              >
                <span className="text-sm sm:text-base">Gerar Referência de Pagamento</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            {/* Referência Gerada */}
            {status === 'referencia_gerada' && (
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 sm:p-6 mb-6">
                <h3 className="font-semibold text-green-600 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Referência Gerada:
                </h3>
                <div className="flex items-center justify-between bg-white rounded p-3 border mb-4">
                  <code className="font-mono text-lg font-bold text-green-600">{referenciaPagamento}</code>
                  <button
                    onClick={copiarReferencia}
                    className="flex items-center space-x-1 text-green-600 hover:text-green-700 transition"
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
                
                <button
                  onClick={abrirModalPagamento}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 sm:py-3 rounded-lg font-semibold transition flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="text-sm sm:text-base">Pagar Agora</span>
                </button>
              </div>
            )}

            {/* Botão Reiniciar */}
            {status === 'referencia_gerada' && (
              <button
                onClick={reiniciar}
                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg transition flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-sm">Gerar Nova Referência</span>
              </button>
            )}

            {/* Info */}
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600">
                <strong>Como funciona:</strong> Gere uma referência única, copie-a e use no seu app bancário para pagar. 
                É simples e seguro!
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal de Pagamento */}
      <ModalPagamento />
      
      <Footer />
    </main>
  )
}