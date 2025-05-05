// "use client"
// import React from 'react';
// import Head from "next/head";
// import Image from "next/image";
// import { AiFillHome } from "react-icons/ai";
// import { CiLocationOn } from "react-icons/ci";
// import { FaRegStar } from "react-icons/fa";
// import { useParams, useRouter } from "next/navigation";
// import { FaRegStarHalfStroke } from "react-icons/fa6";
// import { CgShoppingCart } from "react-icons/cg";
// import Footer from "../../Components/Footer";
// import Navbar from "../../Components/Navbar";
// import { useState, useEffect } from "react";
// import { getProdutoById } from "../../Services/produtos";
// import { verificarAuth } from "../../Services/auth";
// import { buscarMediaEstrelas } from "../../Services/avaliacoes";
// import Cookies from "js-cookie";
// import { enviarAvaliacao } from "../../Services/avaliacoes";
// import { FaStar } from "react-icons/fa";
// import { adicionarProdutoAoCarrinho } from '@/app/Services/cart';


// export default function DetalhesProduto(){

//   const { produtoId } = useParams() as { produtoId: string };

//   if (!produtoId) return <div>Carregando produto...</div>;

//   const router = useRouter();

//   // Mudança principal: inicia com showcaixa como false
//   const [showcaixa, setshowcaixa] = useState(false);
//   const [quantidadeSelecionada, setQuantidadeSelecionada] = useState<number>(0);
//   const [unidadeSelecionada, setUnidadeSelecionada] = useState<string>("");

//   const [autenticado, setAutenticado] = useState(false);
//   const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

//   const [media, setMedia] = useState<number>(0);
//   const [total, setTotal] = useState<number>(0);
//   const [percentagem, setPercentagem] = useState<number>(0);
//   const [notaSelecionada, setNotaSelecionada] = useState<number>(0);

//   const id = produtoId;

//   type Produto = {
//     id_produtos: number;
//     nome: string;
//     provincia: string;
//     foto_produto?: string;
//     preco: number;
//     Unidade: string;
//     quantidade: number;
//   };
  
//   const [produto, setProduto] = useState<Produto | null>(null);
//   const [avaliacoes, setAvaliacoes] = useState<{ [key: number]: number | null }>({});
//   const [precoTotal, setPrecoTotal] = useState(0);
//   const [quantidadeCarrinho, setQuantidadeCarrinho] = useState(1);
   
//   const [itemCarrinho, setItemCarrinho] = useState<{
//     id_produto: number;
//     nome: string;
//     quantidade: number;
//     Unidade: string;
//     precoTotal: number;
//   } | null>(null);
  
//   useEffect(() => {
//     // Verificar autenticação quando o componente montar
//     const verificarLogin = async () => {
//       try {
//         await verificarAuth();
//         setAutenticado(true);
//       } catch (error) {
//         setAutenticado(false);
//       }
//     };
    
//     verificarLogin();
//   }, []);
  
//   useEffect(() => {
//     if (!id) return;

//     const fetchProduto = async () => {
//       try {
//         const data = await getProdutoById(Number(produtoId));
//         setProduto(data);
//         setQuantidadeSelecionada(data.quantidade);
//         setUnidadeSelecionada(data.Unidade);

//         const media = await buscarMediaEstrelas(data.id_produtos);
//         setAvaliacoes({ [data.id_produtos]: media?.media_estrelas || null });
//       } catch (error) {
//         console.log("Erro ao buscar produto:", error);

//         // Gracefully handle memory allocation errors
//         if (error instanceof RangeError) {
//           alert("Ocorreu um erro de memória. Por favor, tente novamente mais tarde.");
//         }
//       }
//     };

//     if (produtoId) {
//       fetchProduto();
//     }
//   }, [produtoId]);

//   useEffect(() => {
//     if (!id) return;

//     const carregarDados = async () => {
//       try {
//         const resultado = await buscarMediaEstrelas(Number(id));
//         setMedia(resultado.media || 0);
//         setTotal(resultado.total || 0);
//         setPercentagem(resultado.recomendacoes || 0);
//       } catch (error) {
//         console.log("Erro ao carregar dados:", error);

