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
import { FaTimes } from "react-icons/fa";
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
        
        //
        //  Buscar dados do usuário
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

const cancelarPedido = async (pedido: Pedido) => {
  // usar a logica aqui para cancelar o pedido
  toast.info("Função de cancelamento ainda não implementada");
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


const solicitarReembolso = async (pedido: Pedido) => {
  try {
    // Aqui você implementaria a lógica de reembolso
    // Por exemplo, uma API call para solicitar reembolso
    
    toast.info("Solicitação de reembolso enviada. Aguarde análise.");
    
    // Atualizar o estado local se necessário
    setPedidos(prevPedidos => 
      prevPedidos.map(p => 
        p.id_pedido === pedido.id_pedido 
          ? { ...p, estado: 'Reembolso Solicitado' }
          : p
      )
    );
    
  } catch (error: any) {
    console.error('Erro ao solicitar reembolso:', error);
    toast.error('Erro ao solicitar reembolso. Tente novamente.');
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
            <MdOutlinePersonOff size={28} /> Terminar Sessão
          </button>
        </div>
      )}
    </div>
  </div>

  {/* DESCRIÇÃO MOVIDA PARA CIMA - Mais destaque */}
  {usuario?.descricao && (
    <div className="mb-4 p-3 bg-gray-50 rounded-lg border-l-4 border-marieth">
      <p className="text-gray-700 text-sm italic leading-relaxed">
        "{usuario.descricao}"
      </p>
    </div>
  )}

  {/* Informações básicas */}
  <div className="mb-4 space-y-1">
    <p className="text-sm text-gray-600">
      Membro desde: {usuario?.data_criacao ? new Date(usuario.data_criacao).toLocaleDateString() : "-"}
    </p>
    <p className="text-sm text-gray-600">
      Especialidade: <span className="text-marieth font-medium">{usuario?.tipo_usuario || "Comprador"}</span>
    </p>
  </div>

  {/* Botões de ação por último */}
  <div className="flex gap-4">
    <a 
      href={`mailto:${usuario?.email}`} 
      className="flex items-center gap-2 py-2 px-4 rounded-[0.3125rem] text-[1rem] bg-marieth transition-colors cursor-pointer text-white hover:bg-verdeaceso"
    >
      <MdEmail />Email
    </a>

    <a 
      href={`tel:${usuario?.contacto}`} 
      className="flex items-center gap-2 py-2 px-4 rounded-[0.3125rem] text-[1rem] bg-marieth transition-colors cursor-pointer text-white hover:bg-verdeaceso"
    >
      <IoCall />Ligar
    </a>
  </div>
</div>
 </div>

<div className="bg-white rounded-lg shadow-custom border p-6">
  <h2 className="text-2xl font-bold mb-6 text-profile">Histórico de Compras</h2>
  
  {carregandoPedidos ? (
    <div className="text-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-marieth mx-auto mb-4"></div>
      <p className="text-gray-600">Carregando histórico de pedidos...</p>
    </div>
  ) : pedidos.length === 0 ? (
    <div className="text-center py-12">
      <FaBox className="mx-auto h-16 w-16 text-gray-400 mb-4" />
      <p className="text-gray-600 mb-4">Você ainda não realizou nenhuma compra.</p>
      <button
        onClick={() => router.push('/TodosProdutos')}
        className="bg-marieth text-white py-2 px-6 rounded-md hover:bg-verdeaceso transition-colors"
      >
        Explorar produtos
      </button>
    </div>
  ) : (
    <div className="space-y-6">
      {pedidos.map((pedido) => (
        <div key={pedido.id_pedido} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          
          {/* Cabeçalho do Pedido */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4 gap-4">
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-2">
                <h3 className="text-xl font-bold text-profile">
                  Pedido #{pedido.id_pedido}
                </h3>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium w-fit ${
                  pedido.estado === 'Entregue' || pedido.entrega_confirmada
                    ? 'bg-green-100 text-green-800'
                    : pedido.estado === 'Cancelado'
                    ? 'bg-red-100 text-red-800'
                    : pedido.estado === 'Em trânsito'
                    ? 'bg-yellow-100 text-yellow-800'
                    : pedido.estado === 'Pendente' || pedido.estado === 'pendente'
                    ? 'bg-blue-100 text-blue-800'
                    : pedido.estado === 'expirado'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {pedido.entrega_confirmada ? 'Recebimento Confirmado' : 
                   pedido.estado === 'pendente' ? 'Pendente' :
                   pedido.estado === 'expirado' ? 'Expirado' :
                   pedido.estado}
                </span>
              </div>
              
              <div className="text-sm text-gray-600 space-y-1">
                <p>Data do pedido: {formatarData(pedido.data_pedido)}</p>
                {pedido.transacao_id && (
                  <p>ID da transação: #{pedido.transacao_id}</p>
                )}
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-2xl font-bold text-marieth">
                {Number(pedido.valor_total).toLocaleString()} kzs
              </p>
            </div>
          </div>

          {/* Ações do Pedido */}
          <div className="border-t pt-4">
            {(() => {
              const estado = pedido.estado?.toLowerCase();
              
              switch (estado) {
                case 'pendente':
                  return (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => cancelarPedido(pedido)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                      >
                        <FaTimes size={16} />
                        Cancelar Pedido
                      </button>
                      <p className="text-sm text-gray-600 flex items-center">
                        Aguardando processamento...
                      </p>
                    </div>
                  );

                case 'em trânsito':
                case 'em transito':
                  return (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => confirmarEntregaPedido(pedido)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
                      >
                        <FaCheck size={16} />
                        Confirmar Recebimento
                      </button>
                      <button
                        onClick={() => cancelarPedido(pedido)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                      >
                        <FaTimes size={16} />
                        Cancelar Pedido
                      </button>
                      <p className="text-sm text-gray-600 flex items-center">
                        Produto a caminho. Confirme quando receber.
                      </p>
                    </div>
                  );

                case 'entregue':
                  if (!pedido.entrega_confirmada) {
                    return (
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => confirmarEntregaPedido(pedido)}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
                        >
                          <FaCheck size={16} />
                          Confirmar Recebimento
                        </button>
                        <button
                          onClick={() => solicitarReembolso(pedido)}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors"
                        >
                          <FaRegStarHalfStroke size={16} />
                          Solicitar Reembolso
                        </button>
                        <p className="text-sm text-gray-600 flex items-center">
                          Produto entregue. Confirme o recebimento.
                        </p>
                      </div>
                    );
                  } else {
                    return (
                      <div className="flex flex-col sm:flex-row gap-3 items-start">
                        <div className="flex items-center gap-2 text-green-600">
                          <FaCheck size={16} />
                          <span className="font-medium">Recebimento confirmado</span>
                        </div>
                        <button
                          onClick={() => solicitarReembolso(pedido)}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors text-sm"
                        >
                          <FaRegStarHalfStroke size={14} />
                          Solicitar Reembolso
                        </button>
                        <p className="text-sm text-gray-600">
                          Pedido concluído com sucesso.
                        </p>
                      </div>
                    );
                  }

                case 'cancelado':
                  return (
                    <div className="flex items-center gap-2 text-red-600">
                      <FaTimes size={16} />
                      <span className="font-medium">Pedido cancelado</span>
                      <p className="text-sm text-gray-600 ml-4">
                        Este pedido foi cancelado.
                      </p>
                    </div>
                  );

                case 'expirado':
                  return (
                    <div className="flex flex-col sm:flex-row gap-3 items-start">
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="font-medium">Pedido expirado</span>
                      </div>
                      <button
                        onClick={() => solicitarReembolso(pedido)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors text-sm"
                      >
                        <FaRegStarHalfStroke size={14} />
                        Solicitar Reembolso
                      </button>
                      <p className="text-sm text-gray-600">
                        Tempo limite excedido. Você pode solicitar reembolso.
                      </p>
                    </div>
                  );

                case 'reembolsado':
                  return (
                    <div className="flex items-center gap-2 text-blue-600">
                      <FaRegStarHalfStroke size={16} />
                      <span className="font-medium">Reembolso processado</span>
                      <p className="text-sm text-gray-600 ml-4">
                        O valor foi reembolsado.
                      </p>
                    </div>
                  );

                default:
                  return (
                    <div className="flex items-center gap-2 text-gray-600">
                      <span>Status: {pedido.estado}</span>
                    </div>
                  );
              }
            })()}
          </div>

          {/* Informações adicionais baseadas no estado */}
          {(pedido.estado?.toLowerCase() === 'em trânsito' || pedido.estado?.toLowerCase() === 'em transito') && (
            <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
              <p className="text-sm text-yellow-800">
                <strong>Importante:</strong> Só confirme o recebimento depois de receber e verificar o produto.
              </p>
            </div>
          )}

          {pedido.estado?.toLowerCase() === 'entregue' && !pedido.entrega_confirmada && (
            <div className="mt-4 p-3 bg-green-50 border-l-4 border-green-400 rounded">
              <p className="text-sm text-green-800">
                <strong>Produto entregue!</strong> Confirme o recebimento para finalizar seu pedido.
              </p>
            </div>
          )}
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