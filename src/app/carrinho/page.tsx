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

export default function Carrinho() {
  // Definindo os estados necessários
  const [produtos, setProdutos] = useState([]);
  const [quantidade, setQuantidade] = useState(1);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  const [showcaixa, setshowcaixa] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [loadingFinalizarCompra, setLoadingFinalizarCompra] = useState(false);
  const [quantidadeDisponivel, setQuantidadeDisponivel] = useState(0);

  // Adicione estados para controlar os totais de maneira mais explícita
  const [freteTotal, setFreteTotal] = useState(0);
  const [comissaoTotal, setComissaoTotal] = useState(0);
  const [totalFinal, setTotalFinal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [pesoTotal, setPesoTotal] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [calculoRealizado, setCalculoRealizado] = useState(false); // Flag para controlar se o cálculo já foi realizado

  // Função para carregar os produtos do carrinho
  const carregarProdutos = async () => {
    try {
      setLoading(true);
      const dados = await listarProdutosDoCarrinho();
      console.log("Dados recebidos da API:", dados); 
      
      if (dados && dados.produtos && Array.isArray(dados.produtos)) {
        setProdutos(dados.produtos);
        // Cálculo imediato do subtotal ao carregar os produtos
        const calculoSubtotal = dados.produtos.reduce((total, produto) => {
          // Certifique-se de que produto.preco seja um número válido
          const preco = produto.preco ? parseFloat(produto.preco) : 0;
          const quantidade = produto.quantidade || 0;
          return total + (preco * quantidade);
        }, 0);
        setSubtotal(calculoSubtotal);
        console.log("Subtotal calculado:", calculoSubtotal);
        
        // Calcular peso total
        const calculoPesoTotal = dados.produtos.reduce((total, produto) => {
          const peso = produto.peso_kg ? parseFloat(produto.peso_kg) : 0;
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
  const atualizarCalculoPrecoTotal = async (produtosAtuais) => {
    try {
      // Resetamos os valores para não acumular de cálculos anteriores
      let freteCalculado = 0;
      let comissaoCalculada = 0;
      let totalCalculado = 0;
      
      // Só fazemos o cálculo se tiver produtos
      if (produtosAtuais && produtosAtuais.length > 0) {
        // Para cada produto no carrinho, calculamos e somamos os valores
        for (const produto of produtosAtuais) {
          const resultado = await calcularPrecoProduto(
            produto.id_produtos || produto.id, 
            produto.quantidade
          );
          
          // Somamos os valores retornados pela API
          freteCalculado += resultado.frete || 0;
          comissaoCalculada += resultado.comissao || 0;
          totalCalculado += resultado.totalFinal || 0;
        }
        
        console.log("Resultados do cálculo da API:");
        console.log("Frete calculado:", freteCalculado);
        console.log("Comissão calculada:", comissaoCalculada);
        console.log("Total final calculado:", totalCalculado);
        
        // Atualizar os estados com os valores vindos da API
        setFreteTotal(freteCalculado);
        setComissaoTotal(comissaoCalculada);
        setTotalFinal(totalCalculado);
        setCalculoRealizado(true);
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
    } catch (error) {
      console.log("Erro ao esvaziar carrinho:", error);
      alert(error.mensagem || "Erro ao esvaziar o carrinho.");
    }
  };

  const handleEditar = (produto) => {
    setProdutoSelecionado(produto);
    setQuantidade(produto.quantidade || 1);
    setQuantidadeDisponivel(produto.quantidade_estoque || 0);
    setshowcaixa(true);
    setErrorMessage('');
  };

  const handleConfirmar = async () => {
    if (!produtoSelecionado) return;

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