//         // Handle memory allocation errors
//         if (error instanceof RangeError) {
//           alert("Erro de memória detectado. Por favor, reduza a quantidade de dados processados.");
//         }
//       }
//     };

//     carregarDados();
//   }, [id]);

//   const handleAvaliar = async (nota: number) => {
//     if (!autenticado) {
//       alert("Você precisa estar logado para avaliar.");
//       return;
//     }
  
//     try {
//       await enviarAvaliacao(Number(produtoId), nota);
//       alert("Avaliação enviada com sucesso!");
//       setNotaSelecionada(nota);
//       // Recarregar dados
//       const resultado = await buscarMediaEstrelas(Number(id));
//       setMedia(resultado.media || 0);
//       setTotal(resultado.total || 0);
//       setPercentagem(resultado.recomendacoes || 0);
//       setMensagemSucesso("Avaliação enviada com sucesso!");

//       setTimeout(() => {
//         setMensagemSucesso(null);
//       }, 3000);

//     } catch (error) {
//       console.log(error);
//       alert("Erro ao enviar avaliação.");
//     }
//   };
  
//   const verificarLoginAntesDeAvaliar = async (nota: number) => {
//     if (!autenticado) {
//       alert("Você precisa estar logado para avaliar.");
//       router.push("/login");
//       return;
//     }
//     await handleAvaliar(nota);
//   };
  
//   // Nova função para lidar com o clique no botão +/-
//   const handleBotaoMaisMenos = async () => {
//     if (!autenticado) {
//       alert("Você precisa estar logado para adicionar ao carrinho.");
//       router.push("/login");
//       return;
//     }

//     try {
//       await verificarAuth();
//       setAutenticado(true);
//       setshowcaixa(true);  // Abre a caixa SOMENTE se o usuário estiver autenticado
//     } catch (error) {
//       setAutenticado(false);
//       alert("Você precisa estar logado para adicionar ao carrinho.");
//       router.push("/login");
//     }
//   };

//   useEffect(() => {
//     if (produto) {
//       setPrecoTotal(produto.preco * quantidadeCarrinho);
//     }
//   }, [produto, quantidadeCarrinho]);

//   const handleAdicionarAoCarrinho = async () => {
//     try {
//       await adicionarProdutoAoCarrinho(produto!.id_produtos.toString(), quantidadeCarrinho);
//       alert("Produto adicionado ao carrinho com sucesso!");
//     } catch (error) {
//       alert("Erro ao adicionar ao carrinho.");
//       console.log(error);
//     }
//   };

//   if (!produto) {
//     return <div>Carregando...</div>; 
//   }

//   return(
//     <div>
//       <Head>
//         <title>Detalhes do Produto</title>
//       </Head>
//       <Navbar/>
//       <div className="mb-20 mt-[15%]">
//         <main className="max-w-[1200px] my-8 mx-auto bg-white p-8 shadow-custom rounded-[10px]">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             <div>
//               <Image 
//                 src={produto.foto_produto || "/default-image.jpg"} 
//                 alt={produto.nome} 
//                 width={500} 
//                 height={400}  
//                 className="flex w-full h-[400px] rounded-[10px] items-center justify-center 
//                 text-[3rem] text-cortime bg-pretobranco" 
//               />
//             </div>

//             <div>
//               <div className="flex gap-6 flex-col">
//                 <h1 className="text-[2rem] text-profile font-bold">{produto.nome}</h1>

