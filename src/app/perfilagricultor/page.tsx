"use client"
import { MouseEvent } from "react";
import { FaCamera, FaStar, FaCog, FaBullhorn } from "react-icons/fa";
import Navbar from "../Components/Navbar";
import { FaCirclePlus, FaRegStarHalfStroke } from "react-icons/fa6"
import { IoCall } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import { MdEmail, MdMoreVert, MdOutlinePersonOff } from "react-icons/md";
import Footer from "../Components/Footer";
import { FaUser } from "react-icons/fa"
import { GrGallery, GrUpdate } from "react-icons/gr";
import { IoMdTrash } from "react-icons/io";
import { RiFileChartLine } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import Head from "next/head";
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { atualizarUsuario } from "../Services/user";
import Image from "next/image";
import Link from "next/link";
import { verificarAuth ,logout} from "../Services/auth"
import { getUsuarioById } from "../Services/user";
import {  deletarProduto } from "../Services/produtos";
import { getProdutosPorUsuario } from "../Services/produtos";


export default function PerfilAgricultor() {
  const boxref = useRef<HTMLDivElement>(null);
  const configRef = useRef<HTMLDivElement>(null);
  const menuProdutoRef = useRef<HTMLDivElement>(null);
  const [imagemPerfil, setimagemPerfil] = useState<string | null>(null);
  const inputCameraRef = useRef<HTMLInputElement>(null);
  const inputGalleryRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [isopen, setIsOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [usuario, setUsuario] = useState<any>(null);
  const [autenticado, setAutenticado] = useState<boolean | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [carregandoProdutos, setCarregandoProdutos] = useState(true);
  const [produtoMenuAberto, setProdutoMenuAberto] = useState<number | null>(null);
  const [showEstatsModal, setShowEstatsModal] = useState(false);
  const [estatsProduto, setEstatsProduto] = useState<any>(null);
  const [erroAtualizacao, setErroAtualizacao] = useState<string | null>(null);
  const [cardsData, setCardsData] = useState({
    produtosVendidos: 0,
    produtosAtivos: 0,
    avaliacaoMedia: 0,
    taxaResposta: 0
  });

  useEffect(() => {
    const verificarAutenticacao = async () => {
      try {
        const authResult = await verificarAuth();

        if (!authResult) {
          setAutenticado(false);
          router.push("/login");
          return;
        }

        setAutenticado(true);

        // Buscar dados do usuário
        const dados = await getUsuarioById();
        setUsuario(dados);

        // Verificar tipo de usuário
        if (dados && dados.tipo_usuario !== "Agricultor") {
          router.push("/");
          return;
        }

        // Definir imagem do perfil se existir
        if (dados.foto) setimagemPerfil(dados.foto);
        
        // Buscar produtos do usuário
        buscarProdutosDoUsuario();

      } catch (error) {
        console.log("Erro ao verificar autenticação:", error);
        setAutenticado(false);
        router.push("/login");
      } finally {
        setCarregando(false);
      }
    };

    verificarAutenticacao();
  }, [router]);

  // Função para buscar produtos do usuário
  const buscarProdutosDoUsuario = async () => {
    try {
      setCarregandoProdutos(true);
      const produtosData = await getProdutosPorUsuario();
      setProdutos(produtosData);
      
      // Atualizar os cards baseado nos produtos
      if (produtosData.length > 0) {
        // Calcular produtos ativos
        const ativos = produtosData.filter(p => p.status === "Ativo").length;
        
        // Calcular média de avaliações (supondo que temos avaliações nos produtos)
        let totalAvaliacoes = 0;
        let produtos_com_avaliacoes = 0;
        
        produtosData.forEach(produto => {
          if (produto.avaliacoes) {
            totalAvaliacoes += parseFloat(produto.avaliacoes);
            produtos_com_avaliacoes++;
          }
        });
        
        const avaliacaoMedia = produtos_com_avaliacoes > 0 
          ? (totalAvaliacoes / produtos_com_avaliacoes).toFixed(1) 
          : "4.5"; // valor padrão se não houver avaliações
        
        setCardsData({
          produtosVendidos: produtosData.reduce((total, p) => total + (p.vendas || 0), 0),
          produtosAtivos: ativos,
          avaliacaoMedia: parseFloat(avaliacaoMedia),
          taxaResposta: 98 // Este valor pode ser estático ou calculado de outra fonte
        });
      }
    } catch (error) {
      console.log("Erro ao buscar produtos do usuário:", error);
      // Tratamento de erro, talvez exibir uma mensagem para o usuário
    } finally {
      setCarregandoProdutos(false);
    }
  };

  const togaleria = () => {
    setIsOpen((prev) => !prev);
  };

  const toggleConfig = () => {
    setIsConfigOpen((prev) => !prev);
  };

  const toggleProdutoMenu = (produtoId: number) => {
    if (produtoMenuAberto === produtoId) {
      setProdutoMenuAberto(null);
    } else {
      setProdutoMenuAberto(produtoId);
    }
  };

  const mostrarEstatisticas = (produto: any) => {
    setEstatsProduto(produto);
    setShowEstatsModal(true);
    setProdutoMenuAberto(null);
  };

  const fecharEstatisticas = () => {
    setShowEstatsModal(false);
  };

  const editarProduto = (produtoId: number) => {
    router.push(`/EditarProduto/${produtoId}`);
  };

  const excluirProduto = async (produtoId: number) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        // Chamar a API para excluir o produto
        await deletarProduto(produtoId);
        
        // Atualizar o estado local removendo o produto
        setProdutos(produtos.filter(p => p.id_produtos !== produtoId));
        alert("Produto excluído com sucesso!");
        
        // Atualizar os cards
        buscarProdutosDoUsuario();
      } catch (error) {
        console.log("Erro ao excluir produto:", error);
        alert("Erro ao excluir produto. Tente novamente mais tarde.");
      }
      setProdutoMenuAberto(null);
    }
  };

  const handleClick = useCallback((event: globalThis.MouseEvent) => {
    if (boxref.current && !boxref.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
    if (configRef.current && !configRef.current.contains(event.target as Node)) {
      setIsConfigOpen(false);
    }
    if (menuProdutoRef.current && !menuProdutoRef.current.contains(event.target as Node)) {
      setProdutoMenuAberto(null);
    }
  }, []);

  useEffect(() => {
    if (isopen || isConfigOpen || produtoMenuAberto !== null) {
      document.addEventListener("mousedown", handleClick);
    } else {
      document.removeEventListener("mousedown", handleClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [isopen, isConfigOpen, produtoMenuAberto, handleClick]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setErroAtualizacao(null);
        // Validar tipo de arquivo (aceitar apenas imagens)
        if (!file.type.startsWith('image/')) {
          setErroAtualizacao("Por favor, selecione um arquivo de imagem válido.");
          return;
        }
        
        // Validar tamanho do arquivo (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setErroAtualizacao("A imagem não pode ter mais de 5MB.");
          return;
        }

        // Criar URL temporária para visualização
        const imagUrl = URL.createObjectURL(file);
        setimagemPerfil(imagUrl);

        const formData = new FormData();
        formData.append("foto", file);

        // Enviar para o servidor
        await atualizarUsuario(formData);
        alert("Foto atualizada com sucesso");
        setIsOpen(false);
      } catch (error) {
        console.log("Erro ao atualizar imagem", error);
        setErroAtualizacao("Erro ao atualizar foto. Tente novamente mais tarde.");
      }
    }
  };

  const handleRemoverImagem = async () => {
    try {
      setErroAtualizacao(null);
      setimagemPerfil(null);
      
      const formData = new FormData();
      formData.append("foto", "");

      await atualizarUsuario(formData);
      alert("Imagem removida com sucesso!");
      setIsOpen(false);
    } catch (error) {
      console.log("Erro ao remover imagem", error);
      setErroAtualizacao("Erro ao remover imagem. Tente novamente mais tarde.");
    }
  };

  // Ir para página de edição de perfil
  const irParaEditarPerfil = (produtoId:number) => {
    router.push(`/editarperfil/${produtoId}`);
    setIsConfigOpen(false);
  };

   const irParaPromoverProduto = (produtoId:number) => {
    router.push(`/Promoverproduto/${produtoId}`);
    setProdutoMenuAberto(null);
    setIsConfigOpen(false);
  };

  // Mostrar tela de carregamento enquanto verifica autenticação
  if (carregando) {
    return <div className="text-center mt-20">Carregando dados...</div>;
  }

  // Se não estiver autenticado, não renderiza nada (já foi redirecionado)
  if (!autenticado) {
    return null;
  }

  // Se não tiver dados do usuário, mostra carregando
  if (!usuario) {
    return <div className="text-center mt-20">Carregando dados do usuário...</div>;
  }

  
    const handleLogout = async () => {
      try {
        await logout();
        setAutenticado(false); 
        router.push("/login");
      } catch (error) {
        console.log("Erro ao terminar sessão:", error);
      }
    };
    
  


  return (
    <div>
      <Head>
        <title>Perfil Agricultor</title>
      </Head>
      <Navbar />
      <div className="shadow-custom flex flex-col mb-20 gap-2 mt-[36%] lg:mt-[15%] max-w-[1200px] mx-auto justify-center items-center">

        <main className="my-8 max-w-[80rem] w-full px-4 sm:px-6 flex flex-col gap-8">
          <div className="lg:flex shadow-custom border-[0.7px] rounded-[10px] p-4 sm:p-8 bg-white gap-8">

            <div className="absolute w-[12.5rem] h-[12.5rem] rounded-[50%] flex items-center text-[4rem]
                justify-center text-cortime bg-cinzab">
              {imagemPerfil ? (
                <Image src={imagemPerfil} alt="foto de Perfil" width={250} height={250} className="rounded-full object-cover w-full h-full" />
              ) : (
                <FaUser />
              )}
            </div>

            <div className="mt-40 ml-[10.7rem] relative z-[70]">
              <button onClick={togaleria} className="right-4 text-[1.5rem] text-marieth relative z-[50]" title="Editar Perfil">
                <FaCirclePlus />
              </button>
            </div>

            {isopen && (
              <div ref={boxref} className="left-20 bottom-[110px] bg-white rounded-[10px] z-[1000]
                shadow-custom absolute p-2">
                <button onClick={() => inputCameraRef.current?.click()} className="flex items-center gap-2 w-full cursor-pointer border-none py-2
                px-4 bg-none transition-colors duration-100 text-profile hover:bg-light">
                  <FaCamera />Tirar foto </button>
                <button onClick={() => inputGalleryRef.current?.click()} className="flex items-center gap-2 w-full cursor-pointer border-none 
                py-2 px-4 bg-none transition-colors duration-100 text-profile hover:bg-light">
                  <GrGallery />Galeria
                </button>
                <button onClick={() => inputGalleryRef.current?.click()} className="flex items-center gap-2 w-full cursor-pointer border-none
                py-2 px-4 bg-none transition-colors duration-100 text-profile hover:bg-light">
                  <GrUpdate /> Atualizar
                </button>

                <button onClick={handleRemoverImagem} className="flex items-center gap-2 w-full cursor-pointer border-none
                py-2 px-4 bg-none transition-colors duration-100 text-profile hover:bg-light">
                  <IoMdTrash /> Remover
                </button>
                
                {erroAtualizacao && (
                  <p className="text-red-500 text-sm mt-2 px-4">{erroAtualizacao}</p>
                )}
              </div>
            )}
            <label htmlFor="tirarfoto" className="sr-only">tirarfoto</label>
            <input
              type="file"
              id="tirarfoto"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              ref={inputCameraRef}
            />

            <label htmlFor="galeria" className="sr-only">galeria </label>
            <input 
              type="file" 
              accept="image/*" 
              id="galeria" 
              onChange={handleImageChange} 
              className="hidden" 
              ref={inputGalleryRef} 
            />

            <div className="mt-4 lg:mt-0 w-full">
              <div className="flex justify-between items-center mb-2">
                <h1 className="text-xl sm:text-2xl md:text-[2rem] font-medium text-profile">
                  {usuario?.nome || "Carregando..."}
                </h1>
                
                <div className="relative">
                  <button 
                    onClick={toggleConfig} 
                    className="text-2xl text-marieth hover:text-verdeaceso transition-colors"
                    title="Configurações"
                    aria-label="Configurações"
                  >
                    <FaCog />
                  </button>
                  
                  {isConfigOpen && (
                    <div ref={configRef} className="absolute right-0 top-10 bg-white rounded-[10px] z-[1000] shadow-custom p-2 min-w-[150px]">
                      <button onClick={() => irParaEditarPerfil(0)} className="flex items-center gap-2 w-full cursor-pointer border-none py-2 px-4 bg-none transition-colors duration-100 text-profile hover:bg-light text-left">
                        <FiEdit /> Editar Perfil
                      </button>
                      
                       <button onClick={handleLogout} className="flex items-center gap-2 w-full cursor-pointer border-none py-2 px-4 bg-none transition-colors duration-100 text-vermelho hover:bg-light text-left">
                        <MdOutlinePersonOff /> Terminar Sessão
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center mb-2">
                <div className="flex text-[1.2rem]">
                  <FaStar className="text-amarela" />
                  <FaStar className="text-amarela" />
                  <FaStar className="text-amarela" />
                  <FaStar className="text-amarela" />
                  <FaRegStarHalfStroke className="text-amarela" />
                </div>
                <span className="text-amarela text-[1.2rem] ml-1">(4.5)</span>
              </div>

              <p className="mb-2">Membro desde:
                {usuario?.data_criacao ? new Date(usuario.data_criacao).toLocaleDateString() : "-"}</p>
              <p className="mb-2">Especialidade: <span className="text-marieth font-medium">{usuario?.tipo_usuario || "Agricultor"}</span></p>
              <div className="flex gap-4">
                <a href={`mailto:${usuario?.email}`} className="flex items-center gap-2 py-2 px-4 rounded-[0.3125rem] 
                text-[1rem] bg-marieth 
                transition-colors cursor-pointer text-white hover:bg-verdeaceso"><MdEmail />Email</a>

                <a href={`tel:${usuario?.contacto}`} className="flex items-center gap-2 py-2 px-4 rounded-[0.3125rem] text-[1rem] bg-marieth 
                transition-colors cursor-pointer text-white hover:bg-verdeaceso"><IoCall />Ligar</a>
              </div>
              {usuario?.descricao && <p className="mt-4">{usuario.descricao}</p>}
            </div>
          </div>

          {/* Cards estatísticos - Melhorados para responsividade */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-8 mb-8">
            <div className="bg-white p-3 md:p-6 rounded-[10px] shadow-custom text-center  
            transition-transform duration-300 hover:translate-y-[-5px]">
              <div className="text-xl md:text-2xl lg:text-[2rem] text-marieth font-bold">{cardsData.produtosVendidos}</div>
              <div className="text-xs sm:text-sm md:text-base text-profile mt-2">Produtos Vendidos</div>
            </div>
            <div className="bg-white p-3 md:p-6 rounded-[10px] shadow-custom text-center  
            transition-transform duration-300 hover:translate-y-[-5px]">
              <div className="text-xl md:text-2xl lg:text-[2rem] text-marieth font-bold">{cardsData.produtosAtivos}</div>
              <div className="text-xs sm:text-sm md:text-base text-profile mt-2">Produtos Ativos</div>
            </div>
            <div className="bg-white p-3 md:p-6 rounded-[10px] shadow-custom text-center  
            transition-transform duration-300 hover:translate-y-[-5px]">
              <div className="text-xl md:text-2xl lg:text-[2rem] text-marieth font-bold">{cardsData.avaliacaoMedia}</div>
              <div className="text-xs sm:text-sm md:text-base text-profile mt-2">Avaliação Média</div>
            </div>
            <div className="bg-white p-3 md:p-6 rounded-[10px] shadow-custom text-center  
            transition-transform duration-300 hover:translate-y-[-5px]">
              <div className="text-xl md:text-2xl lg:text-[2rem] text-marieth font-bold">{cardsData.taxaResposta}%</div>
              <div className="text-xs sm:text-sm md:text-base text-profile mt-2">Taxa de Resposta</div>
            </div>
          </div>

          <section className="bg-white p-4 sm:p-8 rounded-[10px] shadow-custom">
            <h2 className="mb-6 text-profile font-semibold text-xl sm:text-2xl">Produtos Cadastrados</h2>

            {carregandoProdutos ? (
              <div className="text-center p-8">
                <p>Carregando produtos...</p>
              </div>
            ) : produtos.length === 0 ? (
              <div className="text-center p-8 bg-list rounded-[10px]">
                <p className="text-lg text-gray-600 mb-4">Você ainda não cadastrou nenhum produto.</p>
                <Link href="/ProdCad" className="bg-marieth text-white px-6 py-4 lg:py-2 lg:px-4 rounded-md hover:bg-verdeaceso transition-colors">
                  Cadastrar primeiro produto
                </Link>
              </div>
            ) : (
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 mb-6 lg:grid-cols-3 gap-4 md:gap-6">
                {produtos.map((produto) => (
                  <div key={produto.id_produtos} className="border-solid border-[1px] border-tab p-4
                    transition-shadow duration-300 rounded-[10px] hover:shadow-custom relative">
                    <div className="flex justify-end">
                      <button
                        onClick={() => toggleProdutoMenu(produto.id_produtos)}
                        className="text-[1.2rem] text-gray-700 hover:text-marieth transition-colors"
                        aria-label="Opções de produto"
                      >
                        <MdMoreVert />
                      </button>
                    </div>

                    {produtoMenuAberto === produto.id_produtos && (
                      <div ref={menuProdutoRef} className="absolute right-4 top-8 bg-white rounded-[10px] z-[1000] shadow-custom p-2 min-w-[150px]">
                        <button 
                          onClick={() => mostrarEstatisticas(produto)} 
                          className="flex items-center gap-2 w-full cursor-pointer border-none py-2 px-4 bg-none transition-colors duration-100 text-profile hover:bg-light text-left"
                        >
                          <RiFileChartLine /> Ver estatísticas
                        </button>
                        <button 
                          onClick={() => editarProduto(produto.id_produtos)} 
                          className="flex items-center gap-2 w-full cursor-pointer border-none py-2 px-4 bg-none transition-colors duration-100 text-profile hover:bg-light text-left"
                        >
                          <FiEdit /> Editar produto
                        </button>
                        <button 
                          onClick={() => excluirProduto(produto.id_produtos)} 
                          className="flex items-center gap-2 w-full cursor-pointer border-none py-2 px-4 bg-none transition-colors duration-100 text-red-500 hover:bg-light text-left"
                        >
                          <IoMdTrash /> Excluir produto
                        </button>
                        <button 
                          onClick={() => irParaPromoverProduto(produto.id_produtos)} 
                          className="flex items-center gap-2 w-full cursor-pointer border-none py-2 px-4 bg-none transition-colors duration-100 text-profile hover:bg-light text-left"
                        >
                          <FaBullhorn /> Promover Produto
                        </button>
                      </div>
                    )}

                    <div className="w-full h-[150px] mb-4 rounded-[5px] overflow-hidden">
                      <Image 
                        src={produto.foto_produto || "/images/produto-placeholder.jpg"} 
                        alt={produto.nome} 
                        width={300} 
                        height={200} 
                        className="object-cover w-full h-full"
                      />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-lg">{produto.nome}</h3>
                      <div className="flex items-center">
                        <FaStar className="text-amarela" />
                        <span className="ml-1">{produto.avaliacoes || 0}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 my-1">{produto.preco} AOA</p>
                    <p className="text-gray-600 text-sm mb-3">
                      {produto.quantidade ? `${produto.quantidade} ${produto.Unidade || 'unidades'}` : 'Estoque não disponível'}
                    </p>

                    <button 
                      onClick={() => mostrarEstatisticas(produto)}
                      className="w-full bg-marieth rounded-[5px] p-2 text-white text-sm hover:bg-verdeaceso transition-colors"
                    >
                      Ver estatísticas
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Modal de Estatísticas */}
          {showEstatsModal && estatsProduto && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000] p-4">
              <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Estatísticas: {estatsProduto.nome}</h3>
                  <button 
                    onClick={fecharEstatisticas}
                    className="text-gray-600 hover:text-gray-800"
                    aria-label="Fechar"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="mt-4 space-y-4">
                  <div className="bg-gray-100 p-4 rounded-md">
                    <div className="flex justify-between">
                      <span className="font-medium">Total de vendas:</span>
                      <span>{estatsProduto.vendas || 0} unidades</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-100 p-4 rounded-md">
                    <div className="flex justify-between">
                      <span className="font-medium">Visitas na página:</span>
                      <span>{estatsProduto.visitas || 0}</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-100 p-4 rounded-md">
                    <div className="flex justify-between">
                      <span className="font-medium">Avaliações recebidas:</span>
                      <span>{estatsProduto.avaliacoes || 0}</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-100 p-4 rounded-md">
                    <div className="flex justify-between">
                      <span className="font-medium">Status:</span>
                      <span className={estatsProduto.status === "Ativo" ? "text-marieth" : "text-vermelho"}>
                        {estatsProduto.status || "Ativo"}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-md">
                    <div className="flex justify-between">
                      <span className="font-medium">Estoque atual:</span>
                      <span>{estatsProduto.quantidade || 0} {estatsProduto.unidade || "unidades"}</span>
                    </div>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-md">
                    <div className="flex justify-between">
                      <span className="font-medium">Receita gerada:</span>
                      <span>{((estatsProduto.vendas || 0) * (estatsProduto.preco || 0)).toLocaleString()} AOA</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex space-x-3">
                  <button 
                    onClick={() => editarProduto(estatsProduto.id_produtos)}
                    className="flex-1 bg-marieth text-white py-2 rounded-md hover:bg-verdeaceso transition-colors"
                  >
                    Editar produto
                  </button>
                  <button 
                    onClick={fecharEstatisticas}
                    className="flex-1 border border-gray-300 py-2 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          )}

          <div>
            <button className="fixed transition-transform duration-300 
            cursor-pointer border-none rounded-[50%] flex justify-center text-white
            text-[1.5rem] h-[60px] w-[60px] hover:transform hover:scale-110 bg-marieth bottom-8 right-8 shadow-custom items-center" 
            title="Cadastrar Novo Produto"
            aria-label="Cadastrar Novo Produto">
              <Link href="/ProdCad" className="flex items-center justify-center h-full w-full">
                <FaPlus className="text-[1.5rem]" />
              </Link>
            </button>
          </div>

        </main>

      </div>
      <Footer />
    </div>
  )
}