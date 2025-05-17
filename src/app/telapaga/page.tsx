'use client'
import { useState, FormEvent } from 'react'
import Footer from '../Components/Footer'
import Navbar from '../Components/Navbar'
import { useRouter } from 'next/navigation'

type MetodoPagamento = 'unitel' | 'afrimoney' | 'multicaixa'

type MetodoInfo = {
  nome: string
  instrucoes: string[]
  label: string
  placeholder: string
}

const metodos: Record<MetodoPagamento, MetodoInfo> = {
  unitel: {
    nome: 'Unitel Money',
    instrucoes: [
      'Digite seu número Unitel Money registrado',
      'Você receberá uma notificação no seu telefone',
      'Confirme o pagamento no seu aplicativo',
    ],
    label: 'Número de Telefone',
    placeholder: 'Digite seu número',
  },
  afrimoney: {
    nome: 'Afrimoney',
    instrucoes: [
      'Insira seu número Afrimoney',
      'Aguarde o código de verificação via SMS',
      'Complete a transação no seu telefone',
    ],
    label: 'Número Afrimoney',
    placeholder: 'Digite seu número Afrimoney',
  },
  multicaixa: {
    nome: 'Multicaixa Express',
    instrucoes: [
      'Digite o número do seu cartão Multicaixa',
      'Confirme os detalhes da transação',
      'Autorize o pagamento no seu banco',
    ],
    label: 'Número do Cartão',
    placeholder: 'Digite o número do cartão',
  },
}

export default function PagamentoPage() {
  const [metodo, setMetodo] = useState<MetodoPagamento>('unitel')
  const router = useRouter()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    alert('Pagamento iniciado! Por favor, verifique seu telefone para confirmar a transação.')
    router.push('/confirmacao-pedido')
  }

  const metodoAtual = metodos[metodo]

  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow mb-20 mt-[40%] md:mt-[20%] lg:mt-[15%]">
        <div className="min-h-screen flex items-center justify-center bg-white p-2 sm:p-4">
          <div className="w-full max-w-[800px] bg-white rounded-2xl shadow-md p-4 sm:p-6 md:p-8">
            <div className="text-center mb-6">
              <h1 className="text-xl sm:text-2xl font-bold text-marieth">Pagamento Digital</h1>
              <p className="text-sm sm:text-base text-gray-600">Escolha seu método de pagamento</p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6">
              {Object.keys(metodos).map((key) => {
                const metodoKey = key as MetodoPagamento
                return (
                  <button
                    key={key}
                    className={`px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base rounded-full border-2 ${
                      metodo === metodoKey ? 'bg-marieth text-white border-marieth' : 'border-marieth text-marieth'
                    } transition`}
                    onClick={() => setMetodo(metodoKey)}
                  >
                    {metodos[metodoKey].nome}
                  </button>
                )
              })}
            </div>

            <div className="bg-gray-100 rounded-lg p-4 sm:p-6 mb-6">
              <h3 className="text-base sm:text-lg font-semibold mb-3">Resumo da Compra</h3>
              <div className="flex justify-between mb-2">
                <span className="text-sm sm:text-base">Subtotal:</span>
                <span className="text-sm sm:text-base">kzs 2.500,00</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm sm:text-base">Frete:</span>
                <span className="text-sm sm:text-base">kzs 50,00</span>
              </div>
              <div className="flex justify-between border-t pt-3 mt-3 text-marieth font-bold text-base sm:text-lg">
                <span>Total:</span>
                <span>kzs 2.550,00</span>
              </div>
            </div>

            <div className="flex flex-col text-center mb-4 sm:mb-6 justify-center items-center">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="green" strokeWidth="1.5" className="sm:w-20 sm:h-20">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18" />
                <path d="M9 21V9" />
              </svg>
              <h3 className="mt-2 text-base sm:text-lg font-medium">{metodoAtual.nome}</h3>
            </div>

            <div className="bg-green-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
              <h4 className="font-semibold mb-2 text-sm sm:text-base">Instruções de Pagamento:</h4>
              <ol className="list-decimal list-inside text-gray-700 text-xs sm:text-sm">
                {metodoAtual.instrucoes.map((item: string, index: number) => (
                  <li key={index} className="mb-1">{item}</li>
                ))}
              </ol>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block font-medium text-gray-700 mb-1 text-sm sm:text-base">{metodoAtual.label}</label>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{9}"
                  placeholder={metodoAtual.placeholder}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm sm:text-base"
                />
              </div>
              <button
                onClick={() => router.push('/pagamentoConfirmado')}
                type="submit"
                className="w-full bg-marieth hover:bg-verdeaceso text-white py-2 sm:py-3 rounded-[5px] font-semibold transition text-sm sm:text-base"
              >
                Confirmar Pagamento
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}