//                 <div className="flex gap-2 text-[1.5rem] cursor-pointer text-tab">
//                   {avaliacoes[produto.id_produtos] ? (
//                     <>
//                       {[1, 2, 3, 4, 5].map((i) =>
//                         i <= Math.floor(avaliacoes[produto.id_produtos]!) ? (
//                           <FaStar key={i} className="text-amarela" />
//                         ) : i - 0.5 === avaliacoes[produto.id_produtos] ? (
//                           <FaRegStarHalfStroke key={i} className="text-amarela" />
//                         ) : (
//                           <FaRegStarHalfStroke key={i} className="text-gray-300" />
//                         )
//                       )}
//                       <span className="text-amarela -mt-[4px] ml-2">
//                         ({avaliacoes[produto.id_produtos]?.toFixed(1)})
//                       </span>
//                     </>
//                   ) : (
//                     <p className="text-gray-500 text-sm">Sem avaliações</p>
//                   )}                      
//                 </div>
                
//                 <div className="text-[1.8rem] font-bold text-marieth">
//                   <span>{produto.preco}AOA/</span> 
//                   <span>{produto.quantidade}{produto.Unidade}</span>
//                 </div>

//                 <div>
//                   <button 
//                     className="hover:bg-verdeaceso bg-marieth rounded-[5px] cursor-pointer text-white p-2 text-[0.9rem] border-none bottom-4 mb-4"
//                     onClick={handleBotaoMaisMenos}  /* Alterado para usar a nova função */
//                   >
//                     + / -
//                   </button>
              
//                   <div className="flex items-center gap-4 p-4 rounded-[10px] bg-pretobranco">
//                     <div className="flex w-[60px] h-[60px] rounded-[50%] items-center justify-center bg-back">
//                       <AiFillHome/>
//                     </div>
//                     <div>
//                       <h3>{produto.nome}</h3>
//                       <div className="flex items-center p-3 gap-2 mb-8 text-cortexto">
//                         <CiLocationOn/>
//                         <span>{produto.provincia}</span>
//                         <span>/Angola</span>
//                       </div>
//                     </div>
//                   </div>
                
//                   {showcaixa && (
//                     <div className="flex items-center">
//                       <div className="top-[30%] left-[70%] min-w-[300px] bg-white shadow-custom rounded-[10px] p-8 absolute">
//                         <h2 className="font-bold text-2xl mb-4">Alterar Quantidade</h2>
                        
//                         <div className="mb-4 gap-2 grid grid-cols-2">
//                           <button onClick={() => setQuantidadeSelecionada(prev => prev + 0.5)} className="p-2 bg-marieth rounded-[5px] border-nonr cursor-pointer text-white text-[0.9rem] hover:bg-verdeaceso">+0.5</button>
//                           <button onClick={() => setQuantidadeSelecionada(prev => prev + 1)} className="p-2 bg-marieth rounded-[5px] border-nonr cursor-pointer text-white text-[0.9rem] hover:bg-verdeaceso">+1</button>
//                           <button onClick={() => setQuantidadeSelecionada(prev => prev + 5)} className="p-2 bg-marieth rounded-[5px] border-nonr cursor-pointer text-white text-[0.9rem] hover:bg-verdeaceso">+5</button>
//                           <button onClick={() => setQuantidadeSelecionada(prev => prev + 10)} className="p-2 bg-marieth rounded-[5px] border-nonr cursor-pointer text-white text-[0.9rem] hover:bg-verdeaceso">+10</button>
//                         </div>
                        
//                         <div className="flex flex-col gap-4 my-4 mx-0">
//                           <label htmlFor="number">Ajustar
//                             <input 
//                               type="number" 
//                               name="number"
//                               id="number" 
//                               min={0}  
//                               step={0.5} 
//                               value={quantidadeSelecionada}
//                               onChange={(e) => setQuantidadeSelecionada(parseFloat(e.target.value))}
//                               className="text-4 p-2 border-[1px] border-solid border-tab rounded-[5px]" 
//                             />
//                           </label> 
//                           <p className="text-marieth font-bold">
//                             Total: {produto && quantidadeCarrinho * produto.preco} AOA
//                           </p>

//                           <label htmlFor="unidades">
//                             <select 
//                               title="unidades" 
//                               id="unidades"
//                               value={unidadeSelecionada}
//                               onChange={(e) => setUnidadeSelecionada(e.target.value)}
//                               className="text-4 p-2 border-[1px] border-solid border-tab rounded-[5px]" 
//                             >
//                               <option value="Tonelada">Toneladas</option>
//                               <option value="kg">Kilograma(kg)</option>
//                             </select>
//                           </label>
//                         </div>

