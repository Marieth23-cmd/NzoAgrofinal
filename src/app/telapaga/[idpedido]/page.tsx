'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import Footer from '../../Components/Footer'
import Navbar from '../../Components/Navbar'
import { useState, useEffect, FormEvent } from 'react'

type MetodoPagamento = 'unitel_money' | 'afrimoney' | 'multicaixa'
type StatusPagamento = 'inicial' | 'referencia_gerada' | 'processando' | 'sucesso' | 'erro'

type MetodoInfo = {
  nome: string
  taxa: number
  instrucoes: string[]
  icon: React.ReactNode
  cor: string
}

export interface PedidoPagamentoData {
  id_pedido: number
  valor_total: number
  estado: string
  data_pedido: string
  rua?: string
  bairro?: string
  pais?: string
  municipio?: string
  referencia?: string
  provincia?: string
  numero?: string
  itens: Array<{
    id_produto: number
    quantidade_comprada: number
    preco: number
    subtotal: number
    nome_produto: string
    peso_kg: number
  }>
  resumo: {
    subtotal: number
    frete: number
    comissao: number
    total: number
    peso_total: number
    quantidade_itens: number
  }
}

const metodos: Record<MetodoPagamento, MetodoInfo> = {
  unitel_money: {
    nome: 'Unitel Money',
    taxa: 0, // Taxa zerada conforme solicitado
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
    taxa: 0,
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
    taxa: 0,
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

// Função simulada - substitua pela sua função real
const buscarPedidoPagamento = async (id_pedido: number): Promise<PedidoPagamentoData> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Dados simulados - substitua pela sua implementação real
  return {
    id_pedido,
    valor_total: 2550,
    estado: 'pendente',
    data_pedido: new Date().toISOString(),
    rua: 'Rua das Flores, 123',
    bairro: 'Maianga',
    municipio: 'Luanda',
    provincia: 'Luanda',
    pais: 'Angola',
    itens: [
      {
        id_produto: 1,
        quantidade_comprada: 2,
        preco: 1250,
        subtotal: 2500,
        nome_produto: 'Produto Exemplo',
        peso_kg: 1.5
      }
    ],
    resumo: {
      subtotal: 2500,
      frete: 150,
      comissao: 100,
      total: 2550,
      peso_total: 3.0,
      quantidade_itens: 2
    }
  }
}

export default function PagamentoPage() {
  const [pedido, setPedido] = useState<PedidoPagamentoData | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [metodo, setMetodo] = useState<MetodoPagamento>('unitel_money')
  const [status, setStatus] = useState<StatusPagamento>('inicial')
  const [referenciaPagamento, setReferenciaPagamento] = useState('')
  const [referenciaInput, setReferenciaInput] = useState('')
  const [transacaoId, setTransacaoId] = useState('')
  const [copiado, setCopiado] = useState(false)
  const [mostrarModal, setMostrarModal] = useState(false)
  const [mensagemErro, setMensagemErro] = useState('')
  
  const router = useRouter()
  const searchParams = useSearchParams()

  // Buscar dados do pedido ao montar o componente
  useEffect(() => {
    const carregarPedido = async () => {
      try {
        const id_pedido = searchParams.get('id_pedido')
        if (!id_pedido) {
          setErro('ID do pedido não fornecido')
          return
        }

        const dadosPedido = await buscarPedidoPagamento(Number(id_pedido))
        setPedido(dadosPedido)
      } catch (error: any) {
        setErro(error.mensagem || 'Erro ao carregar dados do pedido')
      } finally {
        setCarregando(false)
      }
    }

    carregarPedido()
  }, [searchParams])

  const gerarReferencia = () => {
    if (!pedido) return
    
    const novaReferencia = `REF_${pedido.id_pedido}_${Date.now()}`
    const novoTransacaoId = `TXN_${Math.random().toString(36).substr(2, 8).toUpperCase()}`
    
    setReferenciaPagamento(novaReferencia)
    setTransacaoId(novoTransacaoId)
    setStatus('referencia_gerada')
  }

  //copiar referencia
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

  // Loading state
  if (carregando) {
    return (
      <main className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dados do pedido...</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  // Error state
  if (erro || !pedido) {
    return (
      <main className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center text-red-600">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-bold mb-2">Erro ao carregar pedido</h2>
            <p>{erro}</p>
            <button 
              onClick={() => router.back()} 
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Voltar
            </button>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  // MODAL DE PAGAMENTO (mantido igual)
  const ModalPagamento = () => {
    if (!mostrarModal) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b p-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-green-600">
                {status === 'processando' ? 'Processando...' : 
                 status === 'sucesso' ? 'Pagamento Confirmado!' : 
                 status === 'erro' ? 'Erro no Pagamento' : 'Inserir Referência'}
              </h2>
              <button onClick={fecharModal} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6 sr-only" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                fecharModal
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Status Icons */}
            {(status === 'processando' || status === 'sucesso' || status === 'erro') && (
              <div className="text-center mb-6">
                {status === 'processando' && (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
                      <div className="w-8 h-8 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
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
                  <div className="mr-3">{metodos[metodo].icon}</div>
                  <span className="font-semibold">{metodos[metodo].nome}</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{pedido.resumo.total.toLocaleString()} Kz</div>
                </div>
              </div>
            </div>

            {/* Formulário e botões (mantidos iguais) */}
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
                  <p className="text-red-600 text-sm mt-2">{mensagemErro}</p>
                )}
              </form>
            )}

            {/* Instruções */}
            {(status === 'inicial' || status === 'referencia_gerada') && (
              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-green-600">Como pagar:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                  {metodos[metodo].instrucoes.map((instrucao, index) => (
                    <li key={index}>{instrucao}</li>
                  ))}
                </ol>
              </div>
            )}

            {/* Botões de ação */}
            <div className="space-y-3">
              {(status === 'inicial' || status === 'referencia_gerada') && (
                <button
                  type="submit"
                  onClick={processarPagamento}
                  disabled={!referenciaInput.trim()}
                  className={`w-full py-3 rounded-lg font-semibold transition ${
                    !referenciaInput.trim() 
                      ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {!referenciaInput.trim() ? 'Digite a Referência' : 'Processar Pagamento'}
                </button>
              )}
              
              {status === 'sucesso' && (
                <button
                  onClick={finalizarCompra}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
                >
                  Finalizar Compra
                </button>
              )}

              {status === 'erro' && (
                <button
                  onClick={() => {setStatus('referencia_gerada'); setMensagemErro(''); setReferenciaInput('')}}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-lg font-semibold transition"
                >
                  Tentar Novamente
                </button>
              )}

              <button
                onClick={fecharModal}
                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg transition"
              >
                {status === 'sucesso' ? 'Fechar' : 'Cancelar'}
              </button>
            </div>

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

  // TELA PRINCIPAL
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow mb-20 mt-[40%] md:mt-[30%] lg:mt-[15%]">
        <div className="min-h-screen flex items-center justify-center bg-white p-2 sm:p-4">
          <div className="w-full max-w-[800px] bg-white rounded-2xl shadow-md p-4 sm:p-6 md:p-8">
            
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-xl sm:text-2xl font-bold text-green-600">Pagamento Digital</h1>
              <p className="text-sm sm:text-base text-gray-600">Pedido #{pedido.id_pedido}</p>
            </div>

            {/* Resumo do Pedido */}
            <div className="bg-gray-100 rounded-lg p-4 sm:p-6 mb-6">
              <h3 className="text-base sm:text-lg font-semibold mb-4 text-green-600 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Resumo do Pedido
              </h3>
              
              {/* Itens do pedido */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">Itens ({pedido.resumo.quantidade_itens}):</h4>
                {pedido.itens.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                    <div>
                      <p className="font-medium text-sm">{item.nome_produto}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantidade_comprada} × {item.preco.toLocaleString()} Kz</p>
                    </div>
                    <span className="font-medium text-sm">{item.subtotal.toLocaleString()} Kz</span>
                  </div>
                ))}
              </div>

              {/* Cálculos */}
              <div className="space-y-2 border-t pt-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>{pedido.resumo.subtotal.toLocaleString()} Kz</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Frete ({pedido.resumo.peso_total}kg):</span>
                  <span>{pedido.resumo.frete.toLocaleString()} Kz</span>
                </div>
                {pedido.resumo.comissao > 0 && (
                  <div className="flex justify-between text-sm text-orange-600">
                    <span>Comissão:</span>
                    <span>{pedido.resumo.comissao.toLocaleString()} Kz</span>
                  </div>
                )}
                <div className="flex justify-between border-t pt-2 font-bold text-green-600 text-lg">
                  <span>Total a Pagar:</span>
                  <span>{pedido.resumo.total.toLocaleString()} Kz</span>
                </div>
              </div>
            </div>

            {/* Endereço de entrega */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-700 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Endereço de Entrega
              </h3>
              <p className="text-sm text-gray-700">
                {[pedido.rua, pedido.bairro, pedido.municipio, pedido.provincia].filter(Boolean).join(', ')}
              </p>
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
                        isSelected ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="mr-3">{info.icon}</div>
                          <div>
                            <div className="font-semibold text-sm sm:text-base">{info.nome}</div>
                            <div className="text-xs sm:text-sm text-gray-500">Sem taxa adicional</div>
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