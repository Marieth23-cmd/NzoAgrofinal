"use client"
import Image from "next/image"
import { AiOutlineShoppingCart } from "react-icons/ai"
import { BiBarChartSquare } from "react-icons/bi"
import { GoHome } from "react-icons/go";
import { IoPersonCircleOutline } from "react-icons/io5"
import { MdOutlinePersonOff } from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";
import { verificarAuth } from "../Services/auth"
import { useRouter } from "next/navigation"
import { getUsuarioById } from "../Services/user"
import { FaBars } from "react-icons/fa"
import React, { useState,useCallback, useRef, useEffect  } from 'react';
import { logout } from "../Services/auth";
import { badgeNotificacoes } from "../Services/notificacoes";

      

export default function Navbar() {
    const [tipoUsuario, setTipoUsuario] = useState<string | null>(null)
    const [menuAberto, setMenuAberto] = useState(false)
    const [autenticado ,setAutenticado]=useState <boolean | null> (null)
    const router=useRouter()
    const [isopen , setIsOpen]=useState(false)
     const boxref=useRef <HTMLDivElement>(null)

     const [notificacoesNaoLidas, setNotificacoesNaoLidas] = useState(0)
  
     const carregarNotificacoes = async () => {
       if (autenticado) {  
         try {
          console.log("🔔 Fazendo chamada para API...");
           const resposta = await badgeNotificacoes();
           setNotificacoesNaoLidas(resposta.total);
           console.log("🔔 Estado atualizado para:", resposta.total);
 
           console.log("Notificações não lidas:", resposta.total);
         } catch (error) {
          console.log("🔔 usuario não foi encontrado:", error);
           console.log("Erro ao carregar notificações não lidas:", error);
         }
       }
     };
     
   
     useEffect(() => {
      const checar = async () => {
        try {
          const authResponse = await verificarAuth();
          if (!authResponse) {
            setAutenticado(false);
            return;
          }
    
          setAutenticado(true);
    
          const usuario = await getUsuarioById();
          console.log("Usuário retornado pela API:", usuario); 
          if (usuario && usuario.tipo_usuario) {
            setTipoUsuario(usuario.tipo_usuario);
            console.log("Usuário autenticado:", usuario);

            carregarNotificacoes(); // Carregar notificações não lidas
          } else {
            console.log("Tipo de usuário não encontrado.");
          }
    
        } catch (error) {
          console.log("Erro ao verificar autenticação:", error);
          setAutenticado(false);
        }

      };
    
      checar();
    }, []);
    
      
      
console.log("Tipo de usuário:", tipoUsuario);
const redirecionar = async (rotaPersonalizada?: string): Promise<void> => {
  try {
    const authResult = await verificarAuth();
    
    if (!authResult) {
      setAutenticado(false);
      router.push("/login");
      return;
    }
    
    setAutenticado(true);
    
    // Se já temos o tipo de usuário, use-o diretamente
    if (tipoUsuario) {
      if (rotaPersonalizada) {
        router.push(rotaPersonalizada);
        return;
      }

      if (tipoUsuario === "Comprador") {
        router.push("/perfilcomprador");
      } else if (tipoUsuario === "Agricultor") {
        router.push("/perfilagricultor");
      } else if (tipoUsuario === "Fornecedor") {
        router.push("/perfilfornecedor");
      } else {
        console.log("Tipo de usuário desconhecido:", tipoUsuario);
        router.push("/");
      }
    } else {
      // Se não temos o tipo de usuário, busque-o
      const usuario = await getUsuarioById();
      if (usuario && usuario.tipo_usuario) {
        setTipoUsuario(usuario.tipo_usuario);
        
        if (rotaPersonalizada) {
          router.push(rotaPersonalizada);
          return;
        }

        if (usuario.tipo_usuario === "Comprador") {
          router.push("/perfilcomprador");
        } else if (usuario.tipo_usuario === "Agricultor") {
          router.push("/perfilagricultor");
        } else if (usuario.tipo_usuario === "Fornecedor") {
          router.push("/perfilfornecedor");
        } else {
          console.log("Tipo de usuário desconhecido:", usuario.tipo_usuario);
          router.push("/");
        }
      } else {
        console.log("Não foi possível obter tipo de usuário");
        router.push("/login");
      }
    }
  } catch (error) {
    console.log("Erro na verificação de autenticação:", error);
    setAutenticado(false);
    router.push("/login");
  }
};

const handleClick = useCallback((event: MouseEvent) => {
    if (boxref.current && !boxref.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isopen) {
      document.addEventListener("mousedown", handleClick);
    } else {
      document.removeEventListener("mousedown", handleClick);
    }

       return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [isopen, handleClick]);


  const handleLogout = async () => {
    try {
      await logout();
      setAutenticado(false); 
      router.push("/login");
    } catch (error) {
      console.log("Erro ao terminar sessão:", error);
    }
  };

  console.log("🔔 Estado final:", { 
  autenticado, 
  tipoUsuario, 
  notificacoesNaoLidas,
  mostraBadge: notificacoesNaoLidas > 0 
});

  

    return (

        <nav className=" flex justify-between max-w-full  -mt-[11rem] border-b-[1px] 
         bg-white p-2 shadow-sm top-0 sticky z-[100] ">

            <div className=" flex items-center max-w-[75rem]"  >
                <div className=" flex items-center gap-4 ">
                    <Image src="/images/logo.jpg" alt="logotipo" width={55} height={55}/>
                    <p className="text-[1.5rem] lg:text-2xl text-marieth font-bold">NzoAgro</p>
                </div >
            </div>

            <ul className="mt-[1rem] ml-[33rem] gap-8 hidden lg:flex">
                <li onClick={()=>router.push("/")} className=" cursor-pointer hover:text-marieth "> 
                     <GoHome className="gap-2 text-[1.6rem] ml-2" /> 
                    
                    </li>
                
                
                <li className=" cursor-pointer hover:text-marieth "
                 onClick={()=>redirecionar("./carrinho")}>
                      <AiOutlineShoppingCart className="gap-2 text-[1.6rem] ml-5" />  
                     
                     </li>
                
          {/* <li className="cursor-pointer hover:text-marieth relative" 
         onClick={()=>redirecionar("./notificacoes")}> 
          <div className="relative">
            <IoMdNotificationsOutline className="gap-2 text-[1.6rem] ml-8" /> 
            {notificacoesNaoLidas > 0 && (
              <span className="absolute -top-2 -right-2 bg-vermelho text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {notificacoesNaoLidas}
              </span>
            )}
          </div>
            
        </li> */}


                  <li className="cursor-pointer hover:text-marieth relative" 
              onClick={()=>redirecionar("./notificacoes")}> 
            <div className="relative inline-block">
              <IoMdNotificationsOutline className="gap-2 text-[1.6rem] ml-8" /> 
              {notificacoesNaoLidas > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full min-w-[20px] h-5 flex items-center justify-center text-xs font-bold border-2 border-white">
                  {notificacoesNaoLidas}
                </span>
              )}
            </div>
          </li>
                          
                
                <li className=" cursor-pointer hover:text-marieth "
                onClick={()=>redirecionar("./relatoriocomprador")}>
                     <BiBarChartSquare className="gap-2 ml-6 text-[1.6rem] " /> 
                    
                    </li>
                
                <li className=" cursor-pointer hover:text-marieth "
                onClick={()=>redirecionar()}> 
                    <IoPersonCircleOutline className="gap-2  text-[1.6rem] ml-2  " />
                    
                    </li>

            </ul>

            
      <div className="lg:hidden">
      <FaBars  className="text-2xl mt-2 cursor-pointer hover:text-marieth" onClick={() =>{ setMenuAberto(!menuAberto)
       setIsOpen(true)}} />
    </div>

    
    {menuAberto && isopen && (
      <div ref={boxref} className="absolute top-16 right-2 bg-white border shadow-custom p-4 w-[200px] z-[999] rounded-xl">
        <ul className="flex flex-col gap-4">

        <li onClick={()=>router.push("/")} className="text-[1rem] cursor-pointer hover:text-marieth "> 
                     <GoHome className="inline mr-2"/> Inicio </li>
                
          
          <li className="text-[1rem] cursor-pointer hover:text-marieth" onClick={() => redirecionar("./carrinho")}>
            <AiOutlineShoppingCart className="inline mr-2" />
            Carrinho
          </li>
                  <li
          className="text-[1rem] cursor-pointer hover:text-marieth relative"
          onClick={() => redirecionar("./notificacoes")}
        >
          <IoMdNotificationsOutline className="inline mr-2" />
          {notificacoesNaoLidas > 0 && (
            <span className="absolute top-0 right-4 bg-vermelho text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {notificacoesNaoLidas}
            </span>
          )}
          Notificações
        </li>

          <li className="text-[1rem] cursor-pointer hover:text-marieth" onClick={() => redirecionar("./relatoriocomprador")}>
            <BiBarChartSquare className="inline mr-2" />
            Relatórios
          </li>
          <li className="text-[1rem] cursor-pointer hover:text-marieth" onClick={() => redirecionar()}>
            <IoPersonCircleOutline className="inline mr-2" />
            Minha conta
          </li>
          <li className="text-[1rem] cursor-pointer hover:text-vermelho" onClick={handleLogout}>
            <MdOutlinePersonOff  className="inline mr-2" />
            Terminar Sessão
          </li>
        </ul>
      </div>
    )}

        </nav>



    )

}