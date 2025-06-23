"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Head from "next/head"
import { FaTrash } from "react-icons/fa6"
import Footer from "../Components/Footer"
import Navbar from "../Components/Navbar"
import Image from "next/image"
import { 
  listarProdutosDoCarrinho, 
  atualizarQuantidadeProduto, 
  removerProdutoDoCarrinho, 
  calcularPrecoProduto, 
  esvaziarCarrinho,
  iniciarCheckout
} from "../Services/cart";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Tipos para os itens vindos da API de cálculo
interface ItemCalculado {
  id_produtos: number;
  nome: string;
  quantidade_desejada: number;
  quantidade_cadastrada: number;
  preco_cadastrado: number;
  peso_cadastrado: number;
  proporcao: number;
  preco_final: number;
  peso_final: number;
  subtotal_produto: number;
  foto_produto?: string;
  Unidade?: string;
}

interface CalculoCarrinho {
  itens: ItemCalculado[];
  resumo: {
    subtotalProdutos: number;
    pesoTotal: number;
    frete: number;
    comissao: number;
    totalFinal: number;
  };
}

export default function Carrinho() {
  // Estados principais
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  
  // Estados do modal
  const [showcaixa, setshowcaixa] = useState<boolean>(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<any | null>(null);
  const [quantidade, setQuantidade] = useState<number>(1);
  const [quantidadeDisponivel, setQuantidadeDisponivel] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  // Estados de loading
  const [loadingFinalizarCompra, setLoadingFinalizarCompra] = useState<boolean>(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  // Estados dos totais vindos da API
  const [calculoCarrinho, setCalculoCarrinho] = useState<CalculoCarrinho | null>(null);
  const [isCheckoutIniciado, setIsCheckoutIniciado] = useState(false);
  const [resumoCheckout, setResumoCheckout] = useState(null);

  // Função para carregar produtos do carrinho
  const carregarProdutos = async () => {
    try {
      setLoading(true);
      const dados = await listarProdutosDoCarrinho();
      if (dados && dados.produtos && Array.isArray(dados.produtos)) {
        setProdutos(dados.produtos);
        if (dados.produtos.length > 0) {
          await calcularTotaisCarrinho();
        } else {
          setCalculoCarrinho(null);
        }
      } else {
        setProdutos([]);
        setCalculoCarrinho(null);
      }
    } catch (error) {
      setProdutos([]);
      setCalculoCarrinho(null);
    } finally {
      setLoading(false);
    }
  };

  // Função para calcular totais usando a rota /calcular-preco
  const calcularTotaisCarrinho = async () => {
    try {
      const resultado = await calcularPrecoProduto("", 0);
      if (resultado) {
        setCalculoCarrinho(resultado);
      } else {
        setCalculoCarrinho(null);
      }
    } catch (error) {
      setCalculoCarrinho(null);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  // Esvaziar carrinho
  const handleEsvaziarCarrinho = async () => {
    try {
      const resposta = await esvaziarCarrinho();
      toast.success(resposta.message || "Carrinho esvaziado com sucesso!");
      setProdutos([]);
      setCalculoCarrinho(null);
    } catch (error: any) {
      toast.error(error.message || "Erro ao esvaziar o carrinho.");
    }
  };

  // Editar quantidade
  const handleEditar = (produto: any) => {
    setProdutoSelecionado(produto);
    setQuantidade(produto.quantidade_desejada || 1);
    setQuantidadeDisponivel(produto.quantidade_cadastrada || 0);
    setshowcaixa(true);
    setErrorMessage('');
  };

  // Incremento rápido
  const handleIncrementoRapido = (incremento: number) => {
    if (produtoSelecionado) {
      const novaQuantidade = quantidade + incremento;
      if (novaQuantidade <= 0) {
        setErrorMessage("A quantidade deve ser maior que zero");
        return;
      }
      if (novaQuantidade > quantidadeDisponivel) {
        setErrorMessage(`Quantidade máxima disponível: ${quantidadeDisponivel} ${produtoSelecionado?.Unidade || "unidades"}.`);
        return;
      }
      setQuantidade(novaQuantidade);
      setErrorMessage('');
    }
  };

  // Alteração manual da quantidade
  const handleQuantidadeChange = (novaQuantidade: number) => {
    if (!produtoSelecionado) return;
    if (isNaN(novaQuantidade) || novaQuantidade <= 0) {
      setErrorMessage("A quantidade deve ser um número maior que zero");
      return;
    }
    if (novaQuantidade > quantidadeDisponivel) {
      setErrorMessage(`Quantidade máxima disponível: ${quantidadeDisponivel} ${produtoSelecionado?.Unidade || "unidades"}.`);
      return;
    }
    setQuantidade(novaQuantidade);
    setErrorMessage('');
  };

  // Confirma alteração de quantidade
  const handleConfirmar = async () => {
    if (!produtoSelecionado) return;
    try {
      if (quantidade <= 0) {
        setErrorMessage("A quantidade deve ser maior que zero");
        return;
      }
      if (quantidade > quantidadeDisponivel) {
        setErrorMessage(`Quantidade máxima disponível: ${quantidadeDisponivel} ${produtoSelecionado?.Unidade || "unidades"}.`);
        return;
      }
      // Atualizar a quantidade do produto no carrinho
      const resposta = await atualizarQuantidadeProduto(
        String(produtoSelecionado.id_produtos || produtoSelecionado.id), 
        quantidade
      );
      toast.success("Quantidade atualizada com sucesso!");
      await carregarProdutos();
      setshowcaixa(false);
      setErrorMessage('');
    } catch (error: any) {
      setErrorMessage(error.mensagem || "Erro ao atualizar quantidade do produto.");
    }
  };

  // Remover produto do carrinho
  const handleRemover = async (produtoId: number) => {
    try {
      const confirmacao = window.confirm("Tem certeza que deseja remover este produto do carrinho?");
      if (confirmacao) {
        const resposta = await removerProdutoDoCarrinho(String(produtoId));
        toast.success(resposta.mensagem || "Produto removido com sucesso!");
        await carregarProdutos();
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao remover produto do carrinho.");
    }
  };

  // Iniciar checkout
  const handleIniciarCheckout = async () => {
    if (!calculoCarrinho || (calculoCarrinho.resumo && calculoCarrinho.resumo.pesoTotal < 10)) {
      alert("O peso total mínimo para efetivar a compra é de 10kg. Adicione mais produtos.");
      return;
    }
    try {
      setLoadingCheckout(true);
      const resposta = await iniciarCheckout();
      setResumoCheckout(resposta);
      setIsCheckoutIniciado(true);
      toast.success("Checkout iniciado. Confirme seus dados para prosseguir com o pagamento.");
      router.push("/enderecopedido");
    } catch (error: any) {
      toast.error(error.mensagem || "Erro ao iniciar o checkout.");
    } finally {
      setLoadingCheckout(false);
    }
  };

  return (
    <>
      <Head>
        <title>Carrinho</title>
      </Head>

      <Navbar />
      <ToastContainer position="top-right" autoClose={5000} />

      <div className="mb-20 mt-[48%] lg:mt-[15%]">
        <div className="max-w-[1200px] my-8 mx-auto py-0 px-4 items-center gap-4 grid grid-cols-1 relative border-b-[1px]">
          <div className="flex items-end">
            <h1 className="text-[1.5rem] lg:text-[2rem] text-marieth mb-8 p-4 font-bold">
              Meu Carrinho
            </h1>
            {calculoCarrinho && calculoCarrinho.itens.length > 0 && (
              <button 
                className="bg-vermelho text-white rounded-[5px] h-fit px-2 py-1 mb-12 ml-auto flex items-center gap-2 cursor-pointer"
                onClick={handleEsvaziarCarrinho}
              >
                <FaTrash />
                Esvaziar
              </button>
            )}
          </div>

          {loading ? (
            <p className="text-center text-gray-500 text-lg">Carregando produtos...</p>
          ) : !calculoCarrinho || calculoCarrinho.itens.length === 0 ? (
            <p className="text-center text-gray-500 text-lg mt-8">Carrinho vazio. Nenhum produto adicionado.</p>
          ) : (
            calculoCarrinho.itens.map((item) => (
              <div key={item.id_produtos} className="flex p-1 border-b-[1px]">
                <div className="h-24 w-24 min-w-24 flex items-center justify-center">
                  <Image
                    src={item.foto_produto || '/logo.jpg'}
                    alt={item.nome || 'Produto'}
                    height={96}
                    width={96}
                    className="object-cover rounded-[5px] max-h-24"
                  />
                </div>
                <div className="flex-1 py-0 px-4 relative">
                  <h3 className="font-bold mb-2">{item.nome}</h3>
                  <p className="font-bold text-marieth">
                    Kzs {parseFloat(item.preco_cadastrado.toString()).toFixed(2)}/{item.quantidade_cadastrada}{item.Unidade || "unidade"}
                  </p>
                  <p>Quantidade desejada: <span className="font-semibold">{item.quantidade_desejada} {item.Unidade || "unidades"}</span></p>
                  <p>Estoque disponível: <span className="font-semibold">{item.quantidade_cadastrada} {item.Unidade || "unidades"}</span></p>
                  <p>Subtotal proporcional: <span className="font-bold">Kzs {Number(item.subtotal_produto).toFixed(2)}</span></p>
                  <p>Peso proporcional: <span className="font-bold">{Number(item.peso_final).toFixed(2)} kg</span></p>
                  <FaTrash
                    onClick={() => handleRemover(item.id_produtos)}
                    className="absolute top-2 right-2 text-vermelho text-[1.2rem] cursor-pointer hover:text-red-700"
                  />
                  <button
                    className="hover:bg-verdeaceso bg-marieth rounded-[5px] cursor-pointer text-white p-2 text-[0.9rem] mt-2"
                    onClick={() => handleEditar(item)}
                  >
                    Alterar Quantidade
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Resumo dos totais */}
          {calculoCarrinho && calculoCarrinho.itens.length > 0 && (
            <div className="mt-8 p-4 bg-white rounded-[10px] shadow-custom">
              <div className="flex justify-between border-b-[1px] border-solid border-tab py-2 px-0">
                <span>Subtotal dos produtos:</span>
                <span>Kzs {Number(calculoCarrinho.resumo.subtotalProdutos).toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b-[1px] border-solid border-tab py-2 px-0">
                <span>Frete:</span>
                <span>Kzs {Number(calculoCarrinho.resumo.frete).toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b-[1px] border-solid border-tab py-2 px-0">
                <span>Comissão:</span>
                <span>Kzs {Number(calculoCarrinho.resumo.comissao).toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b-[1px] border-solid border-tab py-2 px-0">
                <span>Peso total:</span>
                <span>{Number(calculoCarrinho.resumo.pesoTotal).toFixed(2)} kg</span>
              </div>
              <div className="flex justify-between border-b-[1px] border-solid mt-[1rem] border-tab py-2 px-0">
                <span className="text-marieth text-[1.2rem] font-bold">Total a pagar:</span>
                <span className="text-[1.2rem] font-bold">Kzs {Number(calculoCarrinho.resumo.totalFinal).toFixed(2)}</span>
              </div>
              {calculoCarrinho.resumo.pesoTotal < 10 && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
                  <p><strong>Atenção:</strong> O peso total mínimo para efetivar a compra é de 10kg.
                     Peso atual: {Number(calculoCarrinho.resumo.pesoTotal).toFixed(2)}kg. Adicione mais produtos para continuar.</p>
                </div>
              )}
              <button 
                className={`transition-all ${loadingCheckout || calculoCarrinho.resumo.pesoTotal < 10 ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-verdeaceso bg-marieth'} text-[1.1rem] mt-4 block w-full p-4 text-white border-none rounded-[5px] cursor-pointer`}
                onClick={handleIniciarCheckout}
                disabled={loadingCheckout || calculoCarrinho.resumo.pesoTotal < 10}
              >
                {loadingCheckout ? 'Processando...' : 'Iniciar Compra'}
              </button>
            </div>
          )}
        </div>
        {/* Modal de ajuste de quantidade */}
        {showcaixa && produtoSelecionado && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 mt-5">
            <div className="min-w-[300px] w-[70%] max-w-[450px] bg-white shadow-custom rounded-[10px] p-6 relative">
              <h2 className="font-bold text-2xl mb-4 text-marieth">Alterar Quantidade</h2>
              <div className="mb-4 p-3 bg-gray-50 rounded-[5px]">
                <p className="font-semibold">{produtoSelecionado.nome}</p>
                <p className="text-sm text-gray-600">
                  Preço unitário: Kzs {parseFloat(produtoSelecionado.preco_cadastrado?.toString() || "0").toFixed(2)}/{produtoSelecionado.Unidade || "unidade"}
                </p>
                <p className="text-sm text-gray-600">
                  Quantidade atual: {produtoSelecionado.quantidade_desejada} {produtoSelecionado.Unidade || "unidades"}
                </p>
                <p className="text-sm font-medium text-green-600">
                  Disponível em estoque: {quantidadeDisponivel} {produtoSelecionado.Unidade || "unidades"}
                </p>
              </div>
              {errorMessage && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  <p className="text-sm font-medium">{errorMessage}</p>
                </div>
              )}
              {/* Botões de incremento rápido */}
              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Ajuste rápido:</p>
                <div className="grid grid-cols-4 gap-2">
                  <button onClick={() => handleIncrementoRapido(-10)} className="p-2 bg-red-500 rounded-[5px] text-white text-[0.8rem] hover:bg-red-600">-10</button>
                  <button onClick={() => handleIncrementoRapido(-5)} className="p-2 bg-red-500 rounded-[5px] text-white text-[0.8rem] hover:bg-red-600">-5</button>
                  <button onClick={() => handleIncrementoRapido(-1)} className="p-2 bg-red-500 rounded-[5px] text-white text-[0.8rem] hover:bg-red-600">-1</button>
                  <button onClick={() => handleIncrementoRapido(-0.5)} className="p-2 bg-red-500 rounded-[5px] text-white text-[0.8rem] hover:bg-red-600">-0.5</button>
                  <button onClick={() => handleIncrementoRapido(0.5)} className="p-2 bg-marieth rounded-[5px] text-white text-[0.8rem] hover:bg-verdeaceso">+0.5</button>
                  <button onClick={() => handleIncrementoRapido(1)} className="p-2 bg-marieth rounded-[5px] text-white text-[0.8rem] hover:bg-verdeaceso">+1</button>
                  <button onClick={() => handleIncrementoRapido(5)} className="p-2 bg-marieth rounded-[5px] text-white text-[0.8rem] hover:bg-verdeaceso">+5</button>
                  <button onClick={() => handleIncrementoRapido(10)} className="p-2 bg-marieth rounded-[5px] text-white text-[0.8rem] hover:bg-verdeaceso">+10</button>
                </div>
              </div>
              {/* Input manual de quantidade */}
              <div className="flex flex-col gap-4 my-4 mx-0">
                <label htmlFor="number" className="font-medium">
                  Quantidade desejada:
                  <input
                    type="number"
                    name="numero"
                    id="number"
                    min={0.1}
                    max={quantidadeDisponivel}
                    value={quantidade}
                    onChange={(e) => handleQuantidadeChange(parseFloat(e.target.value))}
                    step={0.1}
                    className="w-full text-lg p-3 border-[1px] border-solid border-tab rounded-[5px] mt-1"
                  />
                </label>
                {/* Informações de resumo */}
                <div className="bg-blue-50 p-3 rounded-[5px]">
                  <p className="font-bold text-marieth text-lg">
                    Subtotal estimado: Kzs {(produtoSelecionado ? parseFloat(produtoSelecionado.preco_cadastrado?.toString() || "0") * quantidade : 0).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {quantidade} {produtoSelecionado?.Unidade || "unidades"} × Kzs {produtoSelecionado ? parseFloat(produtoSelecionado.preco_cadastrado?.toString() || "0").toFixed(2) : 0}
                  </p>
                </div>
              </div>
              {/* Botões de ação */}
              <div className="flex gap-4 justify-end cursor-pointer border-none mt-6">
                <button 
                  className="bg-gray-500 py-3 px-6 text-white rounded-[5px] hover:bg-gray-600 transition-colors" 
                  onClick={() => {
                    setshowcaixa(false);
                    setErrorMessage('');
                  }}
                >
                  Cancelar
                </button>
                <button 
                  className="bg-marieth py-3 px-6 text-white rounded-[5px] hover:bg-verdeaceso transition-colors" 
                  onClick={handleConfirmar}
                  disabled={!!errorMessage}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}