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
// Importando a função getProdutosDestaque
import { getProdutosDestaque } from "./Services/produtos"


export default function Home() {
  const [autenticado, setAutenticado] = useState<boolean | null>(null)
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [produtosDestaque, setProdutosDestaque] = useState<Produto[]>([]);

  interface Produto {
    id_produtos: number;
    nome: string;
    preco: number;
    foto_produto: string;
    vendedor: string;
    destaque: boolean;
    quantidade: number;
    Unidade: string;
  }

  useEffect(() => {
    async function fetchProdutosDestaque() {
      try {
        // Usando a função específica para buscar produtos em destaque
        const data = await getProdutosDestaque();
        setProdutosDestaque(data);
      } catch (error) {
        console.log("Erro ao buscar produtos em destaque:", error);
      }
    }
    fetchProdutosDestaque();
  }, []);

  // Atualização do estado de scroll sempre que o conteúdo muda
  useEffect(() => {
    if (scrollRef.current) {
      const updateScrollState = () => {
        const container = scrollRef.current;
        if (container) {
          setScrollPosition(container.scrollLeft);
          setMaxScroll(container.scrollWidth - container.clientWidth);
        }
      };

      // Atualiza estado inicial
      updateScrollState();

      // Adiciona listener para eventos de scroll
      scrollRef.current.addEventListener('scroll', updateScrollState);

      return () => {
        // Remove listener quando componente desmonta
        scrollRef.current?.removeEventListener('scroll', updateScrollState);
      };
    }
  }, [produtosDestaque]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const scrollAmount = 300;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      top: 0,
      behavior: "smooth"
    });

    // Habilita o botão esquerdo quando houver scroll
    setHasScrolled(true);
  };

  useEffect(() => {
    const checar = async () => {
      try {
        await verificarAuth();
        setAutenticado(true)
      } catch (error) {
        setAutenticado(false)
      }
    }
    checar()
  }, [])

  const redirecionamento = () => {
    if (autenticado === false) {
      router.push("/login")
    } else {
      router.push("/comecarcomprar")
    }
  }

  // Verifica se deve mostrar os botões de navegação
  const showLeftButton = hasScrolled && scrollPosition > 0;
  const showRightButton = scrollPosition < maxScroll;

  return (
    <div>
      <Navbar />

      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center 
    min-h-screen p-8 pb-20 gap-16 sm:p-20 mt-[46%] lg:mt-[16%] mb-20">


        <div className="backgroundimage">
          <h1 className=" text-[1rem] lg:text-[2rem] font-bold" > Conectando o Campo à sua Mesa  </h1>
          <p className="hidden lg:block ">Encontre produtos frescos direto dos produtores locais</p>
          <button onClick={redirecionamento} className="mt-1 bg-marieth text-white py-2 px-4 lg:mt-0 lg:py-4 lg:px-8 text-[1.1rem] border-none rounded-[5px] cursor-pointers hover:bg-verdeaceso transition-colors duration-150">
            Começar a Comprar
          </button>
        </div>


        <section className="max-w-[75rem] md:p-8 mb-16 lg:-mb-12 mt-44 lg:mt-24 ">
          <h1 className=" text-center mb-4 text-2xl mt-0 font-bold ">Categorias</h1>
          <div className="grid gap-6 grid-cols-2 md:grid-cols-5 ">
            <div className=" flex items-center justify-center bg-white p-6  rounded-[10px] lg:hover:shadow-xl text-center cursor-pointer shadow-custom lg:hover:translate-y-2 " >
              <h3 className="  font-medium text-[1.17rem] mb-[0.5rem]" ><Link href="./categoriafrutas"><FaAppleAlt className="mb-4 text-marieth text-[2.5rem] " />
                Frutas</Link>
              </h3>
            </div>
            <div className=" flex items-center justify-center bg-white p-6  rounded-[10px] lg:hover:shadow-xl text-center cursor-pointer shadow-custom  lg:hover:translate-y-2">
              <h3 className="font-medium text-[18.72px]  mb-[0.5rem]" ><Link href="./categoriaverdura"> <GiCabbage className="mb-4 ml-4  text-marieth text-[2.5rem]" />
                Verduras </Link></h3>
            </div>

            <div className=" flex justify-center items-center bg-white p-6  rounded-[10px] lg:hover:shadow-xl text-center cursor-pointer shadow-custom  lg:hover:translate-y-2" >
              <h3 className="  font-medium text-[18.72px]  mb-[0.5rem]" >
                <Link href="./categoriainsumo"> <FaSeedling className="mb-4 ml-11  text-marieth text-[2.5rem]" /> Insumos Agrícolas  </Link>
              </h3>
            </div>


            <div className=" flex items-cente justify-center bg-white p-6  rounded-[10px] lg:hover:shadow-xl text-center cursor-pointer shadow-custom  lg:hover:translate-y-2">
              <h3 className="  font-medium text-[18.72px]  mb-[0.5rem]" >
                <Link href="./categoriagrao"><LuWheat className="mb-4 ml-4  text-marieth text-[2.5rem]" /> Grãos</Link>
              </h3>
            </div>
            <div className=" flex items-center justify-center bg-white p-6  rounded-[10px] lg:hover:shadow-xl text-center cursor-pointer shadow-custom  lg:hover:translate-y-2" >
              <h3 className="  font-medium text-[18.72px]  mb-[0.5rem]" >
                <Link href="./categoriatuberraiz"  ><FaCarrot className=" text-marieth mb-4 text-[2.5rem] ml-10" /> Tubérculos e Raízes</Link>
              </h3>
            </div>
          </div>
        </section>

        <section className="relative w-full mt-[30px] mx-auto px-4 lg:mt-10">
          <h2 className="text-center text-2xl font-bold mb-6 lg:mb-6 ">Produtos em Destaque</h2>

          {showRightButton && (
            <button
              onClick={() => scroll("right")}
              className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 shadow-lg rounded-full z-10"
              aria-label="Ir para a direita"
              title="Ir para a direita"
            >
              <HiChevronRight size={40} />
            </button>
          )}

          <div 
            ref={scrollRef} 
            className="flex gap-6 overflow-x-auto p-4 scroll-smooth mt-[20%]  mb-[20%] lg:mb-0 lg:mt-0"
          >
            {produtosDestaque.length > 0 ? (
              produtosDestaque.map((produto, index) => (
                <Link href={`/DetalhesProduto/${produto.id_produtos}`} key={produto.id_produtos}>
                  <div className="w-[250px] h-[350px] rounded-[10px] shadow-custom bg-white overflow-hidden flex-shrink-0">
                    <Image src={produto.foto_produto} alt={produto.nome} height={200} width={250} className="object-cover w-full h-[200px]" />
                    <div className="p-4">
                      <h3 className="text-[1.1rem] mb-2 font-bold">{produto.nome}</h3>

                      <h3 className="text-[1.2rem] text-marieth font-bold">R$ {Number(produto.preco).toFixed(2)}/{produto.quantidade}{produto.Unidade}</h3>
                      <p className="text-[0.9rem] text-cortexto">Vendido por: {produto.vendedor}</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-center w-full mb-12 lg:mb-0 ">Nenhum produto em destaque</p>
            )}
          </div>

          {showLeftButton && (
            <button
              onClick={() => scroll("left")}
              className="hidden md:block absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 shadow-lg rounded-full z-10"
              aria-label="Ir para a esquerda"
              title="Ir para a esquerda"
            >
              <HiChevronLeft size={40} />
            </button>
          )}
        </section>
      </div>
      <Footer />
    </div>
  );
};