//                         <div className="flex gap-4 justify-end cursor-pointer border-none">
//                           <button 
//                             className="bg-vermelho py-2 px-4 text-white rounded-[5px]" 
//                             onClick={() => setshowcaixa(false)}
//                           >
//                             Cancelar
//                           </button>
//                           <button 
//                             className="bg-marieth py-2 px-4 text-white rounded-[5px]"
//                             onClick={() => {
//                               if (quantidadeCarrinho < produto.quantidade) {
//                                 setQuantidadeCarrinho(prev => prev + 1);
//                                 setItemCarrinho({
//                                   id_produto: produto.id_produtos,
//                                   nome: produto.nome,
//                                   quantidade: quantidadeSelecionada,
//                                   Unidade: unidadeSelecionada,
//                                   precoTotal,
//                                 });
                                
//                                 setshowcaixa(false);
//                                 alert("Quantidade ajustada com sucesso");
//                               }
//                             }}
//                           >
//                             Confirmar
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   )} 
                
//                   <button
//                     onClick={async () => {
//                       if (quantidadeCarrinho <= 0) {
//                         alert("Escolha uma quantidade válida.");
//                         return;
//                       }

//                       if (!autenticado) {
//                         alert("É necessário estar autenticado para adicionar ao carrinho.");
//                         router.push("/login");
//                         return;
//                       }
                      
//                       handleAdicionarAoCarrinho();
//                     }}
//                     className="bg-marieth w-full py-2 px-1 border-none rounded-[5px] text-white text-[1.5rem] cursor-pointer transition-colors duration-300
//                     hover:bg-verdeaceso mb-2"
//                   >
//                     <div className="flex items-center justify-center mt-4 gap-2">
//                       <CgShoppingCart className="text-[1.8rem]" />
//                       Adicionar ao Carrinho
//                     </div>
//                   </button>

//                   {itemCarrinho && (
//                     <div className="bg-green-100 text-marieth p-4 rounded mt-4">
//                       <p>Adicionado ao carrinho:</p>
//                       <p>{itemCarrinho.quantidade} {itemCarrinho.Unidade} de {itemCarrinho.nome}</p>
//                       <p>Total: {itemCarrinho.precoTotal} AOA</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="mt-8 pt-8 border-t-[1px] border-solid border-tab">
//             <h2>Avaliações</h2>
//             <div className="flex gap-8 mb-4">
//               <div className="text-center">
//                 <div className="text-[1.5rem] text-marieth font-bold">{media.toFixed(1)}</div>
//                 <div>Média Geral</div>
//               </div>
//               <div className="text-center">
//                 <div className="text-[1.5rem] text-marieth font-bold">{total}</div>
//                 <div>Avaliações</div>
//               </div>
//               <div className="text-center">
//                 <div className="text-[1.5rem] text-marieth font-bold">{percentagem}%</div>
//                 <div>Recomendações</div>
//               </div>
//             </div>
            
//             <div className="mt-4 p-4 rounded-[10px] bg-back2">
//               <h3 className="mb-4 text-[1.2rem]">Avalie este Produto</h3>
//               <div className="flex gap-2 text-[1.5rem] cursor-pointer text-tab">
//                 {[1, 2, 3, 4, 5].map((num) =>
//                   notaSelecionada >= num ? (
//                     <FaStar
//                       key={num}
//                       className="text-yellow-500 hover:text-yellow-600 transition-colors duration-200"
//                       onClick={() => verificarLoginAntesDeAvaliar(num)}
//                     />
//                   ) : (
//                     <FaRegStar
//                       key={num}
//                       className="hover:text-yellow-500 transition-colors duration-200"
//                       onClick={() => verificarLoginAntesDeAvaliar(num)}
//                     />
//                   )
//                 )}
//               </div>
              
