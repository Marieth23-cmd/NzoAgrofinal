"use client"
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Image from "next/image";
import Link from "next/link";
import { FaRegStarHalfStroke } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";
import { useState, useEffect } from "react";
import { getProdutos } from "../Services/produtos";
import { buscarMediaEstrelas } from "../Services/avaliacoes";
import { getUsuarioById } from "../Services/user";
import { adicionarProdutoAoCarrinho, listarProdutosDoCarrinho } from "../Services/cart";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { verificarAuth } from "../Services/auth";
import { CgShoppingCart } from "react-icons/cg";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Vitrine() {

interface usuario{
  id_usuario:number;
  nome:string ;
  tipo_usuario?:string;
  email?:string;
}




  interface Produto {
    id_produtos: number;
    nome: string;
    foto_produto: string;
    quantidade: number;
    Unidade: string;
    preco: number;
    idUsuario: number;
    peso_kg: number;
  }

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [avaliacoes, setAvaliacoes] = useState<{ [key: number]: number | null }>({});
  const [verMaisClicado, setVerMaisClicado] = useState(false);
  const [usuario, setUsuario] = useState<usuario | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [carregandoAvaliacoes, setCarregandoAvaliacoes] = useState(true);
  const [erroAvaliacoes, setErroAvaliacoes] = useState("");
  const [autenticado, setAutenticado] = useState(false);

  // Novo: Guarda os IDs dos produtos já no carrinho
  const [produtosNoCarrinho, setProdutosNoCarrinho] = useState<number[]>([]);
  const [carregandoCarrinho, setCarregandoCarrinho] = useState(false);

  // Carregar produtos do carrinho do usuário
  const carregarProdutosNoCarrinho = async () => {
    if (!autenticado) {
      setProdutosNoCarrinho([]);
      return;
    }
    setCarregandoCarrinho(true);
    try {
      const dados = await listarProdutosDoCarrinho();
      // Supondo que a resposta tem array "produtos" ou "itens"
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

  useEffect(() => {
    async function fetchProdutos() {
      try {
        const data = await getProdutos();
        const produtosFormatados = data.map((produto: any) => ({
          ...produto,
          idUsuario: Number(produto.idUsuario) || 0
        }));
        setProdutos(produtosFormatados);
        setCarregando(false);

        // Buscar avaliações para cada produto
        setCarregandoAvaliacoes(true);
        const avaliacaoData: { [key: number]: number | null } = {};
        for (const produto of data) {
          try {
            const media = await buscarMediaEstrelas(produto.id_produtos);
            avaliacaoData[produto.id_produtos] = media?.media_estrelas || null;
          } catch (error) {
            avaliacaoData[produto.id_produtos] = null;
          }
        }
        setAvaliacoes(avaliacaoData);
        setCarregandoAvaliacoes(false);
      } catch (error: any) {
        setErro(error.mensagem || "Erro ao carregar produtos");
        setCarregando(false);
      }
    }
    fetchProdutos();
  }, []);

  useEffect(() => {
    const verificarLogin = async () => {
      try {
        const user = await verificarAuth();
        if (!user || typeof user !== 'object') {
          setAutenticado(false);
          setUsuario(null);
          return;
        }
        setAutenticado(true);
       
      } catch (error: any) {
        setAutenticado(false);
        setUsuario(null);
      }
    };
    verificarLogin();
  }, []);

  // Carrega carrinho assim que autentica
  useEffect(() => {
    if (autenticado) carregarProdutosNoCarrinho();
  }, [autenticado]);

  // Quando adiciona um produto, recarrega os produtos do carrinho
  const handleAdicionarAoCarrinho = async (produto: Produto) => {
    if (produtosNoCarrinho.includes(produto.id_produtos)) {
      toast.info("Este produto já está no carrinho!");
      return;
    }
    try {
      await adicionarProdutoAoCarrinho(
        produto.id_produtos.toString(),
        produto.quantidade,
        produto.Unidade,
        produto.peso_kg,
        produto.preco
      );
      toast.success("Produto adicionado ao carrinho com sucesso!");
      // Atualiza a lista dos produtos do carrinho
      setProdutosNoCarrinho((prev) => [...prev, produto.id_produtos]);
    } catch (error: any) {
      if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao adicionar produto ao carrinho");
      }
    }
  };

  const mostrarMaisProdutos = () => {
    setVerMaisClicado(true);
    setVisibleCount((prev) => prev + 12);
  };

  const produtosVisiveis = produtos.slice(0, visibleCount);
  const haMaisProdutos = visibleCount < produtos.length;

  function calcularEstrelas(media: number) {
    const estrelasCheias = Math.floor(media);
    const temMeiaEstrela = media - estrelasCheias >= 0.25 && media - estrelasCheias < 0.75;
    const estrelasVazias = 5 - estrelasCheias - (temMeiaEstrela ? 1 : 0);
    return {
      cheias: estrelasCheias,
      meia: temMeiaEstrela ? 1 : 0,
      vazias: estrelasVazias,
    };
  }


  useEffect(() => {
      const verificarECarregarUsuario = async () => {
        try {
          // Primeiro verifica se está autenticado
          const authUser = await verificarAuth();
          
          if (authUser) {
            setAutenticado(true);
            
            // Então busca os dados completos do usuário
            try {
              const dadosCompletos = await getUsuarioById();
              setUsuario({
                id_usuario: Number(dadosCompletos.id_usuario) || Number(authUser.id_usuario) || 0,
                nome: dadosCompletos.nome || authUser.nome || '',
                tipo_usuario: dadosCompletos.tipo_usuario || authUser.tipo_usuario || '',
                email: dadosCompletos.email || authUser.email || ''
              });
              console.log("Usuário carregado:", dadosCompletos);
            } catch (errorUsuario) {
              console.warn("Erro ao carregar dados completos, usando dados da auth:", errorUsuario);
              // Fallback para dados da autenticação
              setUsuario({
                id_usuario: Number(authUser.id_usuario) || 0,
                nome: authUser.nome || '',
                tipo_usuario: authUser.tipo_usuario || ''
              });
            }
          } else {
            setAutenticado(false);
            setUsuario(null);
          }
        } catch (error) {
          console.error("Erro na verificação de autenticação:", error);
          setAutenticado(false);
          setUsuario(null);
        }
      };
  
      verificarECarregarUsuario();
    }, []);
  

  // Verifica se o usuário está autenticado e carrega os dados do usuário

  //  Verificar se o usuário é dono do produto
  const isOwner = (produto: Produto): boolean => {
    if (!usuario || !produto) {
      console.log("Verificação de proprietário: usuário ou produto não carregado");
      return false;
    }
    
    const userID = Number(usuario.id_usuario);
    const ownerID = Number(produto.idUsuario);
    
    console.log("Verificação de proprietário:", {
      userID,
      ownerID,
      isOwner: userID > 0 && ownerID > 0 && userID === ownerID
    });
    
    return userID > 0 && ownerID > 0 && userID === ownerID;
  };




  return (
    <div className="min-h-screen flex flex-col">
      <head>
        <title>Ver todos os Produtos</title>
      </head>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false}
        closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <div className="flex-grow flex flex-col mb-20 gap-2 mt-[48%] md:mt-[20%] lg:mt-[15%] mx-auto w-full max-w-[1200px] shadow-custom p-2 md:p-4 lg:p-8 rounded-[10px]">
        <div className="w-full p-2 md:p-4 lg:p-8">
          {carregando ? (
            <div className="flex justify-center items-center h-40">
              <AiOutlineLoading3Quarters className="animate-spin text-marieth text-3xl" />
            </div>
          ) : erro ? (
            <div className="text-center text-vermelho">
              <p>{erro}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {produtosVisiveis.map((produto) => {
                const jaNoCarrinho = produtosNoCarrinho.includes(produto.id_produtos);
                return (
                  <div
                    key={produto.id_produtos}
                    className="overflow-hidden bg-white rounded-[0.625rem] shadow-custom transition-transform duration-150 ease-in-out transform hover:translate-y-[0.3125rem]"
                  >
                    {produto.foto_produto ? (
                      <div className="relative w-full h-40 sm:h-44 md:h-48">
                        <Image
                          src={produto.foto_produto}
                          alt={produto.nome}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-40 sm:h-44 md:h-48 w-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                        Imagem indisponível
                      </div>
                    )}
                    <div className="p-3 sm:p-4 md:p-6">
                      <h3 className="text-base sm:text-lg md:text-xl mb-2 text-profile font-semibold line-clamp-2">
                        {produto.nome}
                      </h3>
                      <div className="flex gap-1 mb-2">
                        {carregandoAvaliacoes ? (
                          <span className="text-gray-500 text-xs md:text-sm">Carregando avaliações...</span>
                        ) : avaliacoes[produto.id_produtos] !== null && avaliacoes[produto.id_produtos] !== undefined ? (
                          (() => {
                            const media = avaliacoes[produto.id_produtos]!;
                            const { cheias, meia, vazias } = calcularEstrelas(media);
                            return (
                              <>
                                {[...Array(cheias)].map((_, i) => (
                                  <FaStar key={"cheia" + i} className="text-amarela text-sm md:text-base" />
                                ))}
                                {meia === 1 && (
                                  <FaRegStarHalfStroke key="meia" className="text-amarela text-sm md:text-base" />
                                )}
                                {[...Array(vazias)].map((_, i) => (
                                  <FaRegStarHalfStroke key={"vazia" + i} className="text-gray-300 text-sm md:text-base" />
                                ))}
                                <span className="text-amarela -mt-[4px] ml-2 text-xs md:text-sm">
                                  ({Number(media).toFixed(1)})
                                </span>
                              </>
                            );
                          })()
                        ) : (
                          <p className="text-gray-500 text-xs md:text-sm">Sem avaliações</p>
                        )}
                      </div>
                      <p className="text-base sm:text-lg md:text-xl font-bold mb-2 text-marieth">
                        AOA {produto.preco.toLocaleString()}
                      </p>
                      <span className="text-xs md:text-sm">
                        {produto.quantidade}/{produto.Unidade}
                      </span>
                      <div className="flex flex-col gap-2 mt-3">
                        <Link
                          href={`/DetalhesProduto/${produto.id_produtos}`}
                          className="text-marieth text-center py-1.5 md:py-2 text-sm md:text-base cursor-pointer px-4 transition-all duration-150 ease-in-out border-[1px] border-solid bg-cinza rounded-[0.3125rem] hover:bg-marieth hover:text-white"
                        >
                          Ver detalhes
                        </Link>
                      {autenticado ? (
                        isOwner(produto) ? (
                          <div className="mt-4 text-vermelho font-bold text-center p-4 bg-red-50 rounded-lg">
                            🏠 Você é o proprietário deste produto!
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleAdicionarAoCarrinho(produto)}
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
                        )
                      ) : (
                          <Link
                            href="/login"
                            className="bg-marieth w-full py-2 px-4 border-none mt-4 rounded-[5px] text-white text-center text-sm md:text-base cursor-pointer 
                            transition-colors duration-300 hover:bg-verdeaceso mb-2 flex items-center justify-center h-10 md:h-12"
                          >
                            Faça login para adicionar ao carrinho
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {!carregando && (
          haMaisProdutos ? (
            <button
              onClick={mostrarMaisProdutos}
              className="block my-4 md:my-6 lg:my-8 mx-auto bg-marieth cursor-pointer text-sm sm:text-base md:text-lg text-white py-2 md:py-3 lg:py-4 px-6 md:px-8 rounded-[0.3125rem] transition-colors ease-in-out hover:bg-verdeaceso"
            >
              Ver mais Produtos
            </button>
          ) : verMaisClicado ? (
            <p className="text-center text-gray-500 mt-4 md:mt-6 lg:mt-8 text-sm md:text-base">
              Não há mais produtos a serem exibidos.
            </p>
          ) : null
        )}
      </div>
      <Footer />
    </div>
  );
}