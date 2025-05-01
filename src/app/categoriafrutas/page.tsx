"use client"
import { BiSearch } from "react-icons/bi"
import Footer from "../Components/Footer"
import Navbar from "../Components/Navbar"
import Image from "next/image"
import Head from "next/head"
import Link from "next/link"
import { useEffect, useState } from "react"
import { buscarProdutosPorCategoria } from "../Services/produtos"

export default function CategoriaFrutas() {
  interface Produto {
    id_produtos:number,
    nome: string,
    preco: number,
    Unidade: string,
    foto_produto: string,
    provincia: string,
    quantidade: number,
    nome_vendedor:string
  }

  const [produtosFiltrados, setProdutosFiltrados] = useState<Produto[]>([])
  const [produtosOriginais, setProdutosOriginais] = useState<Produto[]>([])
  const [tipoFiltroInput, setTipoFiltroInput] = useState("")
  const [provinciaFiltroInput, setProvinciaFiltroInput] = useState("")
  const [precoFiltroInput, setPrecoFiltroInput] = useState("")
  const [filtroAtivado, setFiltroAtivado] = useState(false)

  const aplicarFiltros = async () => {
    setFiltroAtivado(true)

    let precoMin: number | undefined = undefined
    let precoMax: number | undefined = undefined

    if (precoFiltroInput === "0-5000") {
      precoMax = 5000
    } else if (precoFiltroInput === "5000-50000") {
      precoMin = 5000
      precoMax = 50000
    } else if (precoFiltroInput === "50000-100000") {
      precoMin = 50000
      precoMax = 100000
    } else if (precoFiltroInput === "100000-plus") {
      precoMin = 100000
    }

    try {
      const resultado = await buscarProdutosPorCategoria("Frutas", {
        provincia: provinciaFiltroInput,
        precoMin,
        precoMax,
      })

      const nomeMatch = tipoFiltroInput.toLowerCase()
      const filtrados = resultado.filter(p =>
        tipoFiltroInput ? p.nome.toLowerCase().includes(nomeMatch) : true
      )

      setProdutosFiltrados(filtrados)
    } catch (error) {
      console.log("Erro ao aplicar filtros:", error)
    }
  }

  useEffect(() => {
    async function carregarProdutosParaSelects() {
      try {
        const produtosRecebidos = await buscarProdutosPorCategoria("Frutas", {})
        
        setProdutosOriginais(produtosRecebidos)
      } catch (error) {
        console.log("Erro ao carregar produtos:", error)
      }
    }

    if (!filtroAtivado) {
      carregarProdutosParaSelects()
    }
  }, [filtroAtivado])

  const isFormValid = tipoFiltroInput && provinciaFiltroInput && precoFiltroInput

  return (
    <main>
      <Head>
        <title>Categoria Frutas</title>
      </Head>
      <Navbar />

      <div className="mb-20 mt-[50%] lg:mt-[18%]">
        <h1 className="text-center my-6 text-[2rem] font-bold text-marieth">Frutas</h1>

        <div className=" my-12 mx-9 px-4">
          
          <div className="flex flex-col gap-4 lg:flex-row justify-between w-full">
            {/* Tipo de fruta */}
            <div className="flex flex-col w-full"><label htmlFor="graos" className="mb-[0.5rem] font-medium block">
              Tipo de Fruta
                </label>
              <div className="p-4 shadow-custom bg-white rounded-[10px]">
                <select
                  id="graos"
                  value={tipoFiltroInput}
                  onChange={(e) => setTipoFiltroInput(e.target.value)}
                  className="w-full p-[0.8rem] rounded-[5px] text-base border border-solid border-tab"
                >
                  <option value="">Todos os tipos</option>
                  {Array.from(new Set(produtosOriginais.map(p => p.nome))).map((nome, index) => (
                    <option key={index} value={nome}>{nome}</option>
                  ))}
                </select>
              </div></div>
            

            {/* Província */}
            <div className="flex flex-col w-full">
              <label htmlFor="local" className="mb-[0.5rem] font-medium block">
              Província
                </label>
              <div className="p-4 shadow-custom bg-white rounded-[10px]">
                <select
                  id="local"
                  value={provinciaFiltroInput}
                  onChange={(e) => setProvinciaFiltroInput(e.target.value)}
                  className="w-full p-[0.8rem] rounded-[5px] text-base border border-solid border-tab"
                >
                  <option value="">Todas as províncias</option>
                  {Array.from(new Set(produtosOriginais.map(p => p.provincia)))
                    .filter(Boolean)
                    .map((prov, index) => (
                      <option key={index} value={prov}>{prov}</option>
                    ))}
                </select>
              </div>
</div>
            
            <div className="flex flex-col w-full">
              <label htmlFor="intervalo-preco" className="mb-[0.5rem] font-medium block">
              Faixa de Preço (AOA)
                </label>
              <div className="p-4 shadow-custom bg-white rounded-[10px]">
                <select
                  id="intervalo-preco"
                  value={precoFiltroInput}
                  onChange={(e) => setPrecoFiltroInput(e.target.value)}
                  className="w-full p-[0.8rem] rounded-[5px] text-base border border-solid border-tab"
                >
                  <option value="">Todas as faixas</option>
                  <option value="0-5000">Até 5.000 AOA</option>
                  <option value="5000-50000">5.000 - 50.000 AOA</option>
                  <option value="50000-100000">50.000 - 100.000 AOA</option>
                  <option value="100000-plus">Acima de 100.000 AOA</option>
                </select>
              </div>
          </div></div>
            

          <button
            onClick={aplicarFiltros}
            disabled={!isFormValid}
            className="flex border-none mb-2 text-white bg-marieth hover:bg-verdeaceso py-[0.8rem] px-6 rounded-[5px] text-base items-center cursor-pointer gap-2 my-4 mx-auto transition-transform"
          >
            <BiSearch className="text-[1.1rem]" />
            Pesquisar
          </button>
        </div>
        <section className="grid grid-cols-3 gap-2 ">
  {filtroAtivado ? (
    produtosFiltrados.length > 0 ? (
      produtosFiltrados.map((produto, index) => (
        <Link href={`/DetalhesProduto/${produto.id_produtos}`}
        key={index}>
          <div className="p-8 max-w-[1200px] flex flex-row gap-6 -mt-16 ml-6">
            <div className="rounded-[10px] shadow-custom transition-transform duration-150 bg-white overflow-hidden hover:translate-y-[5px]">
             
              {produto.foto_produto ? (
                  <Image
                    src={produto.foto_produto}
                    alt={produto.nome}
                    height={200}
                    width={380}
                    className="object-cover"
                  />
                ) : (
                  <div className="h-[200px] w-[380px] -left-10 text-center bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                    Imagem indisponível
                  </div>
                )}

              <div className="p-4">
                <h3 className="text-[1.1rem] mb-[0.5rem] font-bold">{produto.nome}</h3>
                <h3 className="text-[1.2rem] text-marieth font-bold">
                  kz {produto.preco}/{produto.quantidade}{produto.Unidade}
                </h3>
                <h3 className="text-[0.9rem] text-cortexto">Vendido por: {produto.nome_vendedor}</h3>
              </div>
            </div>
          </div>
        </Link>
      ))
    ) : (
      <p className="animate-pulse text-lg text-red-600 font-semibold mt-8 ml-24">
        Nenhum produto encontrado com os filtros aplicados.Tente outro
      </p>
    )
  ) : null}
</section>

      </div>

      <Footer />
    </main>
  )
}