//               {mensagemSucesso && (
//                 <div className="bg-verdeaceso text-white p-3 rounded-md shadow-md mb-4 text-center">
//                   {mensagemSucesso}
//                 </div>
//               )}
//             </div>
//           </div>
//         </main>
//       </div>
//       <Footer/>
//     </div>
//   )
// }
"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Head from "next/head"
import { FaTrash } from "react-icons/fa6"
import Footer from "../../Components/Footer"
import Navbar from "../../Components/Navbar"
import Image from "next/image"
import { listarProdutosDoCarrinho } from "../../Services/cart"
import { atualizarQuantidadeProduto } from "../../Services/cart"
import { removerProdutoDoCarrinho } from "../../Services/cart"
import { finalizarCompra } from "../../Services/cart"
import { calcularPrecoProduto } from "../../Services/cart"

export default function Carrinho() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [quantidade, setQuantidade] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter()

  const [produtoSelecionado, setProdutoSelecionado] = useState<any>(null);

  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const dados = await listarProdutosDoCarrinho();
        console.log("Dados recebidos do carrinho:", dados); // Adiciona log para debug
        setProdutos(dados.produtos || []);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        setError("Falha ao carregar os produtos do carrinho");
      } finally {
        setLoading(false);
      }
    };

    carregarProdutos();
  }, []);

  const handleConfirmar = async () => {
    if (!produtoSelecionado) return;

    try {
      // Usando o id correto baseado na resposta da API
      const produtoId = produtoSelecionado.id_produtos || produtoSelecionado.id;
      await atualizarQuantidadeProduto(produtoId, quantidade);
      
      const dadosAtualizados = await listarProdutosDoCarrinho();
      setProdutos(dadosAtualizados.produtos || []);
      setshowcaixa(false);
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      setError("Falha ao atualizar a quantidade do produto");
    }
  };

  const handleRemover = async (id_produto: string) => {
    try {
      await removerProdutoDoCarrinho(id_produto);
      const dadosAtualizados = await listarProdutosDoCarrinho();
      setProdutos(dadosAtualizados.produtos || []);
    } catch (error) {
      console.log("Erro ao remover produto:", error);
      setError("Falha ao remover o produto do carrinho");
    }
  };

  const handleIncrementoRapido = (valor: number) => {
    setQuantidade((prevQuantidade) => {
      const novaQuantidade = prevQuantidade + valor;
      const max = produtoSelecionado?.quantidadeDisponivel || 999; // Fallback para um valor alto se não houver limite definido
      return novaQuantidade <= max ? novaQuantidade : max;
    });
  };

  const calcularSubtotal = () => {
    return produtos.reduce((total, produto) => {
      // Usando os campos corretos da API
      const preco = parseFloat(produto.preco || "0");
      const qtd = parseFloat(produto.quantidade || "1");
      return total + preco * qtd;
    }, 0);
  };

  const [freteTotal, setFreteTotal] = useState(0);
  const [comissaoTotal, setComissaoTotal] = useState(0);
  const [totalFinal, setTotalFinal] = useState(0);

  useEffect(() => {
    const calcularTotais = async () => {
      let total = calcularSubtotal();
      let frete = 0;
      let comissao = 0;

      try {
        // Aqui você pode implementar sua lógica de cálculo de frete e comissão
        // Se estiver usando a função calcularPrecoProduto
        for (const produto of produtos) {
          const produtoId = produto.id_produtos || produto.id;
          if (produtoId) {
            try {
              const resultado = await calcularPrecoProduto(produtoId, produto.quantidade);
              total = resultado.totalFinal || total;
              frete += resultado.frete || 0;
              comissao += resultado.comissao || 0;
            } catch (error: any) {
              console.log("Erro ao calcular preço do produto", error);
            }
          }
        }
      } catch (error) {
        console.log("Erro ao calcular totais:", error);
      }

      setTotalFinal(total);
      setFreteTotal(frete);
      setComissaoTotal(comissao);
    };

    if (produtos.length > 0) {
      calcularTotais();
    } else {
      // Resetar valores quando não há produtos
      setTotalFinal(0);
      setFreteTotal(0);
      setComissaoTotal(0);
    }
  }, [produtos]);

  const [showcaixa, setshowcaixa] = useState(false);

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

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <p className="text-center text-gray-500 text-lg">Carregando produtos...</p>
          ) : produtos.length === 0 ? (
            <p className="text-center text-gray-500 text-lg mt-8">Carrinho vazio. Nenhum produto adicionado.</p>
          ) : (
            produtos.map((produto) => (
              <div key={produto.id || produto.id_produtos} className="flex p-2 border-b-[1px]">
                <Image
                  src={produto.foto_produto || produto.imagem || "/placeholder-image.jpg"}
                  alt={produto.nome || "Produto"}
                  height={100}
                  width={100}
                  className="object-cover rounded-[5px]"
                />
                <div className="flex-1 py-0 px-4 ">
                  <h3 className="font-bold mb-2">{produto.nome || "Produto sem nome"}</h3>
                  <p className="font-bold text-marieth -mb-6">
                    Kzs {produto.preco || 0}/{" "}
                    <span>{produto.quantidade || 1}</span> {produto.Unidade || "un"}
                  </p>
                  <FaTrash
                    onClick={() => handleRemover(produto.id || produto.id_produtos)}
                    className=" ml-[60rem] mb-2 text-vermelho text-[1.2rem] cursor-pointer"
                  />
                  <button
                    className=" hover:bg-verdeaceso bg-marieth rounded-[5px] cursor-pointer text-white p-2 text-[0.9rem]"
                    onClick={() => {
                      setProdutoSelecionado(produto);
                      setQuantidade(parseFloat(produto.quantidade) || 1);
                      setshowcaixa(true);
                    }}
                  >
                    +/-
                  </button>
                </div>
              </div>
            ))
          )}

          {produtos.length > 0 && (
            <div className="mt-8 p-4 bg-white rounded-[10px] shadow-custom">
              <div className="flex justify-between border-b-[1px] border-solid border-tab py-2 px-0 " >
                <span>Subtotal:</span>
                <span>kzs {calcularSubtotal().toFixed(2)}</span>
              </div>

              <div className="flex justify-between border-b-[1px] border-solid border-tab py-2 px-0 " >
                <span>Transporte:</span>
                <span>kzs {(freteTotal + comissaoTotal).toFixed(2)}</span>
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
                    router.push("/enderecopedido");
                  } catch (error: any) {
                    console.log("Erro ao finalizar compra:", error);
                    alert(error.response?.data?.mensagem || "Erro ao finalizar a compra.");
                  }
                }}>
                Finalizar Compra
              </button>
            </div>
          )}
        </div>

        {showcaixa && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="min-w-[300px] bg-white shadow-custom rounded-[10px] p-8" >
              <h2 className="font-bold text-2xl mb-4">Alterar Quantidade</h2>

              <div className="mb-4 gap-2 grid grid-cols-2">
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
                    min={0.1}
                    max={produtoSelecionado?.quantidadeDisponivel || 999}
                    value={quantidade}
                    onChange={(e) => {
                      const novaQuantidade = parseFloat(e.target.value);
                      if (!isNaN(novaQuantidade) && novaQuantidade > 0) {
                        setQuantidade(novaQuantidade);
                      }
                    }}
                    step={0.1}
                    className="text-4 p-2 border-[1px] border-solid border-tab rounded-[5px] w-full"
                  />
                  <p className="text-gray-500 text-sm">
                    Unidade: {produtoSelecionado?.Unidade || "un"}
                  </p>
                </label>

                <label htmlFor="verduras">
                  <select title="verduras" className="text-4 p-2 border-[1px] border-solid border-tab rounded-[5px] w-full">
                    <option value="Toneladas">Toneladas</option>
                    <option value="kg">Kilograma</option>
                  </select>
                </label>
              </div>

              <div className="flex gap-4 justify-end cursor-pointer border-none">
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