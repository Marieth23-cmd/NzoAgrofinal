"use client"
import React, { useState, useEffect } from 'react';
import Head from "next/head";
import Image from "next/image";
import { AiFillHome } from "react-icons/ai";
import { CiLocationOn } from "react-icons/ci";
import { FaStar, FaPaperPlane } from "react-icons/fa";
import { useParams, useRouter } from "next/navigation";
import { FaRegStarHalfStroke } from "react-icons/fa6";
import { CgShoppingCart } from "react-icons/cg";
import Footer from "../../Components/Footer";
import Navbar from "../../Components/Navbar";
import { getProdutoById } from "../../Services/produtos";
import { verificarAuth } from "../../Services/auth";
import { buscarMediaEstrelas, enviarAvaliacao } from "../../Services/avaliacoes";
import { adicionarProdutoAoCarrinho , listarProdutosDoCarrinho } from '@/app/Services/cart';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function DetalhesProduto(){
  const { produtoId } = useParams() as { produtoId: string };
  const router = useRouter();

  // Estados principais
  const [showcaixa, setshowcaixa] = useState(false);
  const [autenticado, setAutenticado] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);
  const [quantidadeSelecionada, setQuantidadeSelecionada] = useState<number>(1);
  const [unidadeSelecionada, setUnidadeSelecionada] = useState<string>("");

  // Avaliações
  const [media, setMedia] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [percentagem, setPercentagem] = useState<number>(0);
  const [notaSelecionada, setNotaSelecionada] = useState<number>(0);
  const [notaTemporaria, setNotaTemporaria] = useState<number>(0);
  const [avaliacaoRealizada, setAvaliacaoRealizada] = useState<boolean>(false);

  // Carregamento
  const [carregando, setCarregando] = useState<boolean>(true);
  const [carregandoAvaliacoes, setCarregandoAvaliacoes] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  // Estados do carrinho
  const [produtosNoCarrinho, setProdutosNoCarrinho] = useState<number[]>([]);
  const [carregandoCarrinho, setCarregandoCarrinho] = useState(false);

  type Produto = {
    id_produtos: number;
    nome: string;
    provincia: string;
    foto_produto?: string;
    preco: number;
    Unidade: string;
    quantidade: number;
    peso_kg: number;
    idUsuario: number;
  };

  const [produto, setProduto] = useState<Produto | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<{ [key: number]: number | null }>({});
  const [precoTotal, setPrecoTotal] = useState(0);
  const [usuario, setUsuario] = useState<{id_usuario: number, nome: string, tipo_usuario?: string} | null>(null);

  // Carregar produtos do carrinho do usuário
  const carregarProdutosNoCarrinho = async () => {
    if (!autenticado) {
      setProdutosNoCarrinho([]);
      return;
    }
    setCarregandoCarrinho(true);
    try {
      const dados = await listarProdutosDoCarrinho();
      let ids: number[] = [];
      if (dados) {
        if (Array.isArray(dados.produtos)) {
          ids = dados.produtos.map((p: any) => Number(p.id_produtos || p.id));
        } else if (Array.isArray(dados.itens)) {
          ids = dados.itens.map((p: any) => Number(p.id_produtos || p.id));
        }
      }
      setProdutosNoCarrinho(ids);
    } catch (err) {
      setProdutosNoCarrinho([]);
    } finally {
      setCarregandoCarrinho(false);
    }
  };

  // Verificar se produto já está no carrinho
  const jaNoCarrinho = produtoId ? produtosNoCarrinho.includes(Number(produtoId)) : false;

  useEffect(() => {
    const verificarLogin = async () => {
      try {
        const user = await verificarAuth();
        setAutenticado(!!user);
        setUsuario(user ? {
          id_usuario: Number(user.id_usuario) || 0,
          nome: user.nome || '',
          tipo_usuario: user.tipo_usuario || ''
        } : null);
      } catch {
        setAutenticado(false);
        setUsuario(null);
      }
    };
    verificarLogin();
  }, []);

  // Carregar produtos do carrinho quando usuário estiver autenticado
  useEffect(() => {
    if (autenticado) {
      carregarProdutosNoCarrinho();
    }
  }, [autenticado]);

  // Buscar avaliações do produto
  useEffect(() => {
    if (!produtoId) return;
    setCarregandoAvaliacoes(true);
    buscarMediaEstrelas(Number(produtoId)).then(res => {
      setMedia(res.media_estrelas || 0);
      setTotal(res.total || 0);
      setPercentagem(res.recomendacoes || 0);
      setAvaliacoes((prev) => ({
        ...prev,
        [Number(produtoId)]: res.media_estrelas || null
      }));
    }).finally(() => setCarregandoAvaliacoes(false));
  }, [produtoId, avaliacaoRealizada]);

  // Função para selecionar estrela temporariamente
  const handleSelecionarEstrela = (nota: number) => {
    if (!autenticado) {
      toast.warn("Você precisa estar logado para avaliar.");
      router.push("/login");
      return;
    }
    setNotaTemporaria(nota);
  };

  // Função para enviar avaliação
  const handleEnviarAvaliacao = async () => {
    if (!autenticado) {
      toast.warn("Você precisa estar logado para avaliar.");
      router.push("/login");
      return;
    }
    if (!produtoId || notaTemporaria === 0) {
      toast.warn(notaTemporaria === 0 ? "Selecione uma nota para avaliar." : "ID do produto não encontrado.");
      return;
    }
    try {
      await enviarAvaliacao(Number(produtoId), notaTemporaria);
      setNotaSelecionada(notaTemporaria);
      setNotaTemporaria(0);
      setAvaliacaoRealizada(true);
      toast.success("Avaliação enviada com sucesso!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao enviar avaliação. Tente novamente.");
    }
  };

  // Buscar dados do produto
  useEffect(() => {
    if (!produtoId) return;
    const fetchProduto = async () => {
      setCarregando(true);
      try {
        const data = await getProdutoById(Number(produtoId));
        setProduto({
          ...data,
          idUsuario: Number(data.idUsuario) || 0
        });
        setQuantidadeSelecionada(data.quantidade ?? 1);
        setUnidadeSelecionada(data.Unidade ?? "");
      } catch {
        setErro("Não foi possível carregar o produto");
      } finally {
        setCarregando(false);
      }
    };
    fetchProduto();
  }, [produtoId]);

  // Recalcula preço total
  useEffect(() => {
    if (produto) setPrecoTotal(produto.preco * quantidadeSelecionada);
  }, [produto, quantidadeSelecionada]);

  // Modal: botões de ajuste
  const handleBotaoMaisMenos = async () => {
    if (!autenticado) {
      toast.warn("Você precisa estar logado para adicionar ao carrinho.");
      router.push("/login");
      return;
    }
    if (jaNoCarrinho) {
      toast.info("Este produto já está no seu carrinho.");
      return;
    }
    setshowcaixa(true);
  };

  // Adicionar ao carrinho
  const handleAdicionarAoCarrinho = async () => {
    if (!produto || !produtoId) {
      toast.error("Produto não encontrado.");
      return;
    }

    if (jaNoCarrinho) {
      toast.info("Este produto já está no seu carrinho.");
      return;
    }

    const idProdutoNumerico = Number(produtoId);
    if (isNaN(idProdutoNumerico)) {
      toast.error("ID do produto inválido.");
      return;
    }

    const quantidadeParaEnviar = quantidadeSelecionada;
    const unidadeParaEnviar = unidadeSelecionada || produto.Unidade;

    if (quantidadeParaEnviar <= 0) {
      toast.error("Por favor, selecione uma quantidade válida.");
      return;
    }
    if (quantidadeParaEnviar > produto.quantidade) {
      toast.error("Quantidade selecionada maior que o disponível.");
      return;
    }

    try {
      await adicionarProdutoAoCarrinho(
        idProdutoNumerico,
        quantidadeParaEnviar,
        unidadeParaEnviar,
        produto.peso_kg,
        produto.preco
      );
      toast.success("Produto adicionado ao carrinho com sucesso!");
      setMensagemSucesso(`Produto adicionado ao carrinho: ${quantidadeParaEnviar} ${unidadeParaEnviar} de ${produto.nome} - Total: ${Number(produto.preco * quantidadeParaEnviar).toFixed(2)} AOA`);
      setTimeout(() => setMensagemSucesso(null), 5000);
      
      // Atualizar lista do carrinho após adicionar
      await carregarProdutosNoCarrinho();
    } catch (error: any) {
      toast.error(error?.message || error?.mensagem || "Erro ao adicionar produto ao carrinho. Tente novamente.");
    }
  };

  // Verifica se o usuário é dono do produto
  const isOwner = () => {
    const userID = Number(usuario?.id_usuario) || 0;
    const ownerID = Number(produto?.idUsuario) || 0;
    return userID > 0 && ownerID > 0 && userID === ownerID;
  };

  // Renderização para carregamento/erro
  if (carregando) {
    return (
      <div>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-marieth"></div>
        </div>
        <Footer />
      </div>
    );
  }
  if (erro || !produto) {
    return (
      <div>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="text-center p-8 bg-white shadow-custom rounded-[10px]">
            <h2 className="text-vermelho text-xl font-bold mb-4">Erro ao carregar produto</h2>
            <p>{erro || "Produto não encontrado"}</p>
            <button 
              onClick={() => router.push("/")}
              className="mt-4 bg-marieth hover:bg-verdeaceso text-white py-2 px-4 rounded"
            >
              Voltar à página inicial
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const userIsOwner = isOwner();

  return (
    <div>
      <Head>
        <title>Detalhes do Produto</title>
      </Head>
      <Navbar/>
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="mb-20 mt-[45%] lg:mt-[15%]">
        <main className="max-w-[1200px] my-8 mx-auto bg-white p-4 lg:p-8 shadow-custom rounded-[10px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
            <div>
              <Image
                src={produto.foto_produto || "/default-image.jpg"}
                alt={produto.nome}
                width={500}
                height={400}
                className="flex w-full h-[300px] lg:h-[400px] rounded-[10px] items-center justify-center text-[3rem] text-cortime bg-pretobranco"
              />
            </div>
            <div>
              <div className="flex gap-4 lg:gap-6 flex-col">
                <h1 className="text-[1.5rem] lg:text-[2rem] text-profile font-bold">{produto.nome}</h1>
                <div className="flex gap-2 text-[1.2rem] lg:text-[1.5rem] cursor-pointer text-tab">
                  {/* ...Avaliacao... */}
                </div>
                <div className="text-[1.4rem] lg:text-[1.8rem] font-bold text-marieth">
                  <span>{produto.preco} AOA/{produto.quantidade}{produto.Unidade}</span> 
                </div>
                <div className="text-[1rem] lg:text-[1.4rem] font-bold text-profile">
                  <span>Peso: {produto.peso_kg}kg</span>
                </div>
                <div>
                  {autenticado ? (
                    userIsOwner ? (
                      <div className="mt-4 text-vermelho font-bold text-center">Você é o dono deste produto!</div>
                    ) : (
                      <>
                        <button 
                          className={`hover:bg-verdeaceso rounded-[5px] cursor-pointer text-white p-2 text-[0.9rem] border-none bottom-4 mb-4 ${
                            jaNoCarrinho ? 'bg-gray-400 cursor-not-allowed' : 'bg-marieth'
                          }`}
                          onClick={handleBotaoMaisMenos}
                          disabled={jaNoCarrinho || carregandoCarrinho}
                        >
                          {jaNoCarrinho ? "Já no Carrinho" : "Alterar Quantidade"}
                        </button>
                      </>
                    )
                ) : (
                  <>
                    <button 
                      className="hover:bg-verdeaceso bg-marieth rounded-[5px] cursor-pointer text-white p-2 text-[0.9rem] border-none bottom-4 mb-4"
                      onClick={() => router.push("/login")}
                    >
                      Faça login para comprar
                    </button>
                    <div className="flex items-center gap-4 p-3 lg:p-4 mb-2 rounded-[10px] bg-pretobranco">
                      <div className="flex w-[50px] h-[50px] lg:w-[60px] lg:h-[60px] rounded-[50%] items-center justify-center bg-back">
                        <AiFillHome />
                      </div>
                      <div>
                        <h3>{produto.nome}</h3>
                        <div className="flex items-center gap-2 text-cortexto text-sm lg:text-base">
                          <CiLocationOn />
                          <span>{produto.provincia}</span>
                          <span>/Angola</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                  {showcaixa && (
                    <div className="flex items-center justify-center fixed inset-0 bg-black bg-opacity-50 z-50">
                      <div className="bg-white shadow-custom rounded-[10px] p-4 lg:p-8 w-[90%] max-w-[400px] m-auto">
                        <h2 className="font-bold text-xl lg:text-2xl mb-4">Alterar Quantidade</h2>
                        <div className="mb-4 gap-2 grid grid-cols-2">
                          <button onClick={() => setQuantidadeSelecionada(prev => Math.max(0.5, prev + 0.5))} className="p-2 bg-marieth rounded-[5px] border-none cursor-pointer text-white text-[0.9rem] hover:bg-verdeaceso">+0.5</button>
                          <button onClick={() => setQuantidadeSelecionada(prev => Math.max(1, prev + 1))} className="p-2 bg-marieth rounded-[5px] border-none cursor-pointer text-white text-[0.9rem] hover:bg-verdeaceso">+1</button>
                          <button onClick={() => setQuantidadeSelecionada(prev => Math.max(5, prev + 5))} className="p-2 bg-marieth rounded-[5px] border-none cursor-pointer text-white text-[0.9rem] hover:bg-verdeaceso">+5</button>
                          <button onClick={() => setQuantidadeSelecionada(prev => Math.max(10, prev + 10))} className="p-2 bg-marieth rounded-[5px] border-none cursor-pointer text-white text-[0.9rem] hover:bg-verdeaceso">+10</button>
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
                            Total: {Number(produto.preco * quantidadeSelecionada).toFixed(2)} AOA
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
                                toast.error("Por favor, selecione uma quantidade válida.");
                                return;
                              }
                              if (quantidadeSelecionada > produto.quantidade) {
                                toast.error("Quantidade selecionada maior que o disponível.");
                                return;
                              }
                              setshowcaixa(false);
                              toast.success("Quantidade ajustada com sucesso!");
                            }}
                          >
                            Confirmar
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  {autenticado && !userIsOwner && (
                    <button
                      onClick={handleAdicionarAoCarrinho}
                      className={`w-full py-2 px-4 border-none mt-4 rounded-[5px] text-white text-sm md:text-base lg:text-lg cursor-pointer transition-colors duration-300 mb-2 flex items-center justify-center gap-2 h-10 md:h-12 ${
                        jaNoCarrinho
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-marieth hover:bg-verdeaceso'
                      }`}
                      disabled={jaNoCarrinho || carregandoCarrinho}
                    >
                      <CgShoppingCart className="text-lg md:text-xl" />
                      <span>
                        {jaNoCarrinho ? "Já está no Carrinho" : "Adicionar ao Carrinho"}
                      </span>
                    </button>
                  )}
                  {mensagemSucesso && (
                    <div className="bg-green-100 text-marieth p-4 rounded mt-4">
                      <p>{mensagemSucesso}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* AVALIAÇÕES */}
          <div className="mt-8 pt-8 border-t-[1px] border-solid border-tab">
            <h2>Avaliações</h2>
            <div className="flex flex-wrap gap-4 lg:gap-8 mb-4">
              <div className="text-center">
                <div className="text-[1.3rem] lg:text-[1.5rem] text-marieth font-bold">{media.toFixed(1)}</div>
                <div className="text-sm lg:text-base">Média Geral</div>
              </div>
              <div className="text-center">
                <div className="text-[1.3rem] lg:text-[1.5rem] text-marieth font-bold">{total}</div>
                <div className="text-sm lg:text-base">Avaliações</div>
              </div>
              <div className="text-center">
                <div className="text-[1.3rem] lg:text-[1.5rem] text-marieth font-bold">{percentagem}%</div>
                <div className="text-sm lg:text-base">Recomendações</div>
              </div>
            </div>
            <div className="mt-4 p-4 rounded-[10px] bg-back2">
              <h3 className="mb-4 text-[1.1rem] lg:text-[1.2rem]">Avalie este Produto</h3>
              <div className="flex items-center gap-2">
                <div className="flex gap-2 text-[1.3rem] lg:text-[1.5rem] cursor-pointer text-tab">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <FaStar
                      key={num}
                      className={notaTemporaria >= num ? "text-yellow-500" : "text-gray-300"}
                      onClick={() => handleSelecionarEstrela(num)}
                    />
                  ))}
                </div>
                <button
                  onClick={handleEnviarAvaliacao}
                  className={`ml-4 ${notaTemporaria === 0 ? 'bg-gray-400' : 'bg-marieth hover:bg-verdeaceso'} text-white rounded-full p-2 flex items-center justify-center`}
                  title="Enviar avaliação"
                  disabled={notaTemporaria === 0}
                >
                  <FaPaperPlane className="text-lg" />
                </button>
              </div>
              {notaSelecionada > 0 && (
                <div className="mt-2 text-marieth">
                  Sua avaliação: {notaSelecionada} {notaSelecionada === 1 ? 'estrela' : 'estrelas'}
                </div>
              )}
            </div>
          </div>

        </main>
      </div>
      <Footer/>
    </div>
  )
}