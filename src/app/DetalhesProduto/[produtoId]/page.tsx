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
import { getUsuarioById } from "../../Services/user"; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Interface para o usuário
interface Usuario {
  id_usuario: number;
  nome: string;
  tipo_usuario?: string;
  email?: string;
}

// Interface para o produto
interface Produto {
  id_produtos: number;
  nome: string;
  provincia: string;
  foto_produto?: string;
  preco: number;
  Unidade: string;
  quantidade: number;
  peso_kg: number;
  idUsuario: number;
  descricao?: string; 
}

// Interface para avaliações
interface AvaliacaoData {
  media_estrelas: number;
  total: number;
  recomendacoes: number;
  avaliacoes?: Array<{
    id: number;
    nota: number;
    comentario?: string;
    usuario_nome?: string;
  }>;
}

export default function DetalhesProduto(){
  const { produtoId } = useParams() as { produtoId: string };
  const router = useRouter();

  // Estados principais
  const [showcaixa, setshowcaixa] = useState(false);
  const [autenticado, setAutenticado] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);
  const [quantidadeSelecionada, setQuantidadeSelecionada] = useState<number>(1);
  const [unidadeSelecionada, setUnidadeSelecionada] = useState<string>("");

  // Avaliações - CORRIGIDO
  const [avaliacaoData, setAvaliacaoData] = useState<AvaliacaoData>({
    media_estrelas: 0,
    total: 0,
    recomendacoes: 0,
    avaliacoes: []
  });
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

  // Estados do produto e usuário - CORRIGIDO
  const [produto, setProduto] = useState<Produto | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [precoTotal, setPrecoTotal] = useState(0);

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
      console.error("Erro ao carregar produtos do carrinho:", err);
      setProdutosNoCarrinho([]);
    } finally {
      setCarregandoCarrinho(false);
    }
  };

  // Verifica se produto já está no carrinho
  const jaNoCarrinho = produtoId ? produtosNoCarrinho.includes(Number(produtoId)) : false;

  //  Verificar autenticação e carregar dados do usuário
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

  // Carregar produtos do carrinho quando usuário estiver autenticado
  useEffect(() => {
    if (autenticado) {
      carregarProdutosNoCarrinho();
    }
  }, [autenticado]);

  //Buscar avaliações do produto
  useEffect(() => {
  if (!produtoId) return;
  
  const carregarAvaliacoes = async () => {
    setCarregandoAvaliacoes(true);
    try {
      const resultado = await buscarMediaEstrelas(Number(produtoId));
      setAvaliacaoData({
        // Garantir que media_estrelas seja sempre um número
        media_estrelas: Number(resultado.media_estrelas) || 0,
        total: Number(resultado.total) || 0,
        recomendacoes: Number(resultado.recomendacoes) || 0,
        avaliacoes: resultado.avaliacoes || []
      });
    } catch (error) {
      console.error("Erro ao carregar avaliações:", error);
      setAvaliacaoData({
        media_estrelas: 0, // Valor padrão seguro
        total: 0,
        recomendacoes: 0,
        avaliacoes: []
      });
    } finally {
      setCarregandoAvaliacoes(false);
    }
  };

  carregarAvaliacoes();
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
      setAvaliacaoRealizada(prev => !prev); // Toggle para recarregar
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
        console.log("Produto carregado:", data);
      } catch (error) {
        console.error("Erro ao carregar produto:", error);
        setErro("Não foi possível carregar o produto");
      } finally {
        setCarregando(false);
      }
    };
    
    fetchProduto();
  }, [produtoId]);

  // Recalcula preço total
  useEffect(() => {
    if (produto) {
      setPrecoTotal(produto.preco * quantidadeSelecionada);
    }
  }, [produto, quantidadeSelecionada]);


  //  Verificar se o usuário é dono do produto
  const isOwner = (): boolean => {
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
        <title>{produto.nome} - Detalhes do Produto</title>
      </Head>
      <Navbar/>
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="mb-20 mt-[45%] lg:mt-[15%]">
        <main className="max-w-[1200px] my-8 mx-auto bg-white p-4 lg:p-8 shadow-custom rounded-[10px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
            {/* COLUNA DA IMAGEM */}
            <div>
              <Image
                src={produto.foto_produto || "/default-image.jpg"}
                alt={produto.nome}
                width={500}
                height={400}
                className="flex w-full h-[300px] lg:h-[400px] rounded-[10px] items-center justify-center text-[3rem] text-cortime bg-pretobranco object-cover"
              />
            </div>

            {/* COLUNA DAS INFORMAÇÕES */}
            <div>
              <div className="flex gap-4 lg:gap-6 flex-col">
                <h1 className="text-[1.5rem] lg:text-[2rem] text-profile font-bold">{produto.nome}</h1>
                
                {/* AVALIAÇÕES - CORRIGIDO */}
                <div className="flex items-center gap-2 text-[1.2rem] lg:text-[1.5rem] cursor-pointer text-tab">
                  {[1, 2, 3, 4, 5].map((num) => {
                    const rating = avaliacaoData.media_estrelas;
                    if (num <= Math.floor(rating)) {
                      return <FaStar key={num} className="text-yellow-500" />;
                    } else if (num === Math.ceil(rating) && rating % 1 !== 0) {
                      return <FaRegStarHalfStroke key={num} className="text-yellow-500" />;
                    } else {
                      return <FaStar key={num} className="text-gray-300" />;
                    }
                  })}
                  <span className="text-sm lg:text-base ml-2">
                    ({avaliacaoData.total} {avaliacaoData.total === 1 ? 'avaliação' : 'avaliações'})
                  </span>
                </div>

                <div className="text-[1.4rem] lg:text-[1.8rem] font-bold text-marieth">
                  <span>{produto.preco} AOA/{produto.quantidade}{produto.Unidade}</span> 
                </div>

                <div className="text-[1rem] lg:text-[1.4rem] font-bold text-profile">
                  <span>Peso: {produto.peso_kg}kg</span>
                </div>

                {/* LOCALIZAÇÃO */}
                <div className="flex items-center gap-4 p-3 lg:p-4 mb-2 rounded-[10px] bg-pretobranco">
                  <div className="flex w-[50px] h-[50px] lg:w-[60px] lg:h-[60px] rounded-[50%] items-center justify-center bg-back">
                    <AiFillHome />
                  </div>
                  <div>
                    <h3 className="font-semibold">{produto.nome}</h3>
                    <div className="flex items-center gap-2 text-cortexto text-sm lg:text-base">
                      <CiLocationOn />
                      <span>{produto.provincia}</span>
                      <span>/Angola</span>
                    </div>
                  </div>
                </div>

                {/* BOTÕES DE AÇÃO */}
                <div>
                  {autenticado ? (
                    userIsOwner ? (
                      <div className="mt-4 text-vermelho font-bold text-center p-4 bg-red-50 rounded-lg">
                        🏠 Você é o proprietário deste produto!
                      </div>
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
                        
                        <button
                          onClick={handleAdicionarAoCarrinho}
                          className={`w-full py-2 px-4 border-none mt-2 rounded-[5px] text-white text-sm md:text-base lg:text-lg cursor-pointer transition-colors duration-300 mb-2 flex items-center justify-center gap-2 h-10 md:h-12 ${
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
                      </>
                    )
                  ) : (
                    <button 
                      className="w-full hover:bg-verdeaceso bg-marieth rounded-[5px] cursor-pointer text-white p-3 text-[1rem] border-none"
                      onClick={() => router.push("/login")}
                    >
                      Faça login para comprar
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

          {/* DESCRIÇÃO DO PRODUTO - NOVA SEÇÃO */}
          {produto.descricao && (
            <div className="mt-8 pt-6 border-t-[1px] border-solid border-tab">
              <h2 className="text-[1.5rem] lg:text-[1.8rem] font-bold text-profile mb-4">
                Descrição do Produto
              </h2>
              <div className="bg-pretobranco p-4 lg:p-6 rounded-[10px]">
                <p className="text-cortexto leading-relaxed text-sm lg:text-base">
                  {produto.descricao}
                </p>
              </div>
            </div>
          )}

          {/* MODAL DE QUANTIDADE */}
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
                      
                      <option value="kg">Kilograma(kg)</option>
                    </select>
                  </label>
                </div>
                <div className="flex gap-4 justify-end cursor-pointer border-none">
                  <button 
                    className="bg-vermelho hover:bg-red-600 py-2 px-4 text-white rounded-[5px]" 
                    onClick={() => setshowcaixa(false)}
                  >
                    Cancelar
                  </button>
                  <button 
                    className="bg-marieth hover:bg-verdeaceso py-2 px-4 text-white rounded-[5px]"
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

          {/* AVALIAÇÕES - CORRIGIDA */}
          <div className="mt-8 pt-8 border-t-[1px] border-solid border-tab">
            <h2 className="text-[1.5rem] lg:text-[1.8rem] font-bold text-profile mb-4">Avaliações</h2>
            
            {carregandoAvaliacoes ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-marieth"></div>
              </div>
            ) : (
                              <><div className="flex flex-wrap gap-4 lg:gap-8 mb-6">
                  <div className="text-center bg-pretobranco p-4 rounded-lg">
                    <div className="text-[1.3rem] lg:text-[1.5rem] text-marieth font-bold">
                      {(Number(avaliacaoData.media_estrelas) || 0).toFixed(1)}
                    </div>
                    <div className="text-sm lg:text-base text-cortexto">Média Geral</div>
                  </div>
                  <div className="text-center bg-pretobranco p-4 rounded-lg">
                    <div className="text-[1.3rem] lg:text-[1.5rem] text-marieth font-bold">
                      {Number(avaliacaoData.total) || 0}
                    </div>
                    <div className="text-sm lg:text-base text-cortexto">
                      {(Number(avaliacaoData.total) || 0) === 1 ? 'Avaliação' : 'Avaliações'}
                    </div>
                  </div>
                  <div className="text-center bg-pretobranco p-4 rounded-lg">
                    <div className="text-[1.3rem] lg:text-[1.5rem] text-marieth font-bold">
                      {Number(avaliacaoData.recomendacoes) || 0}%
                    </div>
                    <div className="text-sm lg:text-base text-cortexto">Recomendações</div>
                  </div>
                </div>
                {/* FORMULÁRIO DE AVALIAÇÃO */}
                <div className="mt-6 p-4 lg:p-6 rounded-[10px] bg-back2">
                  <h3 className="mb-4 text-[1.1rem] lg:text-[1.2rem] font-semibold">
                    Avalie este Produto
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-2 text-[1.3rem] lg:text-[1.5rem] cursor-pointer">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <FaStar
                          key={num}
                          className={`transition-colors duration-200 ${
                            notaTemporaria >= num ? "text-yellow-500" : "text-gray-300"
                          } hover:text-yellow-400`}
                          onClick={() => handleSelecionarEstrela(num)}
                        />
                      ))}
                    </div>
                    <button
                      onClick={handleEnviarAvaliacao}
                      className={`ml-4 transition-all duration-200 ${
                        notaTemporaria === 0 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-marieth hover:bg-verdeaceso hover:scale-105'
                      } text-white rounded-full p-2 flex items-center justify-center`}
                      title="Enviar avaliação"
                      disabled={notaTemporaria === 0}
                    >
                      <FaPaperPlane className="text-lg" />
                    </button>
                  </div>
                  {notaSelecionada > 0 && (
                    <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-marieth font-medium">
                        ✅ Sua avaliação: {notaSelecionada} {notaSelecionada === 1 ? 'estrela' : 'estrelas'}
                      </p>
                    </div>
                  )}
                </div>

                {/* LISTA DE AVALIAÇÕES */}
                {avaliacaoData.avaliacoes && avaliacaoData.avaliacoes.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-[1.1rem] lg:text-[1.2rem] font-semibold mb-4">
                      Comentários dos Clientes
                    </h4>
                    <div className="space-y-4">
                      {avaliacaoData.avaliacoes.map((avaliacao, index) => (
                        <div key={avaliacao.id || index} className="bg-pretobranco p-4 rounded-lg border">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((num) => (
                                <FaStar
                                  key={num}
                                  className={num <= avaliacao.nota ? "text-yellow-500 text-sm" : "text-gray-300 text-sm"}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-cortexto">
                              por {avaliacao.usuario_nome || 'Cliente'}
                            </span>
                          </div>
                          {avaliacao.comentario && (
                            <p className="text-cortexto text-sm">{avaliacao.comentario}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

        </main>
      </div>
      <Footer/>
    </div>
  );
}