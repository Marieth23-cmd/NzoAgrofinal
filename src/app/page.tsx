"use client";
import Image from "next/image";
import Footer from "./Components/Footer";
import { FaAppleAlt, FaCarrot, FaSeedling } from "react-icons/fa";
import { GiCabbage } from "react-icons/gi";
import Link from "next/link";
import Navbar from "./Components/Navbar";
import { LuWheat } from "react-icons/lu";
import { verificarAuth } from "./Services/auth"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { useRef } from "react";
import {getProdutos} from "./Services/produtos"


export default function Home() {
   const [autenticado , SetAutenticado]=useState<boolean |null>(null)
    const router= useRouter();
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const [hasScrolled, setHasScrolled] = useState(false);

    const [produtosDestaque, setProdutosDestaque] = useState<Produto[]>([]);


    interface Produto {
      id_produtos: number;
      nome: string;
      preco: number;
      imagem: string;
      vendedor:string;
      destaque: boolean;
      quantidade:number
      unidade:string;
    }
    



  useEffect(() => {
    async function fetchProdutos() {
      try {
        const data = await getProdutos();
        const produtosDestaque=data.filter((produto:Produto)=> produto.destaque===true)
        setProdutosDestaque(produtosDestaque);
       
      } catch (error) {
        console.log("Erro ao buscar produtos:", error);
      }
    }
    fetchProdutos();
  }, []);

  const scroll = (direction: "left" | "right") => {
  if (!scrollRef.current) return;

  const scrollAmount = 300;
  scrollRef.current.scrollBy({
    left: direction === "left" ? -scrollAmount : scrollAmount,
    top: 0, // Adicionando 'top' para atender ao tipo ScrollToOptions
    behavior: "smooth"
  });

  if(direction==="right")
    setHasScrolled(true)
};

  


  useEffect(()=>{
    const checar= async() =>{ 
      try {
         await verificarAuth();
        SetAutenticado(true)
      } catch (error) {
        SetAutenticado(false)
        
      }
    }
      checar()


    
    } , [])  
     const redirecionamento=()=>{
       if(autenticado=== false){
        router.push("/login")
     }   else{
      router.push("/comecarcomprar")
    }
     }

    

     

  return (
    <div>

       
      <Navbar />

      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center 
    min-h-screen p-8 pb-20 gap-16 sm:p-20 mt-[16%] mb-20 ">


        <div className="backgroundimage">
          <h1 className="text-[2rem] font-bold" > Conectando o Campo à sua Mesa  </h1>
          <p>Encontre produtos frescos direto dos produtores locais</p>
          <button onClick={redirecionamento} className=" bg-marieth text-white py-4 px-8 text-[1.1rem] border-none rounded-[5px] cursor-pointers hover:bg-verdeaceso transition-colors duration-150">
           Começar a Comprar
          </button>
        </div>


        <section className="max-w-[75rem] md:p-8 -mb-12  mt-24 ">
          <h1 className=" text-center mb-4 text-2xl mt-0 font-bold ">Categorias</h1>
          <div className="grid gap-6 grid-cols-2 md:grid-cols-5 ">
            <div className=" flex items-center justify-center bg-white p-6  rounded-[10px] hover:shadow-xl text-center cursor-pointer shadow-custom   hover:translate-y-2 " >
              <h3 className="  font-medium text-[1.17rem] mb-[0.5rem]" >        <Link href="./categoriafrutas"><FaAppleAlt className="mb-4 text-marieth text-[2.5rem] " />
                Frutas</Link>
              </h3>
            </div>
            <div className=" flex items-center justify-center bg-white p-6  rounded-[10px] hover:shadow-xl text-center cursor-pointer shadow-custom  hover:translate-y-2">
              <h3 className="  font-medium text-[18.72px]  mb-[0.5rem] " ><Link href="./categoriaverdura"> <GiCabbage className="mb-4 ml-4  text-marieth text-[2.5rem]" />
                Verduras </Link></h3>
            </div>

            <div className=" flex justify-center items-center bg-white p-6  rounded-[10px] hover:shadow-xl text-center cursor-pointer shadow-custom  hover:translate-y-2" >
              <h3 className="  font-medium text-[18.72px]  mb-[0.5rem]" >
                <Link href="./categoriainsumo"> <FaSeedling className="mb-4 ml-11  text-marieth text-[2.5rem]" /> Insumos Agrícolas  </Link>
              </h3>
            </div>


            <div className=" flex items-cente justify-center bg-white p-6  rounded-[10px] hover:shadow-xl text-center cursor-pointer shadow-custom  hover:translate-y-2">
              <h3 className="  font-medium text-[18.72px]  mb-[0.5rem]" >
                <Link href="./categoriagrao"><LuWheat className="mb-4 ml-4  text-marieth text-[2.5rem]" /> Grãos</Link>
              </h3>
            </div>
            <div className=" flex items-center justify-center bg-white p-6  rounded-[10px] hover:shadow-xl text-center cursor-pointer shadow-custom  hover:translate-y-2" >
              <h3 className="  font-medium text-[18.72px]  mb-[0.5rem]" >
                <Link href="./categoriatuberraiz"  ><FaCarrot className=" text-marieth mb-4 text-[2.5rem] ml-10" /> Tubérculos e Raízes</Link>
              </h3>
            </div>     
                      </div>
                      </section>

                      <section className="relative w-full mx-auto px-4 mt-10">
      <h2 className="text-center text-2xl font-bold mb-6">Produtos em Destaque</h2>
      
     {produtosDestaque.length>3 &&(<button 
  onClick={() => scroll("right")} 
  className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 shadow-lg rounded-full"
  aria-label="Ir para a direita"
  title="Ir para a direita"
>
  <HiChevronRight size={40} />
</button>)} 
      
      
      <div ref={scrollRef} className="flex gap-6 overflow-x-auto md:overflow-hidden p-4 scroll-smooth">
        {produtosDestaque.length > 0 ? (
          produtosDestaque.map((produto, index) => (
            <Link href={`/DetalhesProduto/${produto.id_produtos}`}
            >
            <div key={index} className="w-[250px] h-[350px] rounded-[10px] shadow-custom bg-white overflow-hidden flex-shrink-0">
              <Image src={produto.imagem} alt={produto.nome} height={200} width={250} className="object-cover w-full h-[200px]" />
              <div className="p-4">
                <h3 className="text-[1.1rem] mb-2 font-bold">{produto.nome}</h3>
                
                <h3 className="text-[1.2rem] text-marieth font-bold">{produto.preco}/{produto.quantidade}{produto.unidade}</h3>
                <p className="text-[0.9rem] text-cortexto">Vendido por: {produto.vendedor}</p>
              </div>
              
            </div>
            </Link>
          ))
        ) : (
          <p className="text-center w-full ">Nenhum produto em destaque</p>
        )}
        
      </div>
      
     {hasScrolled &&(<button 
  onClick={() => scroll("left")} 
  className="hidden md:block absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 shadow-lg rounded-full"
  aria-label="Ir para a esquerda"
  title="Ir para a esquerda"
>
  <HiChevronLeft size={40} />
</button>)} 
</section>






                      
      </div>
      <Footer />
    </div>


  );
};
