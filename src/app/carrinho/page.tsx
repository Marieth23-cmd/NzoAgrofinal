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

export default function Carrinho() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [quantidade, setQuantidade] = useState(1);
  const [loading, setLoading] = useState(true);
  const router = useRouter()

  const [produtoSelecionado, setProdutoSelecionado] = useState<any>(null);

  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const dados = await listarProdutosDoCarrinho();
        setProdutos(dados.produtos);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarProdutos();
  }, []);

  const handleConfirmar = async () => {
    if (!produtoSelecionado) return;

    try {
      await atualizarQuantidadeProduto(produtoSelecionado.id_produtos, quantidade);
      const dadosAtualizados = await listarProdutosDoCarrinho();
      setProdutos(dadosAtualizados);
      setshowcaixa(false);
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
    }
  };

  const handleRemover = async (id_produtos: string) => {
    try {
      await removerProdutoDoCarrinho(id_produtos);
      const dadosAtualizados = await listarProdutosDoCarrinho();
      setProdutos(dadosAtualizados);
    } catch (error) {
      console.log("Erro ao remover produto:", error);
    }
  };

  const handleIncrementoRapido = (valor: number) => {
    setQuantidade((prevQuantidade) => {
      const novaQuantidade = prevQuantidade + valor;
      const max = produtoSelecionado?.quantidadeDisponivel || 1;
      return novaQuantidade <= max ? novaQuantidade : max;
    });
  };

  const calcularSubtotal = () => {
    return produtos.reduce((total, produto) => {
      return total + produto.precoUnitario * produto.quantidade;
    }, 0);
  };

  const [freteTotal, setFreteTotal] = useState(0);
  const [comissaoTotal, setComissaoTotal] = useState(0);
  const [totalFinal, setTotalFinal] = useState(0);

  useEffect(() => {
    const calcularTotais = async () => {
      let total = 0;
      let frete = 0;
      let comissao = 0;

      for (const produto of produtos) {
        try {
          const resultado = await calcularPrecoProduto(produto.id_produtos, produto.quantidade);
          total += resultado.totalFinal;
          frete += resultado.frete;
          comissao += resultado.comissao;
        } catch (error: any) {
          alert(error.mensagem || "erro ao calcular preco")
          console.log("Erro ao calcular preço do produto", error);
        }
      }

      setTotalFinal(total);
      setFreteTotal(frete);
      setComissaoTotal(comissao);
    };

    if (produtos.length > 0) {
      calcularTotais();
    }
  }, [produtos]);

  const [showcaixa, setshowcaixa] = useState(false)

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
            <button className="bg-vermelho text-white rounded-[5px] h-fit px-2 py-1 mb-12 ml-[750px] flex items-center gap-2 cursor-pointer">
              <FaTrash />
              Esvaziar
            </button>
          </div>

          {loading ? (
            <p className="text-center text-gray-500 text-lg">Carregando produtos...</p>
          ) : produtos.length === 0 ? (
            <p className="text-center text-gray-500 text-lg mt-8">Carrinho vazio. Nenhum produto adicionado.</p>
          ) : (
            produtos.map((produto) => (
              <div key={produto.id_produtos} className="flex p-2 border-b-[1px]">
                <Image
                  src={produto.foto_produto}
                  alt={produto.nome}
                  height={100}
                  width={100}
                  className="object-cover rounded-[5px]"
                />
                <div className="flex-1 py-0 px-4 ">
                  <h3 className="font-bold mb-2">{produto.nome}</h3>
                  <p className="font-bold text-marieth -mb-6">
                    Kzs {produto.preco}/<span>1</span> {produto.Unidade}
                  </p>
                  <FaTrash
                    onClick={() => handleRemover(produto.id_produtos)}
                    className=" ml-[60rem] mb-2 text-vermelho text-[1.2rem] cursor-pointer"
                  />
                  <button
                    className=" hover:bg-verdeaceso bg-marieth rounded-[5px] cursor-pointer text-white p-2 text-[0.9rem]"
                    onClick={() => {
                      setProdutoSelecionado(produto);
                      setQuantidade(produto.quantidade);
                      setshowcaixa(true);
                    }}
                  >
                    +/-
                  </button>
                </div>
              </div>
            ))
          )}

          <div className=" mt-8 p-4 bg-white rounded-[10px] shadow-custom">
            <div className="flex justify-between border-b-[1px] border-solid border-tab py-2 px-0 " >
              <span>Subtotal:</span>
              <span>kzs {calcularSubtotal().toFixed(2)}</span>
            </div>

            <div className="flex justify-between border-b-[1px] border-solid border-tab py-2 px-0 " >
              <span>Transporte:</span>
              <span>kzs {freteTotal + comissaoTotal}</span>
            </div>

            <div className="flex justify-between border-b-[1px] border-solid mt-[1rem] border-tab py-2 px-0 ">
              <span className="text-marieth text-[1.2rem] font-bold ">Total:</span>
              <span>kzs {totalFinal.toFixed(2)}</span>
            </div>

            <button className="transition-all hover:bg-verdeaceso text-[1.1rem] mt-4 block w-full p-4 bg-marieth text-white border-none rounded-[5px] cursor-pointer"
              onClick={async () => {
                try {
                  const resposta = await finalizarCompra();
                  alert(resposta.mensagem);
                  setProdutos([]);
                  router.push("/enderecopedido")
                } catch (error: any) {
                  console.error("Erro ao finalizar compra:", error);
                  alert(error.response?.data?.mensagem || "Erro ao finalizar a compra.");
                }
              }}>
              Finalizar Compra
            </button>
          </div>
        </div>

        {showcaixa && (
          <div className="flex items-center">
            <div className="top-[40%] left-[40%] min-w-[300px] bg-white shadow-custom rounded-[10px] p-8 absolute " >
              <h2 className="font-bold text-2xl mb-4">Alterar Quantidade</h2>

              <div className=" mb-4 gap-2 grid grid-cols-2">
                <div className="mb-4 gap-2 grid grid-cols-2">
                  <button onClick={() => handleIncrementoRapido(0.5)} className="p-2 bg-marieth rounded-[5px] text-white text-[0.9rem] hover:bg-verdeaceso">+0.5</button>
                  <button onClick={() => handleIncrementoRapido(1)} className="p-2 bg-marieth rounded-[5px] text-white text-[0.9rem] hover:bg-verdeaceso">+1</button>
                  <button onClick={() => handleIncrementoRapido(5)} className="p-2 bg-marieth rounded-[5px] text-white text-[0.9rem] hover:bg-verdeaceso">+5</button>
                  <button onClick={() => handleIncrementoRapido(10)} className="p-2 bg-marieth rounded-[5px] text-white text-[0.9rem] hover:bg-verdeaceso">+10</button>
                </div>
              </div>
              <div className="flex flex-col gap-4 my-4 mx-0">
                <label htmlFor="number">Ajustar

                <input
                  type="number"
                  name="numero"
                  min={1}
                  max={produtoSelecionado?.quantidadeDisponivel || 1}
                  value={quantidade}
                  onChange={(e) => {
                    const novaQuantidade = parseFloat(e.target.value);
                    if (
                      produtoSelecionado &&
                      novaQuantidade <= produtoSelecionado.quantidadeDisponivel
                    ) {
                      setQuantidade(novaQuantidade);
                    }
                  }}
                  step={0.1}
                  className="text-4 p-2 border-[1px] border-solid border-tab rounded-[5px]"
                  />
                <p className="text-gray-500 text-sm">
                  Unidade: {produtoSelecionado?.Unidade}
                </p>
                  </label>

                <label htmlFor="verduras">
                  <select title="verduras" className="text-4 p-2 border-[1px] border-solid border-tab rounded-[5px]">
                    <option value="Toneladas">Toneladas</option>
                    <option value="kg">Kilograma</option>
                  </select>
                </label>
              </div>

              <div className=" flex gap-4 justify-end cursor-pointer border-none ">
                <button className="bg-vermelho py-2 px-4 text-white rounded-[5px]" onClick={() => setshowcaixa(false)}>Cancelar</button>
                <button className="bg-marieth py-2 px-4 text-white rounded-[5px]" onClick={handleConfirmar}>Confirmar</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}