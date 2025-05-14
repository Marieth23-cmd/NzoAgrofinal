"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Head from "next/head"
import { FaTrash } from "react-icons/fa6"
import Footer from "../Components/Footer"
import Navbar from "../Components/Navbar"
import Image from "next/image"
import { listarProdutosDoCarrinho } from "../Services/cart"
import { atualizarQuantidadeProduto } from "../Services/cart"
import { removerProdutoDoCarrinho } from "../Services/cart"
import { finalizarCompra } from "../Services/cart"
import { calcularPrecoProduto } from "../Services/cart"
import { esvaziarCarrinho } from "../Services/cart"

export default function Carrinho() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [quantidade, setQuantidade] = useState(1);
  const [loading, setLoading] = useState(true);
  const router = useRouter()
  
  const [showcaixa, setshowcaixa] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<any>(null);
  const [loadingFinalizarCompra, setLoadingFinalizarCompra] = useState(false);

  // Adicione estados para controlar os totais de maneira mais explícita
  const [freteTotal, setFreteTotal] = useState(0);
  const [comissaoTotal, setComissaoTotal] = useState(0);
  const [totalFinal, setTotalFinal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);

  // Função para carregar os produtos do carrinho
  const carregarProdutos = async () => {
    try {
      setLoading(true);
      const dados = await listarProdutosDoCarrinho();
      console.log("Dados recebidos da API:", dados); 
      
      if (dados && dados.produtos) {
        setProdutos(dados.produtos);
      } else {
        console.log("Nenhum produto encontrado ou formato de resposta inválido");
        setProdutos([]);
      }
    } catch (error) {
      console.log("Erro ao carregar produtos:", error);
      setProdutos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  // Função para esvaziar o carrinho
  const handleEsvaziarCarrinho = async () => {
    try {
      const resposta = await esvaziarCarrinho();
      alert(resposta.mensagem);
      setProdutos([]); // Limpa a lista de produtos na interface
      // Resetar os valores quando não houver produtos
      setTotalFinal(0);
      setFreteTotal(0);
      setComissaoTotal(0);
      setSubtotal(0);
    } catch (error: any) {
      console.log("Erro ao esvaziar carrinho:", error);
      alert(error.mensagem || "Erro ao esvaziar o carrinho.");
    }
  };

  const handleConfirmar = async () => {
    if (!produtoSelecionado) return;

    try {
      await atualizarQuantidadeProduto(produtoSelecionado.id, quantidade);
      await carregarProdutos(); // Recarrega todos os produtos com as quantidades atualizadas
      setshowcaixa(false);
    } catch (error) {
      console.log("Erro ao atualizar produto:", error);
      alert("Erro ao atualizar quantidade do produto");
    }
  };

  const handleRemover = async (id_produto: string) => {
    try {
      await removerProdutoDoCarrinho(id_produto);
      await carregarProdutos(); // Recarrega todos os produtos após remover
    } catch (error) {
      console.log("Erro ao remover produto:", error);
      alert("Erro ao remover produto do carrinho");
    }
  };

  const handleIncrementoRapido = (valor: number) => {
    setQuantidade((prevQuantidade) => {
      const novaQuantidade = prevQuantidade + valor;
      // Como não temos um campo específico para a quantidade disponível,
      // vamos usar um valor alto por padrão ou implementar uma regra de negócio adequada
      const max = 100; // Defina um limite adequado ou use dados do produto se disponível
      return novaQuantidade <= max ? novaQuantidade : max;
    });
  };

  // Função para calcular o subtotal
  const calcularSubtotal = () => {
    const total = produtos.reduce((total, produto) => {
      return total + (parseFloat(produto.preco) * produto.quantidade);
    }, 0);
    return total;
  };

  // Função para tratar o erro de finalização de compra
  const handleFinalizarCompra = async () => {
    if (produtos.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }
    
    try {
      setLoadingFinalizarCompra(true);
      const resposta = await finalizarCompra();
      alert(resposta.mensagem);
      setProdutos([]); // Limpa a lista de produtos na interface
      // Resetar os totais
      setTotalFinal(0);
      setFreteTotal(0);
      setComissaoTotal(0);
      setSubtotal(0);
      router.push("/enderecopedido");
    } catch (error: any) {
      console.log("Erro ao finalizar compra:", error);
      // Verifica se o erro tem uma mensagem específica ou usa uma mensagem genérica
      if (error.mensagem) {
        alert(error.mensagem);
      } else if (error.erro) {
        alert(error.erro);
      } else {
        alert("Erro ao finalizar a compra. Verifique se há itens no carrinho ou se há estoque suficiente.");
      }
    } finally {
      setLoadingFinalizarCompra(false);
    }
  };

  // Usar useEffect para calcular totais sempre que os produtos mudarem
  useEffect(() => {
    const calcularTotais = async () => {
      let total = 0;
      let frete = 0;
      let comissao = 0;
      let subTotal = calcularSubtotal();

      // Apenas calcule os preços se houver produtos
      if (produtos.length > 0) {
        for (const produto of produtos) {
          try {
            const resultado = await calcularPrecoProduto(produto.id, produto.quantidade);
            console.log("Resultado do cálculo para produto", produto.id, ":", resultado);
            
            // Acumular os valores
            total += resultado.totalFinal || 0;
            frete += resultado.frete || 0;
            comissao += resultado.comissao || 0;
          } catch (error: any) {
            console.log("Erro ao calcular preço do produto", error);
            // Cálculo simples para caso de erro
            total += parseFloat(produto.preco) * produto.quantidade;
          }
        }
      }

      // Atualizar todos os estados de uma vez
      setTotalFinal(total);
      setFreteTotal(frete);
      setComissaoTotal(comissao);
      setSubtotal(subTotal);
    };

    calcularTotais();
  }, [produtos]);

  // Determinar a unidade padrão com base na categoria do produto
  const getUnidadePadrao = (categoria: string) => {
    if (!categoria) return 'unidade';
    
    switch (categoria.toLowerCase()) {
      case 'frutas':
      case 'verduras':
      case 'tuberculos':
        return 'kg';
      case 'graos':
        return 'kg';
      default:
        return 'unidade';
    }
  };

  return (
    <>
      <Head>
        <title> Carrinho </title>
      </Head>

      <Navbar />

      <div className="mb-20 mt-[15%]">
        <div className="max-w-[1200px] my-8 mx-auto py-0 px-4 items-center gap-4 grid grid-cols-1 relative border-b-[1px]">
          <div className="flex items-end">
            <h1 className="text-[2rem] text-marieth mb-8 p-4 font-bold">
              Meu Carrinho
            </h1>
            {produtos.length > 0 && (
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
          ) : produtos.length === 0 ? (
            <p className="text-center text-gray-500 text-lg mt-8">Carrinho vazio. Nenhum produto adicionado.</p>
          ) : (
            produtos.map((produto) => (
              <div key={produto.id} className="flex p-2 border-b-[1px]">
                <Image
                  src={produto.foto_produto || '/placeholder.jpg'}
                  alt={produto.nome || 'Produto'}
                  height={100}
                  width={100}
                  className="object-cover rounded-[5px]"
                />
                <div className="flex-1 py-0 px-4 relative">
                  <h3 className="font-bold mb-2">{produto.nome}</h3>
                  <p className="font-bold text-marieth">
                    Kzs {produto.preco}/<span>1</span> {getUnidadePadrao(produto.categoria)}
                  </p>
                  <p>Quantidade: {produto.quantidade} {getUnidadePadrao(produto.categoria)}</p>
                  <p>Subtotal: Kzs {(parseFloat(produto.preco) * produto.quantidade).toFixed(2)}</p>
                  <FaTrash
                    onClick={() => handleRemover(produto.id)}
                    className="absolute top-2 right-2 text-vermelho text-[1.2rem] cursor-pointer"
                  />
                  <button
                    className="hover:bg-verdeaceso bg-marieth rounded-[5px] cursor-pointer text-white p-2 text-[0.9rem] mt-2"
                    onClick={() => {
                      setProdutoSelecionado(produto);
                      setQuantidade(produto.quantidade);
                      setshowcaixa(true);
                    }}
                  >
                    Alterar Quantidade
                  </button>
                </div>
              </div>
            ))
          )}

          {produtos.length > 0 && (
            <div className="mt-8 p-4 bg-white rounded-[10px] shadow-custom">
              <div className="flex justify-between border-b-[1px] border-solid border-tab py-2 px-0">
                <span>Subtotal:</span>
                <span>kzs {subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between border-b-[1px] border-solid border-tab py-2 px-0">
                <span>Transporte:</span>
                <span>kzs {(freteTotal + comissaoTotal).toFixed(2)}</span>
              </div>

              <div className="flex justify-between border-b-[1px] border-solid mt-[1rem] border-tab py-2 px-0">
                <span className="text-marieth text-[1.2rem] font-bold">Total:</span>
                <span>kzs {totalFinal.toFixed(2)}</span>
              </div>

              <button 
                className={`transition-all ${loadingFinalizarCompra ? 'bg-gray-400' : 'hover:bg-verdeaceso bg-marieth'} text-[1.1rem] mt-4 block w-full p-4 text-white border-none rounded-[5px] cursor-pointer`}
                onClick={handleFinalizarCompra}
                disabled={produtos.length === 0 || loadingFinalizarCompra}
              >
                {loadingFinalizarCompra ? 'Processando...' : 'Finalizar Compra'}
              </button>
            </div>
          )}
        </div>

        {/* Modal "showcaixa" atualizado */}
        {showcaixa && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="min-w-[300px] bg-white shadow-custom rounded-[10px] p-8 relative">
              <h2 className="font-bold text-2xl mb-4">Alterar Quantidade</h2>
              <p className="text-sm text-gray-600 mb-4">
                Produto: {produtoSelecionado?.nome} - Preço: Kzs {produtoSelecionado?.preco}/{getUnidadePadrao(produtoSelecionado?.categoria)}
              </p>

              <div className="mb-4 gap-2 grid grid-cols-2">
                <button onClick={() => handleIncrementoRapido(0.5)} className="p-2 bg-marieth rounded-[5px] text-white text-[0.9rem] hover:bg-verdeaceso">+0.5</button>
                <button onClick={() => handleIncrementoRapido(1)} className="p-2 bg-marieth rounded-[5px] text-white text-[0.9rem] hover:bg-verdeaceso">+1</button>
                <button onClick={() => handleIncrementoRapido(5)} className="p-2 bg-marieth rounded-[5px] text-white text-[0.9rem] hover:bg-verdeaceso">+5</button>
                <button onClick={() => handleIncrementoRapido(10)} className="p-2 bg-marieth rounded-[5px] text-white text-[0.9rem] hover:bg-verdeaceso">+10</button>
              </div>
              
              <div className="flex flex-col gap-4 my-4 mx-0">
                <label htmlFor="number">Ajustar quantidade
                  <input
                    type="number"
                    name="numero"
                    id="number"
                    min={0.1}
                    value={quantidade}
                    onChange={(e) => {
                      const novaQuantidade = parseFloat(e.target.value);
                      if (!isNaN(novaQuantidade) && novaQuantidade > 0) {
                        setQuantidade(novaQuantidade);
                      }
                    }}
                    step={0.1}
                    className="w-full text-4 p-2 border-[1px] border-solid border-tab rounded-[5px]"
                  />
                </label>
                <p className="text-gray-500 text-sm">
                  Unidade: {produtoSelecionado && getUnidadePadrao(produtoSelecionado.categoria)}
                </p>

                <p className="font-bold text-marieth">
                  Subtotal estimado: Kzs {(produtoSelecionado ? parseFloat(produtoSelecionado.preco) * quantidade : 0).toFixed(2)}
                </p>
              </div>

              <div className="flex gap-4 justify-end cursor-pointer border-none">
                <button 
                  className="bg-vermelho py-2 px-4 text-white rounded-[5px]" 
                  onClick={() => setshowcaixa(false)}
                >
                  Cancelar
                </button>
                <button 
                  className="bg-marieth py-2 px-4 text-white rounded-[5px]" 
                  onClick={handleConfirmar}
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