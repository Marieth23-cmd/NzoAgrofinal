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
import { adicionarProdutoAoCarrinho } from "../Services/cart";

export default function Vitrine() {
  interface Produto {
    id_produtos: number;
    nome: string;
    foto_produto: string;
    quantidade: number;
    Unidade: string;
    preco: number;
  }
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [avaliacoes, setAvaliacoes] = useState<{ [key: number]: number | null }>({});
  const [verMaisClicado, setVerMaisClicado] = useState(false);

  useEffect(() => {
    async function fetchProdutos() {
      try {
        const data = await getProdutos();
        setProdutos(data);

        const avaliacaoData: { [key: number]: number | null } = {};
        for (const produto of data) {
            const media = await buscarMediaEstrelas(produto.id_produtos);
            avaliacaoData[produto.id_produtos] = media?.media_estrelas || null;
          }
    
          setAvaliacoes(avaliacaoData);

      } catch (error:any) {
        alert(error.mensagem)
        console.log(error.mensagem || "Erro ao carregar produtos");
      }
    }

    fetchProdutos();
  }, []);

  const mostrarMaisProdutos = () => {
    setVerMaisClicado(true);
    setVisibleCount((prev) => prev + 12);
  };
  

  const produtosVisiveis = produtos.slice(0, visibleCount);
  const haMaisProdutos = visibleCount < produtos.length;

  const handleAdicionarAoCarrinho = async (id_produto: number) => {
    try {
      await adicionarProdutoAoCarrinho(id_produto.toString(), 1);
      alert("Produto adicionado ao carrinho com sucesso!");
    } catch (error: any) {
      alert(error.mensagem || "Erro ao adicionar o produto ao carrinho.");
    }
  };
  

  return (
    <div>
      <head>
        <title>Ver todos os Produtos</title>
      </head>

      <Navbar />

      <div className="flex flex-col mb-20 gap-2 mt-[25%] lg:mt-[15%] max-w-[1200px] shadow-custom p-4 lg:p-8 rounded-[10px] ml-8">
        <div className="p-4 lg:p-8">
          <div className="grid grid-cols-1 gap-8 p-4 lg:grid-cols-3 ">
            {produtosVisiveis.map((produto) => 
              <div
                key={produto.id_produtos}
                className="overflow-hidden bg-white rounded-[0.625rem]  shadow-custom transition-transform duration-150 ease-in-out transform hover:translate-y-[0.3125rem]"
              >
                {produto.foto_produto?(
                  <Image
                  src={produto.foto_produto}
                  alt={produto.nome}
                  height={200}
                  width={380}
                  className="w-full object-cover"
                />) : (
                  <div className="h-[200px] w-[380px] bg-gray-200 flex items-center text-center justify-center text-sm text-gray-500">
                    Imagem indisponível
                  </div>
                )}
                
                <div className="p-6">
                  <h3 className="text-[1.2rem] mb-2 text-profile font-semibold">
                    {produto.nome}
                  </h3>

                  <div className="flex gap-1 mb-2">
                  {avaliacoes[produto.id_produtos] ? (
                    <>
                    {[1, 2, 3, 4, 5].map((i) =>
                        i <= Math.floor(avaliacoes[produto.id_produtos]!) ? (
                        <FaStar key={i} className="text-amarela" />
                        ) : i - 0.5 === avaliacoes[produto.id_produtos] ? (
                        <FaRegStarHalfStroke key={i} className="text-amarela" />
                        ) : (
                        <FaRegStarHalfStroke key={i} className="text-gray-300" />
                        )
                    )}
                    <span className="text-amarela -mt-[4px] ml-2">
                        ({avaliacoes[produto.id_produtos]?.toFixed(1)})
                    </span>
                    </>
                ) : (
                    <p className="text-gray-500 text-sm">Sem avaliações</p>
                )}
                    </div>


                  <p className="text-[1.3rem] font-bold mb-4 text-marieth">
                    AOA {produto.preco.toLocaleString()}
                  </p>
                  <span>
                    {produto.quantidade}/{produto.Unidade}
                  </span>

                  <div className="flex flex-col gap-2 mt-4">
                    <Link
                      href={`/DetalhesProduto/${produto.id_produtos}`}
                      className="text-marieth text-center py-2 cursor-pointer px-4 transition-all duration-150 ease-in-out border-[1px] border-solid bg-cinza rounded-[0.3125rem] hover:bg-marieth hover:text-white"
                    >
                      Ver detalhes
                    </Link>
                    <button  onClick={() => handleAdicionarAoCarrinho(produto.id_produtos)}
                     className="hover:bg-verdeaceso py-2 cursor-pointer px-4 text-white bg-marieth transition-colors duration-150 ease-in-out rounded-[0.3125rem]">
                      Adicionar ao Carrinho
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {haMaisProdutos ? (
        <button
          onClick={mostrarMaisProdutos}
          className="block my-8 mx-auto bg-marieth cursor-pointer text-[1.1rem] text-white py-4 px-8 rounded-[0.3125rem] transition-colors ease-in-out hover:bg-verdeaceso"
        >
          Ver mais Produtos
        </button>
      ) : verMaisClicado ? (
        <p className="text-center text-gray-500 mt-8">
          Não há mais produtos a serem exibidos.
        </p>
      ) : null}

      </div>

      <Footer />
    </div>
  );
}
