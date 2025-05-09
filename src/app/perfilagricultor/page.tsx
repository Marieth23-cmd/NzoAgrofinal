"use client"
import { FaCamera, FaStar } from "react-icons/fa";
import Navbar from "../Components/Navbar";
import { FaCirclePlus, FaRegStarHalfStroke } from "react-icons/fa6"
import { IoCall } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import { MdEmail, MdMoreVert } from "react-icons/md";
import Footer from "../Components/Footer";
import { FaUser } from "react-icons/fa"
import { GrGallery, GrUpdate } from "react-icons/gr";
import { IoMdTrash } from "react-icons/io";
import Head from "next/head";
import React, { useState,useCallback, useRef, useEffect  } from 'react';
import { useRouter } from "next/navigation";
import { atualizarUsuario } from "../Services/user";
import Image from "next/image";
import Link from "next/link";
import {verificarAuth} from "../Services/auth"
import { getUsuarioById } from "../Services/user";

 export default function PerfilAgricultor(){
  
  const boxref = useRef<HTMLDivElement>(null);
  const [imagemPerfil, setimagemPerfil] = useState<string | null>(null);
  const inputCameraRef = useRef<HTMLInputElement>(null);
  const inputGalleryRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [isopen, setIsOpen] = useState(false);
  const [usuario, setUsuario] = useState<any>(null);
  const [autenticado, setAutenticado] = useState<boolean | null>(null);
  const [carregando, setCarregando] = useState(true);

  
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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imagUrl = URL.createObjectURL(file);
      setimagemPerfil(imagUrl);

      const formData = new FormData();
      formData.append("foto", file);

      try {
        await atualizarUsuario(formData);
        alert("Foto atualizada com sucesso");
      } catch (error) {
        console.log("Erro ao atualizar imagem", error);
        alert("Erro ao atualizar foto. Tente de novo mais tarde.");
      }
    }
  };

  const handleRemoverImagem = async () => {
    setimagemPerfil(null);
    const formData = new FormData();
    formData.append("foto", "");

    try {
      await atualizarUsuario(formData);
      alert("Imagem removida com sucesso!");
      setIsOpen(false);
    } catch (error) {
      console.log("Erro ao remover imagem", error);
    }
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


    return(
         
        <div>
            <Head>
               <title>Perfil Agricultor</title>
               </Head>
            <Navbar/>
            <div className="shadow-custom flex flex-col mb-20  gap-2 mt-[30%] lg:mt-[15%]  max-w-[1200px] justify-center items-center">
                
            <main className="my-8 max-w-[80rem] w-full  flex flex-col gap-8">
    <div className="lg:flex shadow-custom border-[0.7px] rounded-[10px] p-8 bg-white gap-8">
      
    <div className="absolute w-[12.5rem] h-[12.5rem] rounded-[50%] flex items-center text-[4rem]
 justify-center text-cortime bg-cinzab">
  {imagemPerfil ?(
    <Image src={imagemPerfil} alt="foto de Perfil" width={250} height={200}  fill className=" rounded-[50%] object-cover" />):
  ( <FaUser />)
  }
 
  </div>

<div className="mt-40 ml-[10.7rem]  relative z-[70]">
  <button onClick={togaleria} className="right-4 text-[1.5rem] text-marieth relative z-[50]" title="Editar Perfil">
    <FaCirclePlus />
  </button>
  </div>
  
  

        {isopen && ( 
          <div ref={boxref} className="left-20 bottom-[110px] bg-white rounded-[10px] z-[1000]
       shadow-custom absolute p-2">
      <button onClick={()=>inputCameraRef.current?.click()} className="flex items-center gap-2 w-full cursor-pointer border-none py-2
       px-4 bg-none transition-colors duration-100 text-profile hover:bg-light">
            <FaCamera/>Tirar foto </button>
          <button onClick={()=>inputGalleryRef.current?.click()} className="flex items-center gap-2 w-full cursor-pointer border-none 
          py-2 px-4 bg-none transition-colors duration-100 text-profile hover:bg-light">
            <GrGallery/>Galeria
          </button>
          <button onClick={()=> inputGalleryRef.current?.click()} className="flex items-center gap-2 w-full cursor-pointer border-none
           py-2 px-4 bg-none transition-colors duration-100 text-profile hover:bg-light">
            <GrUpdate/> Atualizar
          </button>

          <button onClick={handleRemoverImagem} className="flex items-center gap-2 w-full cursor-pointer border-none
           py-2 px-4 bg-none transition-colors duration-100 text-profile hover:bg-light"> 
            <IoMdTrash/> Remover
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

<label htmlFor="galeria" className="sr-only">galeria </label>
<input type="file" accept="image/*"   id="galeria" onChange={handleImageChange} className="hidden" ref={inputGalleryRef} />

          <div className="mt-4 lg:mt-0">
        <h1 className="text-[2rem] font-medium text-profile mb-2 " >
          {usuario?.nome || "Carregando..."}
          </h1>
        <div className=" flex text-[1.2rem] ">
                                 <FaStar className=" text-amarela"/>
                                 <FaStar className=" text-amarela"/>
                                 <FaStar className=" text-amarela"/>
                                 <FaStar className=" text-amarela"/>
                                 <FaRegStarHalfStroke className=" text-amarela" />
                <span className="text-amarela text-[1.2rem] mb-2" >(4.5)</span>
        
        </div>
        
        <p className="mb-2">Membro desde:
         { usuario?.data_criacao ? new Date(usuario.data_criacao).toLocaleDateString():"-"}</p>
        <p className="mb-2  ">Especialidade: <span className=" text-marieth font-medium">{usuario?.tipo_usuario || "Agricultor" }</span></p>
        <div className=" flex gap-4">
        
           <a href={`mailto:${usuario?.email}`}  className=" flex items-center gap-2 py-2 px-4 rounded-[0.3125rem] 
          text-[1rem] bg-marieth 
        transition-colors  cursor-pointer text-white hover:bg-verdeaceso"><MdEmail/>Email</a>
        
            <a href={`tel:${usuario?.contacto}`} className=" flex items-center gap-2 py-2 px-4 rounded-[0.3125rem] text-[1rem] bg-marieth 
        transition-colors  cursor-pointer text-white hover:bg-verdeaceso"><IoCall/>Ligar</a>
          
        </div>
        <h2 className="mt-4"> <a href="">{usuario?.descricao}</a></h2>
      </div>
      
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-8 mb-8">
      <div  className=" bg-white p-6 rounded-[10px] shadow-custom text-center  
      transition-transform  duration-300 hover:translate-y-[-5px]">
        <div  className=" text-[2rem]  text-marieth font-bold">250</div>
        <div  className="text-profile mt-2">Produtos Vendidos</div>
      </div >
      <div  className=" bg-white p-6 rounded-[10px] shadow-custom text-center  
      transition-transform duration-300 hover:translate-y-[-5px]">
        <div className=" text-[2rem]  text-marieth font-bold" >20</div>
        <div  className="text-profile mt-2">Produtos Ativos</div>
      </div>
      <div  className=" bg-white p-6 rounded-[10px] shadow-custom text-center  
      transition-transform  duration-300 hover:translate-y-[-5px]">
        <div  className=" text-[2rem]  text-marieth font-bold">4.5</div>
        <div  className="text-profile mt-2">Avaliação Média</div>
      </div>
      <div   className=" bg-white p-6 rounded-[10px] shadow-custom text-center  
      transition-transform  duration-300 hover:translate-y-[-5px]">
        <div  className=" text-[2rem]  text-marieth font-bold">98%</div>
        <div  className="text-profile mt-2">Taxa de Resposta</div>
      </div>
    </div>

    <section className=" bg-white p-8 shadow-custom rounded-[10px]" >
        <h2 className ="mb-6 text-profile font-semibold text-2xl">Produtos Cadastrados</h2>
      
      <div className="mt-2 grid grid-cols-1 mb-6 lg:grid-cols-3 gap-6" >
       
        <div className=" border-solid border-[1px] border-tab p-4
         transition-shadow duration-300 rounded-[10px] hover:shadow-custom" >
         <MdMoreVert className="right-3 text-[15px] mt-1"/>
          <div className="w-full mb-4 rounded-[5px] flex items-center justify-center h-[150px] text-cortime" >
            <Image src="/images/tomateorg.jpg" alt="Produto" width={250} height={200} className="object-cover w-full" />
          </div>
          <h3>Alface Fresca</h3>
          <p>Preço: 500 AOA</p>
          
          <div className="flex justify-between mt-2" >
          
            <button className="flex text-2xl">
               <FaStar className="text-amarela"/> 
               12
            </button>
            <button className=" bg-marieth rounded-[5px] p-3 text-white" >
               Promover Produto
            </button>
          </div>
        </div>
        </div>
        </section>
<div>
    <button className=" fixed transition-transform duration-300 
    cursor-pointer border-none rounded-[50%] flex justify-center text-white
    text-[1.5rem] h-[60px] w-[60px] hover:transform scale-110  bg-marieth bottom-8 right-8 shadow-custom items-center" title="Cadastrar Novo Produto">
        <Link href="/ProdCad" className="flex items-center justify-center h-full w-full">
          <FaPlus className="text-[2rem]"/>
        </Link>
    </button>
</div>
          
           </main> 
           
            </div>
            <Footer/>
         </div>






    )
 }
