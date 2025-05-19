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
  finalizarCompra, 
  calcularPrecoProduto, 
  esvaziarCarrinho 
} from "../Services/cart";

// Define tipos para melhorar a tipagem do código
interface Produto {
  id: number;
  id_produtos?: number;
  nome: string;
  preco: number;
  quantidade: number;
  peso_kg?: number;
  foto_produto?: string;
  quantidade_estoque?: number;
  estoque_atual?: number;
  Unidade?: string; // Adicionado campo para unidade real
  unidade_estoque?:string

 

}


export default function Carrinho() {
  // Definindo os estados necessários
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [quantidade, setQuantidade] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  
  const [showcaixa, setshowcaixa] = useState<boolean>(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
  const [loadingFinalizarCompra, setLoadingFinalizarCompra] = useState<boolean>(false);
  const [quantidadeDisponivel, setQuantidadeDisponivel] = useState<number>(0);

  // Adicione estados para controlar os totais de maneira mais explícita
  const [freteTotal, setFreteTotal] = useState<number>(0);
  const [comissaoTotal, setComissaoTotal] = useState<number>(0);
  const [totalFinal, setTotalFinal] = useState<number>(0);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [pesoTotal, setPesoTotal] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [calculoRealizado, setCalculoRealizado] = useState<boolean>(false); // Flag para controlar se o cálculo já foi realizado

  // Função para carregar os produtos do carrinho
  const carregarProdutos = async () => {
    try {
      setLoading(true);
      const dados = await listarProdutosDoCarrinho();
      console.log("Dados recebidos da API:", dados); 
      
      if (dados && dados.produtos && Array.isArray(dados.produtos)) {
        setProdutos(dados.produtos);
        // Cálculo imediato do subtotal ao carregar os produtos
        const calculoSubtotal = dados.produtos.reduce((total: number, produto: Produto) => {
          // Certifique-se de que produto.preco seja um número válido
          const preco = produto.preco ? parseFloat(produto.preco.toString()) : 0;
          const quantidade = produto.quantidade || 0;
          return total + (preco * quantidade);
        }, 0);
        setSubtotal(calculoSubtotal);
        console.log("Subtotal calculado:", calculoSubtotal);
        
        // Calcular peso total
        const calculoPesoTotal = dados.produtos.reduce((total: number, produto: Produto) => {
          const peso = produto.peso_kg ? parseFloat(produto.peso_kg.toString()) : 0;
          const quantidade = produto.quantidade || 0;
          return total + (peso * quantidade);
        }, 0);
        setPesoTotal(calculoPesoTotal);
        console.log("Peso total calculado:", calculoPesoTotal);

        // Se tiver produtos, chama a API para calcular valores
        if (dados.produtos.length > 0) {
          await atualizarCalculoPrecoTotal(dados.produtos);
        } else {
          resetarTotais();
        }
      } else {
        console.log("Nenhum produto encontrado ou formato de resposta inválido");
        setProdutos([]);
        resetarTotais();
      }
    } catch (error) {
      console.log("Erro ao carregar produtos:", error);
      setProdutos([]);
      resetarTotais();
    } finally {
      setLoading(false);
    }
  };

  // Função para resetar os totais
  const resetarTotais = () => {
    setSubtotal(0);
    setPesoTotal(0);
    setFreteTotal(0);
    setComissaoTotal(0);
    setTotalFinal(0);
    setCalculoRealizado(false);
  };

  // Função para atualizar o cálculo de preço total usando a API
  const atualizarCalculoPrecoTotal = async (produtosAtuais: Produto[]) => {
    try {
      // Resetamos os valores para não acumular de cálculos anteriores
      let freteCalculado = 0;
      let comissaoCalculada = 0;
      let totalCalculado = 0;
      
      // Primeiro calculamos o subtotal e peso total dos produtos
      const subtotalCalculado = produtosAtuais.reduce((total: number, produto: Produto) => {
        const preco = produto.preco ? parseFloat(produto.preco.toString()) : 0;
        const quantidade = produto.quantidade || 0;
        return total + (preco * quantidade);
      }, 0);
      
      const pesoTotalCalculado = produtosAtuais.reduce((total: number, produto: Produto) => {
        // Certifique-se que o peso está sendo corretamente lido
        // Caso peso_kg seja undefined ou null, assume um valor padrão baseado na categoria
        let peso = produto.peso_kg ? parseFloat(produto.peso_kg.toString()) : 0;
        
        // Para debug: imprimir o peso de cada produto individualmente
        console.log(`Produto ${produto.nome}: peso=${peso}, quantidade=${produto.quantidade}`);
        
        // Se peso for zero, vamos definir um peso padrão baseado na categoria
        if (peso === 0) {
          switch (produto.categoria?.toLowerCase()) {
            case 'verduras':
            case 'legumes':
            case 'frutas':
              peso = 1; // 1kg como padrão para produtos frescos
              break;
            case 'sementes':
              peso = 0.5; // 500g como padrão para sementes
              break;
            default:
              peso = 0.2; // 200g como padrão para outros produtos
          }
          console.log(`Atribuído peso padrão para ${produto.nome}: ${peso}kg`);
        }
        
        const quantidade = produto.quantidade || 0;
        return total + (peso * quantidade);
      }, 0);
      
      // Atualizar os estados com os valores calculados
      setSubtotal(subtotalCalculado);
      setPesoTotal(pesoTotalCalculado);
      
      console.log("Peso total recalculado:", pesoTotalCalculado);
      
      // Se o peso total for menor que 10kg, não há frete e comissão conforme sua lógica de negócio
      if (pesoTotalCalculado < 10) {
        setFreteTotal(0);
        setComissaoTotal(0);
        // O total final neste caso é apenas o subtotal
        setTotalFinal(subtotalCalculado);
        setCalculoRealizado(true);
        return;
      }
      
      // Adicionamos um timeout para a chamada da API para evitar que ela fique pendente eternamente
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Tempo esgotado ao calcular preço')), 5000);
      });
      
      // Chamamos a API apenas uma vez com o primeiro produto e o peso total
      // para obter os valores de frete e comissão
      if (produtosAtuais.length > 0) {
        try {
          const produtoReferencia = produtosAtuais[0];
          const produtoId = produtoReferencia.id_produtos || produtoReferencia.id;
          
          // Usamos Promise.race para implementar um timeout na chamada da API
          const resultado: any = await Promise.race([
            calcularPrecoProduto(
              String(produtoId), 
              1, // Quantidade fixa para cálculo
              pesoTotalCalculado // Passamos o peso total como parâmetro adicional
            ),
            timeoutPromise
          ]);
          
          // Obtemos os valores de frete e comissão da API
          freteCalculado = resultado.frete || 0;
          comissaoCalculada = resultado.comissao || 0;
          
          // O total final é a soma do subtotal (já calculado) + frete + comissão
          totalCalculado = subtotalCalculado + freteCalculado + comissaoCalculada;
          
          console.log("Resultados do cálculo da API:");
          console.log("Frete calculado:", freteCalculado);
          console.log("Comissão calculada:", comissaoCalculada);
          console.log("Total final calculado:", totalCalculado);
          
          // Atualizar os estados com os valores vindos da API
          setFreteTotal(freteCalculado);
          setComissaoTotal(comissaoCalculada);
          setTotalFinal(totalCalculado);
          setCalculoRealizado(true);
        } catch (apiError) {
          console.log("Erro durante chamada da API:", apiError);
          
          // Cálculo alternativo caso a API falhe
          // Implementando a mesma lógica do backend diretamente no front-end como fallback
          const calcularFrete = (peso: number) => {
            if (peso >= 10 && peso <= 30) return { base: 10000, comissao: 1000 };
            if (peso >= 31 && peso <= 50) return { base: 15000, comissao: 1500 };
            if (peso >= 51 && peso <= 70) return { base: 20000, comissao: 2000 };
            if (peso >= 71 && peso <= 100) return { base: 25000, comissao: 2500 };
            if (peso >= 101 && peso <= 300) return { base: 35000, comissao: 3500 };
            if (peso >= 301 && peso <= 500) return { base: 50000, comissao: 5000 };
            if (peso >= 501 && peso <= 1000) return { base: 80000, comissao: 8000 };
            if (peso >= 1001 && peso <= 2000) return { base: 120000, comissao: 12000 };
            return { base: 0, comissao: 0 };
          };
          
          const frete = calcularFrete(pesoTotalCalculado);
          freteCalculado = frete.base;
          comissaoCalculada = frete.comissao;
          totalCalculado = subtotalCalculado + freteCalculado + comissaoCalculada;
          
          console.log("Usando cálculo de fallback:");
          console.log("Frete calculado:", freteCalculado);
          console.log("Comissão calculada:", comissaoCalculada);
          console.log("Total final calculado:", totalCalculado);
          
          setFreteTotal(freteCalculado);
          setComissaoTotal(comissaoCalculada);
          setTotalFinal(totalCalculado);
          setCalculoRealizado(true);
        }
      } else {
        resetarTotais();
      }
    } catch (error) {
      console.log("Erro ao calcular preço total:", error);
      // Caso haja erro, mantemos os valores atuais
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
      resetarTotais();
    } catch (error: any) {
      console.log("Erro ao esvaziar carrinho:", error);
      alert(error.mensagem || "Erro ao esvaziar o carrinho.");
    }
  };

  // Função para editar quantidade de um produto
  const handleEditar = (produto: Produto) => {
    setProdutoSelecionado(produto);
    setQuantidade(produto.quantidade || 1);
    setQuantidadeDisponivel(produto.quantidade_estoque || produto.estoque_atual || 0);
    setshowcaixa(true);
    setErrorMessage('');
  };

  // Função para incrementar rapidamente a quantidade
  const handleIncrementoRapido = (incremento: number) => {
    if (produtoSelecionado) {
      const novaQuantidade = quantidade + incremento;
      
      if (novaQuantidade <= 0) {
        setErrorMessage("A quantidade deve ser maior que zero");
        return;
      }
      
      if (novaQuantidade > quantidadeDisponivel) {
        setErrorMessage(`Não é possível adicionar mais que ${quantidadeDisponivel} ${getUnidade(produtoSelecionado)}`);
        return;
      }
      
      setQuantidade(novaQuantidade);
      setErrorMessage('');
    }
  };

  // Função para confirmar a alteração de quantidade
  const handleConfirmar = async () => {
    if (!produtoSelecionado) return;
    
    try {
      if (quantidade <= 0) {
        setErrorMessage("A quantidade deve ser maior que zero");
        return;
      }
      
      if (quantidade > quantidadeDisponivel) {
        setErrorMessage(`Não é possível adicionar mais que ${quantidadeDisponivel} ${getUnidade(produtoSelecionado)}`);
        return;
      }
      
      // Atualizar a quantidade do produto no carrinho
      const resposta = await atualizarQuantidadeProduto(
        String(produtoSelecionado.id), 
        quantidade
      );
      
      console.log("Resposta da atualização:", resposta);
      
      // Recarregar produtos após atualização
      await carregarProdutos();
      
      // Fechar o modal
      setshowcaixa(false);
    } catch (error: any) {
      console.log("Erro ao atualizar quantidade:", error);
      setErrorMessage(error.mensagem || "Erro ao atualizar quantidade do produto.");
    }
  };

  // Função para remover um produto do carrinho
  const handleRemover = async (produtoId: number) => {
    try {
      const confirmacao = window.confirm("Tem certeza que deseja remover este produto do carrinho?");
      
      if (confirmacao) {
        const resposta = await removerProdutoDoCarrinho(String(produtoId));
        alert(resposta.mensagem || "Produto removido com sucesso!");
        await carregarProdutos(); // Recarrega os produtos após remover
      }
    } catch (error: any) {
      console.log("Erro ao remover produto:", error);
      alert(error.mensagem || "Erro ao remover produto do carrinho.");
    }
  };

  // Função para finalizar a compra
  const handleFinalizarCompra = async () => {
    if (produtos.length === 0) {
      alert("Seu carrinho está vazio. Adicione produtos antes de finalizar a compra.");
      return;
    }
    
    if (pesoTotal < 10) {
      alert("O peso total mínimo para efetivar a compra é de 10kg. Adicione mais produtos.");
      return;
    }
    
    try {
      setLoadingFinalizarCompra(true);
      const resposta = await finalizarCompra();
      
      alert(resposta.mensagem || "Compra finalizada com sucesso!");
      setProdutos([]);
      resetarTotais();
      router.push("/confirmacao-pedido"); // Redireciona para página de confirmação
    } catch (error: any) {
      console.log("Erro ao finalizar compra:", error);
      alert(error.mensagem || "Erro ao finalizar compra. Tente novamente.");
    } finally {
      setLoadingFinalizarCompra(false);
    }
  };

  return (
    <>
      <Head>
        <title> Carrinho </title>
      </Head>

      <Navbar />

      <div className="mb-20 mt-[48%] lg:mt-[15%]">
        <div className="max-w-[1200px] my-8 mx-auto py-0 px-4 items-center gap-4 grid grid-cols-1 relative border-b-[1px]">
          <div className="flex items-end">
            <h1 className=" text-[1.5rem] lg:text-[2rem] text-marieth mb-8 p-4 font-bold">
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
              <div key={produto.id} className="flex p-1 border-b-[1px]">
                <div className="h-24 w-24 min-w-24 flex items-center justify-center">
                  <Image
                    src={produto.foto_produto || '/logo.jpg'}
                    alt={produto.nome || 'Produto'}
                    height={96}
                    width={96}
                    className="object-cover rounded-[5px] max-h-24"
                  />
                </div>
                <div className="flex-1 py-0 px-4 relative">
                  <h3 className="font-bold mb-2">{produto.nome}</h3>
                  <p className="font-bold text-marieth">
                    Kzs {parseFloat(produto.preco.toString()).toFixed(2)}/{produto.quantidade}{produto.Unidade || "unidade"}
                  </p>
                  <p>Estoque: <span className="font-semibold">{produto.quantidade_estoque}{produto.unidade_estoque}</p>
                  <p>Subtotal: <span className="font-bold">Kzs {(parseFloat(produto.preco.toString()) * produto.quantidade).toFixed(2)}</span></p>
                  {produto.peso_kg && (
                    <p>Peso: {(parseFloat(produto.peso_kg.toString()) * produto.quantidade).toFixed(2)} kg</p>
                  )}
                  <FaTrash
                    onClick={() => handleRemover(produto.id)}
                    className="absolute top-2 right-2 text-vermelho text-[1.2rem] cursor-pointer"
                  />
                  <button
                    className="hover:bg-verdeaceso bg-marieth rounded-[5px] cursor-pointer text-white p-2 text-[0.9rem] mt-2"
                    onClick={() => handleEditar(produto)}
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

        {/* Modal de ajuste de quantidade atualizado */}
        {showcaixa && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="min-w-[300px] w-[90%] max-w-[400px] bg-white shadow-custom rounded-[10px] p-8 relative">
              <h2 className="font-bold text-2xl mb-4">Alterar Quantidade</h2>
              {produtoSelecionado && (
                <p className="text-sm text-gray-600 mb-4">
                  Produto: {produtoSelecionado.nome} - Preço: Kzs {parseFloat(produtoSelecionado.preco.toString()).toFixed(2)}/{getUnidade(produtoSelecionado)}
                </p>
              )}

              {errorMessage && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  <p>{errorMessage}</p>
                </div>
              )}

              <div className="mb-4 grid grid-cols-4 gap-2">
                <button onClick={() => handleIncrementoRapido(-1)} className="p-2 bg-red-500 rounded-[5px] text-white text-[0.9rem] hover:bg-red-600">-1</button>
                <button onClick={() => handleIncrementoRapido(-0.5)} className="p-2 bg-red-500 rounded-[5px] text-white text-[0.9rem] hover:bg-red-600">-0.5</button>
                <button onClick={() => handleIncrementoRapido(0.5)} className="p-2 bg-marieth rounded-[5px] text-white text-[0.9rem] hover:bg-verdeaceso">+0.5</button>
                <button onClick={() => handleIncrementoRapido(1)} className="p-2 bg-marieth rounded-[5px] text-white text-[0.9rem] hover:bg-verdeaceso">+1</button>
                <button onClick={() => handleIncrementoRapido(-5)} className="p-2 bg-red-500 rounded-[5px] text-white text-[0.9rem] hover:bg-red-600">-5</button>
                <button onClick={() => handleIncrementoRapido(-10)} className="p-2 bg-red-500 rounded-[5px] text-white text-[0.9rem] hover:bg-red-600">-10</button>
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
                          setErrorMessage(`Não é possível adicionar mais que ${quantidadeDisponivel} ${produtoSelecionado ? getUnidade(produtoSelecionado) : 'unidades'}`);
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
                  Unidade: {produtoSelecionado && getUnidade(produtoSelecionado)}
                </p>
                <p className="text-gray-600 text-sm">
                  Disponível em estoque: <span className="font-semibold">{quantidadeDisponivel}</span> {produtoSelecionado && getUnidade(produtoSelecionado)}
                </p> 

                <p className="font-bold text-marieth">
                  Subtotal estimado: Kzs {(produtoSelecionado ? parseFloat(produtoSelecionado.preco.toString()) * quantidade : 0).toFixed(2)}
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