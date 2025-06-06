"use client"
import { FaCamera, FaStar, FaCog } from "react-icons/fa";
import Navbar from "../Components/Navbar";
import { FaCirclePlus, FaRegStarHalfStroke } from "react-icons/fa6"
import { IoCall } from "react-icons/io5";
import { MdEmail, MdOutlinePersonOff } from "react-icons/md";
import Footer from "../Components/Footer";
import { FaUser } from "react-icons/fa"
import { GrGallery, GrUpdate } from "react-icons/gr";
import { IoMdTrash } from "react-icons/io";
import Head from "next/head";
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { atualizarUsuario } from "../Services/user";
import Image from "next/image";
import { getUsuarioById } from "../Services/user";
import { verificarAuth , logout} from "../Services/auth";
import { getPedidosUsuario } from "../Services/pedidos"; 
 import { FaCheck, FaBox } from 'react-icons/fa';
 import {confirmarEntrega} from "../Services/pagamentos";
import { toast ,ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
 

export default function PerfilComprador() {
  const boxref = useRef<HTMLDivElement>(null);
  const configRef = useRef<HTMLDivElement>(null);
  const [imagemPerfil, setimagemPerfil] = useState<string | null>(null);
  const inputCameraRef = useRef<HTMLInputElement>(null);
  const inputGalleryRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [isopen, setIsOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [usuario, setUsuario] = useState<any>(null);
  const [autenticado, setAutenticado] = useState<boolean | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [carregandoPedidos, setCarregandoPedidos] = useState(true);

  
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
        if (dados && dados.tipo_usuario !== "Comprador") {
          router.push("/");
          return;
        }
        
        // Definir imagem do perfil se existir
        if (dados.foto) setimagemPerfil(dados.foto);

        // Buscar pedidos do usuário
        try {
          const dadosPedidos = await getPedidosUsuario();
          setPedidos(dadosPedidos);
        } catch (error) {
          console.log("Erro ao buscar pedidos:", error);
          setPedidos([]);
        } finally {
          setCarregandoPedidos(false);
        }
        
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

  const togaleria = () => {
    setIsOpen((prev) => !prev);
  };

  const toggleConfig = () => {
    setIsConfigOpen((prev) => !prev);
  };

  const handleClick = useCallback((event: MouseEvent) => {
    if (boxref.current && !boxref.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
    if (configRef.current && !configRef.current.contains(event.target as Node)) {
      setIsConfigOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isopen || isConfigOpen) {
      document.addEventListener("mousedown", handleClick);
    } else {
      document.removeEventListener("mousedown", handleClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [isopen, isConfigOpen, handleClick]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imagUrl = URL.createObjectURL(file);
      setimagemPerfil(imagUrl);

      const formData = new FormData();
      formData.append("foto", file);

      try {
        await atualizarUsuario(formData);
        toast.success("Foto atualizada com sucesso");
      } catch (error) {
        console.log("Erro ao atualizar imagem", error);
        toast.error("Erro ao atualizar foto. Tente de novo mais tarde.");
      }
    }
  };

  const handleRemoverImagem = async () => {
    setimagemPerfil(null);
    const formData = new FormData();
    formData.append("foto", "");

    try {
      await atualizarUsuario(formData);
      toast.success("Imagem removida com sucesso!");
      setIsOpen(false);
    } catch (error) {
      console.log("Erro ao remover imagem", error);
      toast.error("Erro ao remover imagem. Tente novamente mais tarde.");
    }
  };

  const formatarData = (dataString : string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Ir para página de edição de perfil
  const irParaEditarPerfil = () => {
    router.push("/editarperfil");
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
    

type Pedido = {
  id_pedido: number;
  transacao_id?: number;
  estado?: string;
  entrega_confirmada?: boolean;
  valor_total?: number;
  data_pedido?: string;
};

const confirmarEntregaPedido = async (pedido: Pedido) => {
  try {
    // Chama sua função de API existente
    await confirmarEntrega(
      String(pedido.transacao_id || pedido.id_pedido), // convert to string
      usuario.id, 
      'manual'
    );
    
    // Atualiza o estado local após sucesso da API
    setPedidos(prevPedidos => 
      prevPedidos.map(p => 
        p.id_pedido === pedido.id_pedido 
          ? { ...p, estado: 'Entregue', entrega_confirmada: true }
          : p
      )
    );

    toast.success('Entrega confirmada com sucesso!');
  } catch (error: any) {
    console.error('Erro ao confirmar entrega:', error);
    toast.error(error?.message || 'Erro ao confirmar entrega. Tente novamente.');
  }
};




  
  return (
    <div>
      <Head>
        <title>Perfil Comprador</title>
      </Head>
      <Navbar />
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnHover draggable pauseOnFocusLoss />
      <div className="shadow-custom flex flex-col mb-20 gap-2 mt-[36%] lg:mt-[15%] max-w-[1200px] justify-center items-center">
        <main className="my-8 max-w-[80rem] w-full flex flex-col gap-8">
          <div className="lg:flex shadow-custom border-[0.7px] rounded-[10px] p-8 bg-white gap-8">
            
            <div className="absolute w-[12.5rem] h-[12.5rem] rounded-[50%] flex items-center text-[4rem]
              justify-center text-cortime bg-cinzab">
              {imagemPerfil ? (
                <Image src={imagemPerfil} alt="foto de Perfil" width={250} height={200} fill className="rounded-[50%] object-cover" />
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
              <div ref={boxref} className="left-20 bottom-[110px] bg-white rounded-[10px] z-[1000] shadow-custom absolute p-2">
                <button onClick={() => inputCameraRef.current?.click()} className="flex items-center gap-2 w-full cursor-pointer border-none py-2 px-4 bg-none transition-colors duration-100 text-profile hover:bg-light">
                  <FaCamera />Tirar foto
                </button>
                <button onClick={() => inputGalleryRef.current?.click()} className="flex items-center gap-2 w-full cursor-pointer border-none py-2 px-4 bg-none transition-colors duration-100 text-profile hover:bg-light">
                  <GrGallery />Galeria
                </button>
                <button onClick={() => inputGalleryRef.current?.click()} className="flex items-center gap-2 w-full cursor-pointer border-none py-2 px-4 bg-none transition-colors duration-100 text-profile hover:bg-light">
                  <GrUpdate /> Atualizar
                </button>
                <button onClick={handleRemoverImagem} className="flex items-center gap-2 w-full cursor-pointer border-none py-2 px-4 bg-none transition-colors duration-100 text-profile hover:bg-light">
                  <IoMdTrash /> Remover
                </button>
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

            <label htmlFor="galeria" className="sr-only">galeria</label>
            <input type="file" accept="image/*" id="galeria" onChange={handleImageChange} className="hidden" ref={inputGalleryRef} />

            <div className="mt-4 lg:mt-0 w-full">
              <div className="flex justify-between items-center mb-2">
                <h1 className="text-[2rem] font-medium text-profile">
                  {usuario?.nome || "Carregando..."}
                </h1>
                
                <div className="relative">
                  <button 
                    onClick={toggleConfig} 
                    className="text-2xl text-marieth hover:text-verdeaceso transition-colors"
                    title="Configurações"
                  >
                    <FaCog />
                  </button>
                  
                  {isConfigOpen && (
                    <div ref={configRef} className="absolute right-0 top-10 bg-white rounded-[10px] z-[1000] shadow-custom p-2 min-w-[150px]">
                      <button onClick={irParaEditarPerfil} className="flex items-center gap-2 w-full cursor-pointer border-none py-2 px-4 bg-none transition-colors duration-100 text-profile hover:bg-light text-left">
                        Editar Perfil
                      </button>
                      
                        <button onClick={handleLogout} className="flex items-center gap-2 w-full cursor-pointer border-none py-2 px-4 bg-none transition-colors duration-100 text-vermelho hover:bg-light text-left">
                        <MdOutlinePersonOff size={24} /> Terminar Sessão
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <p className="mb-2">Membro desde:
                {usuario?.data_criacao ? new Date(usuario.data_criacao).toLocaleDateString() : "-"}</p>
              <p className="mb-2">Especialidade: <span className="text-marieth font-medium"> {usuario?.tipo_usuario || "Comprador"}</span></p>

              <div className="flex gap-4">
                <a href={`mailto:${usuario?.email}`} className="flex items-center gap-2 py-2 px-4 rounded-[0.3125rem] text-[1rem] bg-marieth transition-colors cursor-pointer text-white hover:bg-verdeaceso">
                  <MdEmail />Email
                </a>

                <a href={`tel:${usuario?.contacto}`} className="flex items-center gap-2 py-2 px-4 rounded-[0.3125rem] text-[1rem] bg-marieth transition-colors cursor-pointer text-white hover:bg-verdeaceso">
                  <IoCall />Ligar
                </a>
              </div>
              <h2 className="mt-4"> <a href="">{usuario?.descricao}</a></h2>
            </div>
          </div>


                    <div>
  <h2 className="text-2xl font-bold mb-6 text-center">Histórico de Compras</h2>
  {carregandoPedidos ? (
    <div className="text-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-marieth mx-auto mb-4"></div>
      Carregando histórico de pedidos...
    </div>
  ) : pedidos.length === 0 ? (
    <div className="text-center py-8">
      <FaBox className="mx-auto h-16 w-16 text-gray-400 mb-4" />
      <p className="text-gray-600 mb-4">Você ainda não realizou nenhuma compra.</p>
      <button
        onClick={() => router.push('/TodosProdutos')}
        className="mt-4 bg-marieth text-white py-2 px-4 rounded-md hover:bg-verdeaceso transition-colors"
      >
        Explorar produtos
      </button>
    </div>
  ) : (
    <div className="space-y-4">
      {pedidos.map((pedido) => (
        <div key={pedido.id_pedido} className="bg-white rounded-lg shadow-md p-6 border">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">
                {formatarData(pedido.data_pedido)}
              </p>
              <h3 className="text-lg font-semibold mb-2">
                Pedido #{pedido.id_pedido}
              </h3>
            </div>
            
            {/* Área de confirmação de entrega */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  pedido.estado === 'Entregue' || pedido.entrega_confirmada
                    ? 'bg-green-100 text-green-800'
                    : pedido.estado === 'Em trânsito'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {pedido.entrega_confirmada ? 'Entrega Confirmada' : pedido.estado}
                </span>
                <p className="text-lg font-bold text-gray-900 mt-1">
                  kzs {Number(pedido.valor_total).toLocaleString()}
                </p>
              </div>
              
              {/* Botão de confirmação de entrega */}
              {pedido.estado === 'Em trânsito' && !pedido.entrega_confirmada && (
                <button
                  onClick={() => confirmarEntregaPedido(pedido)}
                  className="flex items-center justify-center w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl"
                  title="Confirmar entrega"
                >
                  <FaCheck size={20} />
                </button>
              )}
              
              {/* Ícone de confirmado */}
              {(pedido.estado === 'Entregue' || pedido.entrega_confirmada) && (
                <div className="flex items-center justify-center w-10 h-10 bg-green-500 text-white rounded-full shadow-lg">
                  <FaCheck size={20} />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</div>


        </main>
      </div>
      <Footer />
    </div>
  );
}