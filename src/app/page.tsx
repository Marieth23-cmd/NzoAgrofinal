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
import { getProdutosDestaque } from "./Services/produtos"

export default function Home() {
  const [autenticado, setAutenticado] = useState<boolean | null>(null)
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [produtosDestaque, setProdutosDestaque] = useState<Produto[]>([]);
  const refBackground = useRef<HTMLDivElement>(null);

  interface Produto {
    id_produtos: number;
    nome: string;
    preco: number;
    foto_produto: string;
    nome_vendedor: string;
    destaque: boolean;
    quantidade: number;
    Unidade: string;
  }

  const imagens = [
    "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    "https://img.freepik.com/fotos-gratis/paisagem-prado-ensolarado_1112-134.jpg?semt=ais_hybrid&w=740",
    "https://medias.revistaoeste.com/wp-content/uploads/2020/07/Agro.jpg"
  ];

  // useEffect para troca de imagens de fundo com transição slide
  useEffect(() => {
    let index = 0;
    
    // Pré-carregamento das imagens para evitar delay
    const preloadImages = () => {
      imagens.forEach((src, index) => {
        const img = new window.Image();
        img.onload = () => console.log(`Imagem ${index + 1} carregada:`, src);
        img.onerror = () => console.error(`Erro ao carregar imagem ${index + 1}:`, src);
        img.src = src;
      });
    };
    
    preloadImages();
    
    // Configurar estilos iniciais
    if (refBackground.current) {
      refBackground.current.style.position = 'relative';
      refBackground.current.style.overflow = 'hidden';
      // Definir primeira imagem imediatamente
      refBackground.current.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${imagens[0]}')`;
      refBackground.current.style.backgroundSize = 'cover';
      refBackground.current.style.backgroundPosition = 'center';
    }
    
    const trocarImagem = () => {
      if (refBackground.current) {
        index = (index + 1) % imagens.length;
        console.log(`Trocando para imagem ${index + 1}:`, imagens[index]);
        
        // Criar elemento temporário para a nova imagem
        const novaImagem = document.createElement('div');
        novaImagem.style.position = 'absolute';
        novaImagem.style.top = '0';
        novaImagem.style.left = '100%'; // Começar fora da tela (direita)
        novaImagem.style.width = '100%';
        novaImagem.style.height = '100%';
        novaImagem.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${imagens[index]}')`;
        novaImagem.style.backgroundSize = 'cover';
        novaImagem.style.backgroundPosition = 'center';
        novaImagem.style.transition = 'left 1s ease-in-out';
        novaImagem.style.zIndex = '1';
        
        // Adicionar nova imagem ao container
        refBackground.current.appendChild(novaImagem);
        
        // Trigger da animação (slide da direita para esquerda)
        setTimeout(() => {
          novaImagem.style.left = '0'; // Mover para posição final
        }, 10);
        
        // Após a transição, trocar o background e remover elemento temporário
        setTimeout(() => {
          if (refBackground.current) {
            refBackground.current.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${imagens[index]}')`;
            refBackground.current.removeChild(novaImagem);
          }
        }, 1000); // Tempo da transição
      }
    };

    // Primeira troca após 5 segundos
    const intervalo = setInterval(trocarImagem, 5000);

    return () => {
      clearInterval(intervalo);
    };
  }, []);

  useEffect(() => {
    async function fetchProdutosDestaque() {
      try {
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

      updateScrollState();
      scrollRef.current.addEventListener('scroll', updateScrollState);

      return () => {
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
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      
        <Navbar />
      
      
      <div>
        {/* Seção Hero com troca de imagens */}
        <div className="relative w-full mt-[20%] sm:mt-[5%] md:mt-[10%] lg:mt-[15%]">
          {/* Container só para as imagens de fundo */}
          <div 
            ref={refBackground}
            className="backgroundimage w-full  h-[280px] sm:h-[320px] lg:h-[380px] flex justify-center items-center"
          />
          
          {/* Conteúdo fixo sobreposto - posição absoluta para não ser afetado pelas transições */}
          <div className="absolute inset-0 w-full flex justify-center items-center z-10">
            <div className="w-full max-w-3xl px-4 flex flex-col items-center text-white">
              <h1 className="  text-[1.4rem] lg:text-[2rem] font-bold text-center w-full">
                Conectando o Campo à sua Mesa
              </h1>
              <p className=" text-center w-full hidden lg:block">
                Encontre produtos frescos direto dos produtores locais
              </p>
              <button 
                onClick={redirecionamento} 
                className="mt-1 bg-marieth text-white py-2 px-4 lg:mt-2 lg:py-4 lg:px-8 text-[1.1rem] border-none rounded-[5px] cursor-pointers hover:bg-verdeaceso transition-colors duration-150"
              >sss
                Começar a Comprar
              </button>
            </div>
          </div>
        </div>
        
        {/* Resto do conteúdo */}
        <div className="flex-grow flex flex-col items-center justify-start w-full px-4 sm:px-8 lg:px-16 gap-6 mt-12 lg:mt-16">
          <section className="w-full max-w-[75rem] px-4 sm:px-8 mt-2">
            <h1 className="text-center mb-3 text-2xl font-bold">Categorias</h1>
            <div className="grid gap-3 sm:gap-6 grid-cols-2 md:grid-cols-5">
              <div className="flex items-center justify-center bg-white p-4 sm:p-6 rounded-[10px] lg:hover:shadow-xl text-center cursor-pointer shadow-custom lg:hover:translate-y-2">
                <h3 className="font-medium text-[1rem] sm:text-[1.17rem] mb-[0.5rem]">
                  <Link href="./categoriafrutas">
                    <FaAppleAlt className="mb-4 text-marieth text-[2rem] sm:text-[2.5rem]" />
                    Frutas
                  </Link>
                </h3>
              </div>
              <div className="flex items-center justify-center bg-white p-4 sm:p-6 rounded-[10px] lg:hover:shadow-xl text-center cursor-pointer shadow-custom lg:hover:translate-y-2">
                <h3 className="font-medium text-[1rem] sm:text-[18.72px] mb-[0.5rem]">
                  <Link href="./categoriaverdura">
                    <GiCabbage className="mb-4 ml-2 sm:ml-4 text-marieth text-[2rem] sm:text-[2.5rem]" />
                    Verduras
                  </Link>
                </h3>
              </div>
              <div className="flex justify-center items-center bg-white p-4 sm:p-6 rounded-[10px] lg:hover:shadow-xl text-center cursor-pointer shadow-custom lg:hover:translate-y-2">
                <h3 className="font-medium text-[1rem] sm:text-[18.72px] mb-[0.5rem]">
                  <Link href="./categoriainsumo">
                    <FaSeedling className="mb-4 ml-4 sm:ml-11 text-marieth text-[2rem] sm:text-[2.5rem]" /> 
                    Insumos Agrícolas
                  </Link>
                </h3>
              </div>
              <div className="flex items-center justify-center bg-white p-4 sm:p-6 rounded-[10px] lg:hover:shadow-xl text-center cursor-pointer shadow-custom lg:hover:translate-y-2">
                <h3 className="font-medium text-[1rem] sm:text-[18.72px] mb-[0.5rem]">
                  <Link href="./categoriagrao">
                    <LuWheat className="mb-4 ml-2 sm:ml-4 text-marieth text-[2rem] sm:text-[2.5rem]" /> 
                    Grãos
                  </Link>
                </h3>
              </div>
              <div className="flex items-center justify-center bg-white p-4 sm:p-6 rounded-[10px] lg:hover:shadow-xl text-center cursor-pointer shadow-custom lg:hover:translate-y-2">
                <h3 className="font-medium text-[1rem] sm:text-[18.72px] mb-[0.5rem]">
                  <Link href="./categoriatuberraiz">
                    <FaCarrot className="text-marieth mb-4 text-[2rem] sm:text-[2.5rem] ml-4 sm:ml-10" /> 
                    Tubérculos e Raízes
                  </Link>
                </h3>
              </div>
            </div>
          </section>

          <section className="w-full max-w-[1200px] mb-20">
            <h2 className="text-center text-2xl font-bold mb-6">Produtos em Destaque</h2>
            
            <div className="relative">
              {produtosDestaque.length > 4 && showRightButton && (
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
                className="flex gap-4 sm:gap-6 overflow-x-auto py-2 px-1 scroll-smooth scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
                style={{ scrollbarWidth: produtosDestaque.length <= 4 ? 'none' : 'auto', msOverflowStyle: produtosDestaque.length <= 4 ? 'none' : 'auto' }}
              >
                {produtosDestaque.length > 0 ? (
                  produtosDestaque.map((produto) => (
                    <Link href={`/DetalhesProduto/${produto.id_produtos}`} key={produto.id_produtos} className="flex-shrink-0">
                      <div className="w-[260px] sm:w-[300px] h-[320px] sm:h-[350px] rounded-[10px] shadow-custom bg-white overflow-hidden">
                        <div className="w-full h-[180px] sm:h-[200px] relative">
                          <Image 
                            src={produto.foto_produto} 
                            alt={produto.nome} 
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-3 sm:p-4">
                          <h3 className="text-[1rem] sm:text-[1.1rem] mb-1 sm:mb-2 font-bold">{produto.nome}</h3>
                          <h3 className="text-[1.1rem] sm:text-[1.2rem] text-marieth font-bold">
                            kzs {Number(produto.preco).toFixed(2)}/{produto.quantidade}{produto.Unidade}
                          </h3>
                          <p className="text-[0.8rem] sm:text-[0.9rem] text-cortexto">Vendido por: {produto.nome_vendedor}</p>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-center w-full py-8">Nenhum produto em destaque</p>
                )}
              </div>
              
              {produtosDestaque.length > 3 && showLeftButton && (
                <button
                  onClick={() => scroll("left")}
                  className="hidden md:block absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 shadow-lg rounded-full z-10"
                  aria-label="Ir para a esquerda"
                  title="Ir para a esquerda"
                >
                  <HiChevronLeft size={40} />
                </button>
              )}
            </div>
          </section>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}