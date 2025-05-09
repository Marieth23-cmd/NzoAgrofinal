"use client"
import React from 'react';
import Head from "next/head";
import Image from "next/image";
import { AiFillHome } from "react-icons/ai";
import { CiLocationOn } from "react-icons/ci";
import { FaRegStar } from "react-icons/fa";
import { useParams, useRouter } from "next/navigation";
import { FaRegStarHalfStroke } from "react-icons/fa6";
import { CgShoppingCart } from "react-icons/cg";
import Footer from "../../Components/Footer";
import Navbar from "../../Components/Navbar";
import { useState, useEffect } from "react";
import { getProdutoById } from "../../Services/produtos";
import { verificarAuth } from "../../Services/auth";
import { buscarMediaEstrelas } from "../../Services/avaliacoes";
import { enviarAvaliacao } from "../../Services/avaliacoes";
import { FaStar } from "react-icons/fa";
import { adicionarProdutoAoCarrinho } from '@/app/Services/cart';

export default function DetalhesProduto(){
  const { produtoId } = useParams() as { produtoId: string };
  const router = useRouter();

  // Estados principais
  const [showcaixa, setshowcaixa] = useState(false);
  const [autenticado, setAutenticado] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);
  const [quantidadeSelecionada, setQuantidadeSelecionada] = useState<number>(1); // Iniciar com 1
  const [unidadeSelecionada, setUnidadeSelecionada] = useState<string>("");

  // Estados de avaliação
  const [media, setMedia] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [percentagem, setPercentagem] = useState<number>(0);
  const [notaSelecionada, setNotaSelecionada] = useState<number>(0);

  type Produto = {
    id_produtos: number;
    nome: string;
    provincia: string;
    foto_produto?: string;
    preco: number;
    Unidade: string;
    quantidade: number;
  };
  
  const [produto, setProduto] = useState<Produto | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<{ [key: number]: number | null }>({});
  const [precoTotal, setPrecoTotal] = useState(0);
  
  // Verificar autenticação quando o componente montar
  useEffect(() => {
    const verificarLogin = async () => {
      try {
        await verificarAuth();
        setAutenticado(true);
      } catch (error) {
        setAutenticado(false);
      }
    };
    
    verificarLogin();
  }, []);
  
  // Buscar dados do produto
  useEffect(() => {
    if (!produtoId) return;

    const fetchProduto = async () => {
      try {
        const data = await getProdutoById(Number(produtoId));
        setProduto(data);
        setUnidadeSelecionada(data.Unidade);

        const mediaResult = await buscarMediaEstrelas(data.id_produtos);
        setAvaliacoes({ [data.id_produtos]: mediaResult?.media_estrelas || null });
      } catch (error) {
        console.log("Erro ao buscar produto:", error);
      }
    };

    fetchProduto();
  }, [produtoId]);

  // Buscar avaliações
  useEffect(() => {
    if (!produtoId) return;

    const carregarDados = async () => {
      try {
        const resultado = await buscarMediaEstrelas(Number(produtoId));
        setMedia(resultado.media || 0);
        setTotal(resultado.total || 0);
        setPercentagem(resultado.recomendacoes || 0);
      } catch (error) {
        console.log("Erro ao carregar dados:", error);
      }
    };

    carregarDados();
  }, [produtoId]);

  // Calcular preço total baseado na quantidade
  useEffect(() => {
    if (produto) {
      setPrecoTotal(produto.preco * quantidadeSelecionada);
    }
  }, [produto, quantidadeSelecionada]);

  // Função para avaliar produtos
  const handleAvaliar = async (nota: number) => {
    if (!autenticado) {
      alert("Você precisa estar logado para avaliar.");
      return;
    }
  
    if (!produtoId) {
      alert("ID do produto não encontrado.");
      return;
    }
  
    try {
      // Converter produtoId para número com segurança
      const idProdutoNumerico = Number(produtoId);
      if (isNaN(idProdutoNumerico)) {
        throw new Error("ID do produto inválido");
      }
      
      // Enviar avaliação
      await enviarAvaliacao(idProdutoNumerico, nota);
      
      // Atualizar UI após sucesso
      setNotaSelecionada(nota);
      
      // Recarregar dados de avaliação
      const resultado = await buscarMediaEstrelas(idProdutoNumerico);
      setMedia(resultado.media || 0);
      setTotal(resultado.total || 0);
      setPercentagem(resultado.recomendacoes || 0);
      
      // Mostrar mensagem de sucesso
      setMensagemSucesso("Avaliação enviada com sucesso!");
      setTimeout(() => {
        setMensagemSucesso(null);
      }, 3000);
  
    } catch (error: any) {
      console.log("Erro detalhado ao avaliar:", error);
      alert(error.mensagem || "Erro ao enviar avaliação. Tente novamente.");
    }
  };

  // Verificar login antes de avaliar
  const verificarLoginAntesDeAvaliar = async (nota: number) => {
    try {
      if (!autenticado) {
        try {
          await verificarAuth();
          setAutenticado(true);
        } catch (error:any) {
          alert(error.mensagem || "Você precisa estar logado para avaliar.");
          router.push("/login");
          return;
        }
      }
      
      await handleAvaliar(nota);
    } catch (error) {
      console.log("Erro ao verificar login:", error);
      alert("Ocorreu um erro. Por favor, tente novamente.");
    }
  };
  
  // Exibir popup de ajuste de quantidade
  const handleBotaoMaisMenos = async () => {
    if (!autenticado) {
      alert("Você precisa estar logado para adicionar ao carrinho.");
      router.push("/login");
      return;
    }

    try {
      await verificarAuth();
      setAutenticado(true);
      setshowcaixa(true);  
    } catch (error) {
      setAutenticado(false);
      alert("Você precisa estar logado para adicionar ao carrinho.");
      router.push("/login");
    }
  };
  const handleAdicionarAoCarrinho = async () => {
    try {
      // Verificar se o produto existe e tem um ID válido
      if (!produto) {
        alert("Erro: Produto não encontrado.");
        return;
      }
      
      // Verificar explicitamente se id_produtos existe
      if (produto.id_produtos === undefined || produto.id_produtos === null) {
        alert("Erro: ID do produto não encontrado.");
        return;
      }
  
      // Verificar se a quantidade é válida
      if (quantidadeSelecionada <= 0) {
        alert("Por favor, selecione uma quantidade válida.");
        return;
      }
      
      // Verificar se não excede o estoque
      if (quantidadeSelecionada > produto.quantidade) {
        alert("Quantidade selecionada maior que o disponível.");
        return;
      }
    
      const idString = String(produto.id_produtos);
      
      // Adicionar ao carrinho usando o ID seguro
      await adicionarProdutoAoCarrinho(
        idString,
        quantidadeSelecionada
      );
      
      setMensagemSucesso("Produto adicionado ao carrinho com sucesso!");
      setTimeout(() => {
        setMensagemSucesso(null);
      }, 3000);
    } catch (error: any) {
      alert(error.mensagem || "Erro ao adicionar ao carrinho.");
      console.log("Erro completo:", error);
    }
  };

  if (!produto) {
    return <div>Carregando...</div>; 
  }

  return(
    <div>
      <Head>
        <title>Detalhes do Produto</title>
      </Head>
      <Navbar/>
      <div className="mb-20 mt-[15%]">
        <main className="max-w-[1200px] my-8 mx-auto bg-white p-8 shadow-custom rounded-[10px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <Image 
                src={produto.foto_produto || "/default-image.jpg"} 
                alt={produto.nome} 
                width={500} 
                height={400}  
                className="flex w-full h-[400px] rounded-[10px] items-center justify-center 
                text-[3rem] text-cortime bg-pretobranco" 
              />
            </div>

            <div>
              <div className="flex gap-6 flex-col">
                <h1 className="text-[2rem] text-profile font-bold">{produto.nome}</h1>

                <div className="flex gap-2 text-[1.5rem] cursor-pointer text-tab">
                  {avaliacoes[produto.id_produtos] ? (
                    <>
                      {[1, 2, 3, 4, 5].map((i) =>
                        i <= Math.floor(avaliacoes[produto.id_produtos]!) ? (
                          <FaStar key={i} className="text-amarela" />
                        ) : i - 0.5 === avaliacoes[produto.id_produtos] ? (
                          <FaRegStarHalfStroke key={i} className="text-amarela" />
                        ) : (
                          <FaRegStarHalfStroke key={i} className="text-gray-300" />
                        )
                      )}
                      <span className="text-amarela -mt-[4px] ml-2">
                        ({avaliacoes[produto.id_produtos]?.toFixed(1)})
                      </span>
                    </>
                  ) : (
                    <p className="text-gray-500 text-sm">Sem avaliações</p>
                  )}                      
                </div>
                
                <div className="text-[1.8rem] font-bold text-marieth">
                  <span>{produto.preco}AOA/</span> 
                  <span>{produto.quantidade}{produto.Unidade}</span>
                </div>

                <div>
                  <button 
                    className="hover:bg-verdeaceso bg-marieth rounded-[5px] cursor-pointer text-white p-2 text-[0.9rem] border-none bottom-4 mb-4"
                    onClick={handleBotaoMaisMenos}
                  >
                    + / -
                  </button>
              
                  <div className="flex items-center gap-4 p-4 mb-2 rounded-[10px] bg-pretobranco">
                    <div className="flex w-[60px] h-[60px] rounded-[50%] items-center justify-center bg-back">
                      <AiFillHome/>
                    </div>
                    <div>
                      <h3>{produto.nome}</h3>
                      <div className="flex items-center gap-2 text-cortexto">
                        <CiLocationOn/>
                        <span>{produto.provincia}</span>
                        <span>/Angola</span>
                      </div>
                    </div>
                  </div>
                
                  {showcaixa && (
                    <div className="flex items-center">
                      <div className="top-[30%] left-[70%] min-w-[300px] bg-white shadow-custom rounded-[10px] p-8 absolute z-10">
                        <h2 className="font-bold text-2xl mb-4">Alterar Quantidade</h2>
                        
                        <div className="mb-4 gap-2 grid grid-cols-2">
                          <button onClick={() => setQuantidadeSelecionada(prev => prev + 0.5)} className="p-2 bg-marieth rounded-[5px] border-none cursor-pointer text-white text-[0.9rem] hover:bg-verdeaceso">+0.5</button>
                          <button onClick={() => setQuantidadeSelecionada(prev => prev + 1)} className="p-2 bg-marieth rounded-[5px] border-none cursor-pointer text-white text-[0.9rem] hover:bg-verdeaceso">+1</button>
                          <button onClick={() => setQuantidadeSelecionada(prev => prev + 5)} className="p-2 bg-marieth rounded-[5px] border-none cursor-pointer text-white text-[0.9rem] hover:bg-verdeaceso">+5</button>
                          <button onClick={() => setQuantidadeSelecionada(prev => prev + 10)} className="p-2 bg-marieth rounded-[5px] border-none cursor-pointer text-white text-[0.9rem] hover:bg-verdeaceso">+10</button>
                        </div>
                        
                        <div className="flex flex-col gap-4 my-4 mx-0">
                          <label htmlFor="number">Ajustar
                            <input 
                              type="number" 
                              name="number"
                              id="number" 
                              min={0.5}  
                              step={0.5} 
                              value={quantidadeSelecionada}
                              onChange={(e) => setQuantidadeSelecionada(parseFloat(e.target.value) || 0.5)}
                              className="text-4 p-2 border-[1px] border-solid border-tab rounded-[5px] w-full" 
                            />
                          </label> 
                          <p className="text-marieth font-bold">
                            Total: {(produto.preco * quantidadeSelecionada).toFixed(2)} AOA
                          </p>

                          <label htmlFor="unidades">
                            <select 
                              title="unidades" 
                              id="unidades"
                              value={unidadeSelecionada}
                              onChange={(e) => setUnidadeSelecionada(e.target.value)}
                              className="text-4 p-2 border-[1px] border-solid border-tab rounded-[5px] w-full" 
                            >
                              <option value="Tonelada">Toneladas</option>
                              <option value="kg">Kilograma(kg)</option>
                            </select>
                          </label>
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
                            onClick={() => {
                              if (quantidadeSelecionada <= 0) {
                                alert("Por favor, selecione uma quantidade válida.");
                                return;
                              }
                              
                              if (quantidadeSelecionada > produto.quantidade) {
                                alert("Quantidade selecionada maior que o disponível.");
                                return;
                              }
                              
                              setshowcaixa(false);
                              setMensagemSucesso("Quantidade ajustada com sucesso!");
                              setTimeout(() => {
                                setMensagemSucesso(null);
                              }, 3000);
                            }}
                          >
                            Confirmar
                          </button>
                        </div>
                      </div>
                    </div>
                  )} 
                
                <button
                  onClick={async () => {
                    if (!autenticado) {
                      alert("É necessário estar autenticado para adicionar ao carrinho.");
                      router.push("/login");
                      return;
                    }
                    
                    handleAdicionarAoCarrinho();
                  }}
                  className="bg-marieth w-full py-2 px-1 border-none mt-4 rounded-[5px] text-white text-[1.5rem] cursor-pointer transition-colors duration-300
                  hover:bg-verdeaceso mb-2"
                >
                  <div className="flex items-center justify-center gap-2">
                    <CgShoppingCart className="text-[1.8rem]" />
                    Adicionar ao Carrinho
                  </div>
                </button>

                {mensagemSucesso && (
                  <div className="bg-green-100 text-marieth p-4 rounded mt-4">
                    <p>{mensagemSucesso}</p>
                    {mensagemSucesso.includes("carrinho") && (
                      <>
                        <p>{quantidadeSelecionada} {unidadeSelecionada} de {produto.nome}</p>
                        <p>Total: {(produto.preco * quantidadeSelecionada).toFixed(2)} AOA</p>
                      </>
                    )}
                  </div>
                )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t-[1px] border-solid border-tab">
            <h2>Avaliações</h2>
            <div className="flex gap-8 mb-4">
              <div className="text-center">
                <div className="text-[1.5rem] text-marieth font-bold">{media.toFixed(1)}</div>
                <div>Média Geral</div>
              </div>
              <div className="text-center">
                <div className="text-[1.5rem] text-marieth font-bold">{total}</div>
                <div>Avaliações</div>
              </div>
              <div className="text-center">
                <div className="text-[1.5rem] text-marieth font-bold">{percentagem}%</div>
                <div>Recomendações</div>
              </div>
            </div>
            
            <div className="mt-4 p-4 rounded-[10px] bg-back2">
              <h3 className="mb-4 text-[1.2rem]">Avalie este Produto</h3>
              <div className="flex gap-2 text-[1.5rem] cursor-pointer text-tab">
                {[1, 2, 3, 4, 5].map((num) =>
                  notaSelecionada >= num ? (
                    <FaStar
                      key={num}
                      className="text-yellow-500 hover:text-yellow-600 transition-colors duration-200"
                      onClick={() => verificarLoginAntesDeAvaliar(num)}
                    />
                  ) : (
                    <FaRegStar
                      key={num}
                      className="hover:text-yellow-500 transition-colors duration-200"
                      onClick={() => verificarLoginAntesDeAvaliar(num)}
                    />
                  )
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer/>
    </div>
  )
}