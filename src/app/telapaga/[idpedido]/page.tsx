'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import Footer from '../../Components/Footer'
import Navbar from '../../Components/Navbar'
import { buscarPedidoPagamento} from '@/app/Services/pedidos'
import { useState, useEffect, FormEvent } from 'react'
import {apiFinalizarCompra } from '../../Services/cart'
import {gerarReferenciaPagamento , simularPagamento } from '../../Services/pagamentos'
 
const parseNumeroSeguro = (valor: any): number => {
  if (typeof valor === 'number') return valor;
  if (typeof valor === 'string') {
    const numero = parseFloat(valor);
    return isNaN(numero) ? 0 : numero;
  }
  return 0;
};

// Função para normalizar os dados do pedido
const normalizarDadosPedido = (dadosBrutos: any): PedidoPagamentoData | null => {
  if (!dadosBrutos) return null;

  return {
    ...dadosBrutos,
    pedido: {
      ...dadosBrutos.pedido,
      valor_total: parseNumeroSeguro(dadosBrutos.pedido?.valor_total),
    },
    itens: dadosBrutos.itens?.map((item: any) => ({
      ...item,
      quantidade_comprada: parseNumeroSeguro(item.quantidade_comprada),
      preco: parseNumeroSeguro(item.preco),
      subtotal: parseNumeroSeguro(item.subtotal),
      peso_kg: parseNumeroSeguro(item.peso_kg),
      id_produto: parseNumeroSeguro(item.id_produto),
    })) || [],
    valores: {
      subtotal: parseNumeroSeguro(dadosBrutos.valores?.subtotal),
      frete: parseNumeroSeguro(dadosBrutos.valores?.frete),
      comissao: parseNumeroSeguro(dadosBrutos.valores?.comissao),
      total: parseNumeroSeguro(dadosBrutos.valores?.total),
      peso_total: parseNumeroSeguro(dadosBrutos.valores?.peso_total),
    }
  };
};

type MetodoPagamento = 'unitel_money' | 'afrimoney' | 'multicaixa'
type StatusPagamento = 'inicial' | 'referencia_gerada' | 'processando' | 'sucesso' | 'erro'| 'carregando'

type MetodoInfo = {
  nome: string
  taxa: number
  instrucoes: string[]
  icon: React.ReactNode
  cor: string
}


interface DadosPagamento {
  tipo_pagamento: string
  valor_total: number
  carrinho_id?: string
  id_vendedor?: string
}

export interface PedidoPagamentoData {
  pedido: {
    id_pedido: number;
    valor_total: number;
    estado: string;
    data_pedido: string;
    rua?: string;
    bairro?: string;
    municipio?: string;
    provincia?: string;
    numero?: string;
  };
  itens: Array<{
    id_produto: number;
    quantidade_comprada: number;
    preco: number;
    subtotal: number;
    nome_produto: string;
    peso_kg: number;
  }>;
  valores: {
    subtotal: number;
    frete: number;
    comissao:number;
    total: number;
    peso_total: number;
  };
}


interface ContaVirtual {
  id: number;
  transportadora_id: number;
  tipo_conta: string;
  numero_africell: string;
  numero_unitel: string;
  operadora: string;
  saldo_anterior: number;
  saldo_atual: number;
}

interface DadosSimulacao {
  metodo_pagamento: string;
  telefone_simulado: string;
  operadora_usada: string;
  tempo_processamento: string;
  codigo_confirmacao: string;
  hash_transacao: string;
}

interface DivisaoValores {
  valor_total: number;
  taxa_percentual: number;
  taxa_valor: number;
  valor_liquido_vendedor: number;
  taxa_total: number;
}

interface DadosTransacao {
  referencia: string;
  valor_original: number;
  valor_pago: number;
  valor_recebido: number;
  taxa_aplicada: number;
  transacao_id: string;
  status: string;
  processado_em: string;
  conta_virtual: ContaVirtual;
  simulacao: DadosSimulacao;
  divisao_valores: DivisaoValores | null;
  modo: string;
  timestamp: string;
  mensagem: string;
  proximos_passos: string[];
}



