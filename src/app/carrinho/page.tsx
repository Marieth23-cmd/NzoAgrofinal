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
  const [quantidadeDisponivel, setQuantidadeDisponivel] = useState(0); // Para controle de estoque

  // Adicione estados para controlar os totais de maneira mais explícita
  const [freteTotal, setFreteTotal] = useState(0);
  const [comissaoTotal, setComissaoTotal] = useState(0);
  const [totalFinal, setTotalFinal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [pesoTotal, setPesoTotal] = useState(0); // Adicionado para monitorar o peso total
  const [errorMessage, setErrorMessage] = useState(''); // Para mensagens de erro mais claras

  // Função para carregar os produtos do carrinho
  // const carregarProdutos = async () => {
  //   try {
  //     setLoading(true);
  //     const dados = await listarProdutosDoCarrinho();
  //     console.log("Dados recebidos da API:", dados); 
      
  //     if (dados && dados.produtos && Array.isArray(dados.produtos)) {
  //       setProdutos(dados.produtos);
  //       // // Cálculo imediato do subtotal ao carregar os produtos
  //       // const calculoSubtotal = dados.produtos.reduce((total: number, produto: any) => {
  //       //   // Certifique-se de que produto.preco seja um número válido
  //       //   const preco = produto.preco ? parseFloat(produto.preco) : 0;
  //       //   const quantidade = produto.quantidade || 0;
  //       //   return total + (preco * quantidade);
  //       // }, 0);
  //       // setSubtotal(calculoSubtotal);
        
  //       // // Calcular peso total
  //       // const calculoPesoTotal = dados.produtos.reduce((total: number, produto: any) => {
  //       //   const peso = produto.peso_kg ? parseFloat(produto.peso_kg) : 0;
  //       //   const quantidade = produto.quantidade || 0;
  //       //   return total + (peso * quantidade);
  //       // }, 0);
  //       // setPesoTotal(calculoPesoTotal);
  //       // console.log("Peso total calculado:", calculoPesoTotal);

  //       // // Calcular frete e comissão imediatamente quando carregamos os produtos
  //       // if (calculoPesoTotal >= 10) {
  //       //   const { frete, comissao } = calcularFretePorPeso(calculoPesoTotal);
  //       //   setFreteTotal(frete);
  //       //   setComissaoTotal(comissao);
  //       //   setTotalFinal(calculoSubtotal + frete + comissao);
  //       //   console.log("Frete:", frete, "Comissão:", comissao);
  //       // } else {
  //       //   setFreteTotal(0);
  //       //   setComissaoTotal(0);
  //       //   setTotalFinal(calculoSubtotal);
  //       // }
  //     // } else {
  //       // console.log("Nenhum produto encontrado ou formato de resposta inválido");
  //       // setProdutos([]);
  //       // setSubtotal(0);
  //       // setPesoTotal(0);
  //       // setFreteTotal(0);
  //       // setComissaoTotal(0);
  //       // setTotalFinal(0);
  //     }
  //   } catch (error) {
  //     console.log("Erro ao carregar produtos:", error);
  //     setProdutos([]);
  //     setSubtotal(0);
  //     setPesoTotal(0);
  //     setFreteTotal(0);
  //     setComissaoTotal(0);
  //     setTotalFinal(0);
  //   } finally {
  //     setLoading(false);
  //   }
 
  // }
  // ;

const carregarProdutos = async () => {
    try {
      setLoading(true);
      const dados = await listarProdutosDoCarrinho();
      console.log("Dados recebidos da API:", dados); 
      
      if (dados && dados.produtos && Array.isArray(dados.produtos)) {
        setProdutos(dados.produtos);
 // Após setProdutos(dados.produtos), adicione:
let totalFrete = 0;
let totalComissao = 0;
let totalFinalCompra = 0;
let subtotalCalculado = 0;
let pesoTotalCalculado = 0;

for (const produto of dados.produtos) {
  try {
    const resultado = await calcularPrecoProduto(produto.id_produto, produto.quantidade);

    subtotalCalculado += resultado.precoCliente;
    totalFrete += resultado.frete;
    totalComissao += resultado.comissao;
    totalFinalCompra += resultado.totalFinal;
    pesoTotalCalculado += resultado.pesoTotal;

  } catch (error) {
    console.log(`Erro ao calcular preço do produto ${produto.nome}:`, error);
  }

}

setSubtotal(subtotalCalculado);
setFreteTotal(totalFrete);
setComissaoTotal(totalComissao);
setTotalFinal(totalFinalCompra);
setPesoTotal(pesoTotalCalculado);

      }
    } catch (error) {
      console.log("Erro ao carregar produtos:", error);
      setProdutos([]);
      setSubtotal(0);
      setPesoTotal(0);
      setFreteTotal(0);
      setComissaoTotal(0);
      setTotalFinal(0);
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
      setPesoTotal(0);
    } catch (error: any) {
      console.log("Erro ao esvaziar carrinho:", error);
      alert(error.mensagem || "Erro ao esvaziar o carrinho.");
    }
  };

  const handleConfirmar = async () => {
    if (!produtoSelecionado) return;

    try {
      setErrorMessage('');
      // Verificar se a quantidade excede o estoque disponível
      if (quantidade > quantidadeDisponivel) {
        setErrorMessage(`Quantidade excede o estoque disponível (${quantidadeDisponivel} ${getUnidadePadrao(produtoSelecionado.categoria)})`);
        return;
      }
      // Verificar se a quantidade é zero ou negativa
      if (quantidade <= 0) {
        setErrorMessage("A quantidade deve ser maior que zero");
        return;
      }
      
      await atualizarQuantidadeProduto(produtoSelecionado.id, quantidade);
      await carregarProdutos(); // Recarrega todos os produtos com as quantidades atualizadas
      setshowcaixa(false);
    } catch (error: any) {
      console.log("Erro ao atualizar produto:", error);
      if (error.erro) {
        setErrorMessage(error.erro);
      } else {
        setErrorMessage("Erro ao atualizar quantidade do produto");
      }
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
      // Verificar se excede o estoque disponível
      if (novaQuantidade > quantidadeDisponivel) {
        setErrorMessage(`Não é possível adicionar mais que ${quantidadeDisponivel} ${produtoSelecionado ? getUnidadePadrao(produtoSelecionado.categoria) : 'unidades'}`);
        return prevQuantidade;
      }
      // Verificar se é menor ou igual a zero
      if (novaQuantidade <= 0) {
        setErrorMessage("A quantidade deve ser maior que zero");
        return prevQuantidade;
      }
      
      setErrorMessage(''); // Limpar mensagem de erro se estiver tudo bem
      return novaQuantidade;
    });
  };

  // Função para calcular o subtotal
  const calcularSubtotal = () => {
    if (!produtos || produtos.length === 0) return 0;
    
    return produtos.reduce((total, produto) => {
      const preco = parseFloat(produto.preco) || 0;
      const qty = produto.quantidade || 0;
      return total + (preco * qty);
    }, 0);
  };

  // Função para tratar o erro de finalização de compra
  const handleFinalizarCompra = async () => {
    setErrorMessage('');
    
    if (produtos.length === 0) {
      setErrorMessage("Seu carrinho está vazio!");
      return;
    }
    
    // Verificar se há produtos com peso total menor que 10kg
    if (pesoTotal < 10) {
      setErrorMessage("O peso total dos produtos deve ser de pelo menos 10kg para realizar a compra.");
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
      setPesoTotal(0);
      router.push("/enderecopedido");
    } catch (error: any) {
      console.log("Erro ao finalizar compra:", error);
      // Verifica se o erro tem uma mensagem específica ou usa uma mensagem genérica
      if (error.mensagem) {
        setErrorMessage(error.mensagem);
      } else if (error.erro) {
        setErrorMessage(error.erro);
      } else {
        setErrorMessage("Erro ao finalizar a compra. Verifique se há itens no carrinho ou se há estoque suficiente.");
      }
    } finally {
      setLoadingFinalizarCompra(false);
    }
  };

  // Usar useEffect para calcular totais sempre que os produtos mudarem
  useEffect(() => {
    const calcularTotais = async () => {
      // Primeiro calculamos o subtotal diretamente
      const subTotalCalculado = calcularSubtotal();
      setSubtotal(subTotalCalculado);
      
      // Recalculamos o peso total
      const pesoCaculado = produtos.reduce((total, produto) => {
        return total + ((produto.peso_kg || 0) * produto.quantidade);
      }, 0);
      setPesoTotal(pesoCaculado);
      
      // Reiniciamos os valores para não acumular de cálculos anteriores
      let totalCalculado = 0;
      let freteCalculado = 0;
      let comissaoCalculada = 0;

      // Apenas calcule os preços se houver produtos e peso suficiente
      if (produtos && produtos.length > 0 && pesoCaculado >= 10) {
        // Calculamos o frete e comissão baseado no peso total
        const { frete, comissao } = calcularFretePorPeso(pesoCaculado);
        freteCalculado = frete;
        comissaoCalculada = comissao;
          
        // O total final é o subtotal + frete + comissão
        totalCalculado = subTotalCalculado + freteCalculado + comissaoCalculada;
        
        console.log("Peso total:", pesoCaculado, "kg");
        console.log("Frete calculado:", freteCalculado);
        console.log("Comissão calculada:", comissaoCalculada);
        console.log("Total final calculado:", totalCalculado);
      }

      // Atualizar todos os estados com os novos valores calculados
      setTotalFinal(totalCalculado);
      setFreteTotal(freteCalculado);
      setComissaoTotal(comissaoCalculada);
    };

    calcularTotais();
  }, [produtos]);

  // Função para calcular o frete e comissão com base no peso total
  const calcularFretePorPeso = (peso: number) => {
    if (peso >= 10 && peso <= 30) return { frete: 10000, comissao: 1000 };
    if (peso >= 31 && peso <= 50) return { frete: 15000, comissao: 1500 };
    if (peso >= 51 && peso <= 70) return { frete: 20000, comissao: 2000 };
    if (peso >= 71 && peso <= 100) return { frete: 25000, comissao: 2500 };
    if (peso >= 101 && peso <= 300) return { frete: 35000, comissao: 3500 };
    if (peso >= 301 && peso <= 500) return { frete: 50000, comissao: 5000 };
    if (peso >= 501 && peso <= 1000) return { frete: 80000, comissao: 8000 };
    if (peso >= 1001 && peso <= 2000) return { frete: 120000, comissao: 12000 };
    return { frete: 0, comissao: 0 }; // Fora do intervalo
  };

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

      <div className="mb-20 mt-[30%] lg:mt-[15%]">
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

          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p>{errorMessage}</p>
            </div>
          )}

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
                    Kzs {parseFloat(produto.preco).toFixed(2)}/{getUnidadePadrao(produto.categoria)}
                  </p>
                  <p>Quantidade: <span className="font-semibold">{produto.quantidade}</span> {getUnidadePadrao(produto.categoria)}</p>
                  <p>Subtotal: <span className="font-bold">Kzs {(parseFloat(produto.preco) * produto.quantidade).toFixed(2)}</span></p>
                  {produto.peso_kg && (
                    <p>Peso: {(produto.peso_kg * produto.quantidade).toFixed(2)} kg</p>
                  )}
                  <FaTrash
                    onClick={() => handleRemover(produto.id)}
                    className="absolute top-2 right-2 text-vermelho text-[1.2rem] cursor-pointer"
                  />
                  <button
                    className="hover:bg-verdeaceso bg-marieth rounded-[5px] cursor-pointer text-white p-2 text-[0.9rem] mt-2"
                    onClick={() => {
                      setProdutoSelecionado(produto);
                      setQuantidade(produto.quantidade);
                      setQuantidadeDisponivel(produto.estoque_atual || 100); // Configurar o estoque disponível
                      setErrorMessage(''); // Limpar mensagens de erro anteriores
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
                <span>Subtotal dos produtos:</span>
                <span>kzs {subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between border-b-[1px] border-solid border-tab py-2 px-0">
                <span>Frete:</span>
                <span>kzs {freteTotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between border-b-[1px] border-solid border-tab py-2 px-0">
                <span>Comissão:</span>
                <span>kzs {comissaoTotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between border-b-[1px] border-solid border-tab py-2 px-0">
                <span>Peso total:</span>
                <span>{pesoTotal.toFixed(2)} kg</span>
              </div>

              <div className="flex justify-between border-b-[1px] border-solid mt-[1rem] border-tab py-2 px-0">
                <span className="text-marieth text-[1.2rem] font-bold">Total a pagar:</span>
                <span>kzs {totalFinal.toFixed(2)}</span>
              </div>

              {pesoTotal < 10 && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
                  <p>O peso total mínimo para efetivar a compra é de 10kg. Adicione mais produtos.</p>
                </div>
              )}

              <button 
                className={`transition-all ${loadingFinalizarCompra || pesoTotal < 10 ? 'bg-gray-400' : 'hover:bg-verdeaceso bg-marieth'} text-[1.1rem] mt-4 block w-full p-4 text-white border-none rounded-[5px] cursor-pointer`}
                onClick={handleFinalizarCompra}
                disabled={produtos.length === 0 || loadingFinalizarCompra || pesoTotal < 10}
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

              {errorMessage && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  <p>{errorMessage}</p>
                </div>
              )}

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
                    max={quantidadeDisponivel}
                    value={quantidade}
                    onChange={(e) => {
                      const novaQuantidade = parseFloat(e.target.value);
                      if (!isNaN(novaQuantidade)) {
                        if (novaQuantidade <= 0) {
                          setErrorMessage("A quantidade deve ser maior que zero");
                          return;
                        }
                        if (novaQuantidade > quantidadeDisponivel) {
                          setErrorMessage(`Não é possível adicionar mais que ${quantidadeDisponivel} ${produtoSelecionado ? getUnidadePadrao(produtoSelecionado.categoria) : 'unidades'}`);
                          return;
                        }
                        setQuantidade(novaQuantidade);
                        setErrorMessage(''); // Limpar mensagem de erro
                      }
                    }}
                    step={0.1}
                    className="w-full text-4 p-2 border-[1px] border-solid border-tab rounded-[5px]"
                  />
                </label>
                <p className="text-gray-500 text-sm">
                  Unidade: {produtoSelecionado && getUnidadePadrao(produtoSelecionado.categoria)}
                </p>
                <p className="text-gray-600 text-sm">
                  Disponível em estoque: <span className="font-semibold">{quantidadeDisponivel}</span> {produtoSelecionado && getUnidadePadrao(produtoSelecionado.categoria)}
                </p> 

                <p className="font-bold text-marieth">
                  Subtotal estimado: Kzs {(produtoSelecionado ? parseFloat(produtoSelecionado.preco) * quantidade : 0).toFixed(2)}
                </p>
              </div>

              <div className="flex gap-4 justify-end cursor-pointer border-none">
                <button 
                  className="bg-vermelho py-2 px-4 text-white rounded-[5px]" 
                  onClick={() => {
                    setshowcaixa(false);
                    setErrorMessage('');
                  }}
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