const metodos: Record<MetodoPagamento, MetodoInfo> = {
  unitel_money: {
    nome: 'Unitel Money',
    taxa: 0,
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

export default function PagamentoPage() {
  // Estados principais
  const [pedido, setPedido] = useState<PedidoPagamentoData | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [debugInfo, setDebugInfo] = useState('') // Para debug
  const [metodo, setMetodo] = useState<MetodoPagamento>('unitel_money')
  const [status, setStatus] = useState<StatusPagamento>('inicial')
  const [referenciaPagamento, setReferenciaPagamento] = useState('')
  const [referenciaInput, setReferenciaInput] = useState('')
  const [transacaoId, setTransacaoId] = useState('')
  const [copiado, setCopiado] = useState(false)
  const [mostrarModal, setMostrarModal] = useState(false)
  const [mensagemErro, setMensagemErro] = useState('')
  const [isCarregando, setIsCarregando] = useState(false)
 const [dadosTransacao, setDadosTransacao] = useState<DadosTransacao | null>(null)
  const [mensagemSucesso, setMensagemSucesso] = useState<string>('')


  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const extrairIdPedido = (pathname: string, searchParams: URLSearchParams): string | null => {
    const idParam = searchParams.get('id_pedido')
    if (idParam) return idParam

    const pathParts = pathname.split('/')
    const idPart = pathParts[pathParts.length - 1]
    return /^\d+$/.test(idPart) ? idPart : null
  }

  useEffect(() => {
    const carregarPedido = async () => {
      const idPedido = extrairIdPedido(pathname, searchParams);
      
      console.log('=== DEBUG INFORMAÇÕES ===')
      console.log('pathname:', pathname)
      console.log('searchParams:', searchParams.toString())
      console.log('idPedido extraído:', idPedido)
      
      if (!idPedido) {
        setErro('ID do pedido não encontrado na URL');
        setDebugInfo(`URL: ${pathname}, Query: ${searchParams.toString()}`)
        setCarregando(false);
        return;
      }

      try {
        
        const dadosBrutos = await buscarPedidoPagamento(Number(idPedido));
console.log('Dados brutos recebidos da API:', dadosBrutos)

// Normalizar os dados
          const dados = normalizarDadosPedido(dadosBrutos);
          console.log('Dados normalizados:', dados)

          setPedido(dados);
        // Debug mais detalhado
        setDebugInfo(`
          ID: ${idPedido}
          Dados recebidos: ${JSON.stringify(dados, null, 2)}
          Tipo de dados: ${typeof dados}
          É objeto: ${typeof dados === 'object'}
          Tem pedido: ${dados?.pedido ? 'Sim' : 'Não'}
          Tem itens: ${dados?.itens ? 'Sim' : 'Não'}
          Tem valores: ${dados?.valores ? 'Sim' : 'Não'}
        `)
        
        
      } catch (error: any) {
        console.error('Erro ao buscar pedido:', error)
        setErro(error.mensagem || error.message || 'Erro ao carregar pedido');
        setDebugInfo(`Erro: ${JSON.stringify(error, null, 2)}`)
      } finally {
        setCarregando(false);
      }
    };

    carregarPedido();
  }, [pathname, searchParams]);


const isPedidoValid = (pedido: PedidoPagamentoData | null): pedido is PedidoPagamentoData => {
  console.log('=== VALIDAÇÃO DO PEDIDO ===')
  console.log('pedido existe:', !!pedido)
  
  if (!pedido) {
    console.log('❌ Pedido é null/undefined')
    return false
  }
  
  console.log('pedido.pedido existe:', !!pedido.pedido)
  console.log('pedido.pedido.id_pedido:', pedido.pedido?.id_pedido)
  console.log('pedido.itens existe:', !!pedido.itens)
  console.log('pedido.itens é array:', Array.isArray(pedido.itens))
  console.log('pedido.valores existe:', !!pedido.valores)
  console.log('pedido.valores.total:', pedido.valores?.total)
  console.log('pedido.valores.total é número:', typeof pedido.valores?.total === 'number')
  console.log('pedido.valores.total > 0:', pedido.valores?.total > 0)
  
  const isValid = !!(
    pedido && 
    pedido.pedido?.id_pedido && 
    pedido.itens && 
    Array.isArray(pedido.itens) && 
    pedido.valores &&
    typeof pedido.valores.total === 'number' &&
    pedido.valores.total > 0
  );
  
  console.log('✅ Pedido válido:', isValid)
  return isValid
};

const formatarNumero = (valor: any): string => {
  const numero = parseNumeroSeguro(valor);
  return numero.toString();
};

const formatarValor = (valor: any): string => {
  const numero = parseNumeroSeguro(valor);
  return numero.toLocaleString('pt-AO') + ' Kz';
};

const gerarReferencia = async () => {
  if (!isPedidoValid(pedido)) {
    console.error('Pedido inválido para gerar referência')
    setErro('Dados do pedido inválidos')
    return
  }

  try {
    setIsCarregando(true)
    
    const dadosPagamento = {
      tipo_pagamento: metodo,
      valor_total: pedido.valores.total, // ✅ VALOR CORRETO
      carrinho_id: pedido.pedido.id_pedido.toString(),
     
    }

    const resposta = await gerarReferenciaPagamento(dadosPagamento)
    
    if (resposta.sucesso) {
      setReferenciaPagamento(resposta.referencia.codigo)
      setStatus('referencia_gerada')
    } else {
      setErro('Erro ao gerar referência de pagamento')
      setStatus('inicial')
    }
  } catch (error: any) {
    console.error('Erro:', error)
    setErro(error.erro || 'Erro ao gerar referência')
    setStatus('inicial')
  } finally {
    setIsCarregando(false)
  }
}

  const copiarReferencia = async () => {
    try {
      await navigator.clipboard.writeText(referenciaPagamento)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch (error) {
      console.error('Erro ao copiar referência:', error)
    }
  }

  const abrirModalPagamento = () => {
    setMostrarModal(true)
    setReferenciaInput('')
    setMensagemErro('')
  }



const processarPagamento = async (e: any) => {
    e.preventDefault()
    
    if (!referenciaInput.trim()) {
      setMensagemErro('Por favor, digite a referência de pagamento')
      return
    }

    setMensagemErro('')
    setStatus('processando')

    try {
      console.log(`🧪 Iniciando simulação de pagamento com referência: ${referenciaInput}`)
      
      const resultado = await simularPagamento(referenciaInput.trim())
      console.log('✅ Resposta completa da simulação:', resultado)

      if (resultado.sucesso) {
        // ✅ DADOS TIPADOS CORRETAMENTE
        const dadosCompletos: DadosTransacao = {
          // Dados básicos da transação
          referencia: resultado.pagamento.referencia,
          valor_original: resultado.pagamento.valor_original,
          valor_pago: resultado.pagamento.valor_pago,
          valor_recebido: resultado.pagamento.valor_recebido,
          taxa_aplicada: resultado.pagamento.taxa_aplicada,
          transacao_id: resultado.pagamento.transacao_id,
          status: resultado.pagamento.status,
          processado_em: resultado.pagamento.processado_em,
          
          // Dados da conta virtual
          conta_virtual: {
            id: resultado.pagamento.conta_virtual.id,
            transportadora_id: resultado.pagamento.conta_virtual.transportadora_id,
            tipo_conta: resultado.pagamento.conta_virtual.tipo_conta,
            numero_africell: resultado.pagamento.conta_virtual.numero_africell,
            numero_unitel: resultado.pagamento.conta_virtual.numero_unitel,
            operadora: resultado.pagamento.conta_virtual.operadora,
            saldo_anterior: resultado.pagamento.conta_virtual.saldo_anterior,
            saldo_atual: resultado.pagamento.conta_virtual.saldo_atual
          },
          
          // Dados da simulação
          simulacao: {
            metodo_pagamento: resultado.pagamento.dados_simulacao.metodo_pagamento,
            telefone_simulado: resultado.pagamento.dados_simulacao.telefone_simulado,
            operadora_usada: resultado.pagamento.dados_simulacao.operadora_usada,
            tempo_processamento: resultado.pagamento.dados_simulacao.tempo_processamento,
            codigo_confirmacao: resultado.pagamento.dados_simulacao.codigo_confirmacao,
            hash_transacao: resultado.pagamento.dados_simulacao.hash_transacao
          },
          
          // Divisão de valores
          divisao_valores: resultado.pagamento.divisao_valores,
          
          // Informações gerais
          modo: resultado.MODO,
          timestamp: resultado.timestamp,
          mensagem: resultado.mensagem,
          proximos_passos: resultado.proximos_passos
        }
        
        // ✅ AGORA PODE ATRIBUIR SEM ERRO
        setDadosTransacao(dadosCompletos)
        setTransacaoId(dadosCompletos.referencia)
        
        setStatus('sucesso')
        
        console.log('💰 Dados completos da simulação processados:', dadosCompletos)
        
        // Mensagem de sucesso
        const mensagemSucesso = `Pagamento simulado com sucesso! ` +
          `Valor de ${dadosCompletos.valor_recebido} AOA creditado na conta ${dadosCompletos.conta_virtual.numero_unitel}. ` +
          `Código de confirmação: ${dadosCompletos.simulacao.codigo_confirmacao}`
        
        setMensagemSucesso(mensagemSucesso)
        
      } else {
        setStatus('erro')
        setMensagemErro('Falha na simulação do pagamento')
        console.error('❌ Simulação não indicou sucesso:', resultado)
      }

    } catch (error: any) {
      console.error('❌ Erro ao processar pagamento:', error)
      setStatus('erro')
      
      // Tratamento de erros
      if (error.codigo === 'REF_NAO_ENCONTRADA') {
        setMensagemErro('Referência não encontrada ou já foi utilizada')
      } else if (error.codigo === 'REF_EXPIRADA') {
        setMensagemErro('Referência expirada. Gere uma nova referência para continuar')
      } else if (error.codigo === 'REF_OBRIGATORIA') {
        setMensagemErro('Referência é obrigatória')
      } else if (error.codigo === 'ERRO_SIMULACAO') {
        setMensagemErro('Erro interno na simulação. Tente novamente em alguns instantes')
      } else if (error.erro) {
        setMensagemErro(error.erro)
      } else if (error.message) {
        setMensagemErro(`Erro: ${error.message}`)
      } else {
        setMensagemErro('Erro ao processar pagamento. Tente novamente')
      }
    }
  
  }





const handlefinalizarCompra = async () => {
  try {
     setStatus('processando')
    
    console.log('🎉 Finalizando compra...')
    
    // Verificar se temos os dados necessários
    if (!pedido?.pedido?.id_pedido) {
      throw { message: 'ID do pedido não encontrado' }
    }
    
    // ✅ CORREÇÃO AQUI
    const dadosFinalizacao = {
      id_pedido: pedido.pedido.id_pedido,
      pagamento_confirmado: true, 
      referencia_pagamento: transacaoId || referenciaInput 
    }
    
    console.log('📦 Dados para finalização:', dadosFinalizacao)
    
    
    const resultado = await apiFinalizarCompra(dadosFinalizacao)
    
    console.log('✅ Compra finalizada com sucesso:', resultado)
    
    // Limpar estados e fechar modal
    setMostrarModal(false)
    setStatus('inicial')
    setReferenciaPagamento('')
    setTransacaoId('')
    setReferenciaInput('')
    setMensagemErro('')
    setPedido(null)
    

    setTimeout(()=>{
      router.push('/FinalizarCompra')
    }, 3000)
    // Redirecionar para página de finalização/sucesso
    
    
    
  } catch (error:any) {
    console.error('❌ Erro ao finalizar compra:', error)
    setStatus('erro')
    
    // Tratar diferentes tipos de erro da API
    if (error.message) {
      setMensagemErro(error.message)
    } else if (error.mensagem) {
      setMensagemErro(error.mensagem)
    } else if (error.erro) {
      setMensagemErro(error.erro)
    } else {
      setMensagemErro('Erro ao finalizar compra. Tente novamente')
    }
  }
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
  setErro('') // Adicionar esta linha
  setIsCarregando(false) // Adicionar esta linha
}
  // Estados de loading e erro
  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-marieth mx-auto mb-4"></div>
          <p>Carregando dados do pedido...</p>
        </div>
      </div>
    )
  }


  

  if (erro) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600 max-w-2xl mx-auto p-4">
          <p className="text-xl mb-4">⚠️ {erro}</p>
          
          {/* Informações de debug */}
          <div className="bg-gray-100 p-4 rounded-lg text-left text-sm mb-4">
            <h3 className="font-bold mb-2">Debug Info:</h3>
            <pre className="whitespace-pre-wrap text-xs">{debugInfo}</pre>
          </div>
          
          <div className="space-x-4">
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Tentar Novamente
            </button>
            <button 
              onClick={() => router.push('/pedidos')} 
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Voltar aos Pedidos
            </button>
          </div>
        </div>
      </div>
    )
  }


  // Verificação melhorada com informações de debug
  if (!isPedidoValid(pedido)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto p-4">
          <p className="text-xl mb-4">Pedido não encontrado ou inválido</p>
          
          {/* Mostrar dados recebidos para debug */}
          <div className="bg-gray-100 p-4 rounded-lg text-left text-sm mb-4">
            <h3 className="font-bold mb-2">Dados recebidos:</h3>
            <pre className="whitespace-pre-wrap text-xs">
              {pedido ? JSON.stringify(pedido, null, 2) : 'null'}
            </pre>
          </div>
          
          <div className="bg-yellow-100 p-4 rounded-lg text-left text-sm mb-4">
            <h3 className="font-bold mb-2">Debug Info:</h3>
            <pre className="whitespace-pre-wrap text-xs">{debugInfo}</pre>
          </div>
          
          <button 
            onClick={() => router.push('/')} 
            className="bg-marieth text-white px-4 py-2 rounded hover:bg-marieth"
          >
            Voltar ao inicio
          </button>
        </div>
      </div>
    )
  }

  // MODAL DE PAGAMENTO
  const ModalPagamento = () => {
    if (!mostrarModal || !isPedidoValid(pedido)) return null

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
              <button onClick={fecharModal} className="text-gray-400 hover:text-gray-600 sr-only">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                oi
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
                    {mensagemErro && (
                  <p className="text-red-600 text-sm mt-2">Falha no pagamento:{mensagemErro}</p>
                )}
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
                  <div className="text-lg font-bold">{pedido.valores.total.toLocaleString()} Kz</div>
                </div>
              </div>
            </div>

            {/* Formulário */}
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
                  onClick={handlefinalizarCompra}
                  className="w-full bg-marieth hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
                >
                  Finalizar Compra
                </button>
              )}

              {mensagemErro && (
                  <p className="text-red-600 text-sm mt-2">{mensagemErro}</p>
                )}
              {status === 'erro' && (
                
                <button
                  onClick={() => {setStatus('referencia_gerada'); setMensagemErro(''); setReferenciaInput('')}}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-lg font-semibold transition"
                >
                  
                  Tentar Novamente
                </button>
              )}
             

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
              <p className="text-sm sm:text-base text-gray-600">Pedido #{pedido.pedido.id_pedido}</p>
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
                <h4 className="font-medium text-gray-700 mb-2">
                  Itens ({pedido.itens.length}):
                </h4>
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
                  <span>{pedido.valores.subtotal.toLocaleString()} Kz</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Frete ({pedido.valores.peso_total || 0}kg):</span>
                  <span>{pedido.valores.frete.toLocaleString()} Kz</span>
                </div>
                {pedido.valores.comissao > 0 && (
                  <div className="flex justify-between text-sm text-orange-600">
                    <span>Comissão:</span>
                    <span>{pedido.valores.comissao.toLocaleString()} Kz</span>
                  </div>
                )}
                <div className="flex justify-between border-t pt-2 font-bold text-green-600 text-lg">
                  <span>Total a Pagar:</span>
                  <span>{pedido.valores.total.toLocaleString()} Kz</span>
                </div>
              </div>
            </div>

            {/* Endereço de entrega */}
            <div className="bg-green-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-marieth mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Endereço de Entrega
              </h3>
              <p className="text-sm text-gray-700">
                {[pedido.pedido.rua, pedido.pedido.bairro, pedido.pedido.municipio, pedido.pedido.provincia].filter(Boolean).join(', ') || 'Endereço não especificado'}
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

                {erro && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{erro}</p>
              </div>
            )}



            {/* Botão Gerar Referência */}
           {status === 'inicial' && (
          <button
            onClick={gerarReferencia}
            disabled={isCarregando}
            className={`w-full ${isCarregando ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white py-2 sm:py-3 rounded-lg font-semibold transition flex items-center justify-center space-x-2 mb-4`}
          >
            {isCarregando ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span className="text-sm sm:text-base">Gerando...</span>
              </>
            ) : (
              <>
                <span className="text-sm sm:text-base">Gerar Referência de Pagamento</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}
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