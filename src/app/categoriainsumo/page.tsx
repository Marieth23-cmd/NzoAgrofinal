"use client"
import { BiSearch } from "react-icons/bi"
import Footer from "../Components/Footer"
import Navbar from "../Components/Navbar"
import Image from "next/image"
import Head from "next/head"
import Link from "next/link"
import { useEffect, useState } from "react"
import React from "react"
import { buscarProdutosPorCategoria } from "../Services/produtos"

export default function categoriaInsumo() {
  interface Produto {
    id_produtos: number,
    nome: string,
    preco: number,
    Unidade: string,
    foto_produto: string,
    provincia: string,
    quantidade: number,
    nome_vendedor: string
  }

  const [produtosFiltrados, setProdutosFiltrados] = useState<Produto[]>([])
  const [produtosOriginais, setProdutosOriginais] = useState<Produto[]>([])
  const [tipoFiltroInput, setTipoFiltroInput] = useState("")
  const [provinciaFiltroInput, setProvinciaFiltroInput] = useState("")
  const [precoFiltroInput, setPrecoFiltroInput] = useState("")
  const [filtroAtivado, setFiltroAtivado] = useState(false)
  const [mostrarMensagemErro, setMostrarMensagemErro] = useState(false)
  // Novas states para sugestões
  const [provinciasSugeridas, setProvinciasSugeridas] = useState<string[]>([])
  const [faixasPrecosSugeridas, setFaixasPrecosSugeridas] = useState<string[]>([])

  const aplicarFiltros = async () => {
    setFiltroAtivado(true)
    setMostrarMensagemErro(false) // Reset error message when applying filters

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
      const resultado = await buscarProdutosPorCategoria("Insumos", {
        provincia: provinciaFiltroInput,
        precoMin,
        precoMax,
      })

      const nomeMatch = tipoFiltroInput.toLowerCase()
      const filtrados = resultado.filter(p =>
        tipoFiltroInput ? p.nome.toLowerCase().includes(nomeMatch) : true
      )

      setProdutosFiltrados(filtrados)
      
      // Se não encontrou resultados, gerar sugestões
      if (filtrados.length === 0) {
        gerarSugestoes(resultado)
        setMostrarMensagemErro(true)
      } else {
        setMostrarMensagemErro(false)
      }
    } catch (error) {
      console.log("Erro ao aplicar filtros:", error)
      setMostrarMensagemErro(true)
    }
  }

  // Função para gerar sugestões quando nenhum produto for encontrado
  const gerarSugestoes = (todosResultados: Produto[]) => {
    // Sugerir províncias disponíveis se o usuário especificou uma
    if (provinciaFiltroInput) {
      const provinciasDisponiveis = Array.from(
        new Set(todosResultados.map(p => p.provincia))
      ).filter(Boolean)
      
      setProvinciasSugeridas(provinciasDisponiveis.slice(0, 3)) // Limitar a 3 sugestões
    }

    // Sugerir faixas de preço se o usuário especificou uma
    if (precoFiltroInput) {
      const precosMapeados = new Set<string>()
      
      todosResultados.forEach(p => {
        if (p.preco <= 5000) {
          precosMapeados.add("0-5000")
        } else if (p.preco > 5000 && p.preco <= 50000) {
          precosMapeados.add("5000-50000")
        } else if (p.preco > 50000 && p.preco <= 100000) {
          precosMapeados.add("50000-100000")
        } else if (p.preco > 100000) {
          precosMapeados.add("100000-plus") 
        }
      })
      
      setFaixasPrecosSugeridas(Array.from(precosMapeados))
    }
  }

  // Handler functions for each filter input change
  const handleTipoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTipoFiltroInput(e.target.value)
    if (filtroAtivado) {
      setMostrarMensagemErro(false)
    }
  }

  const handleProvinciaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProvinciaFiltroInput(e.target.value)
    if (filtroAtivado) {
      setMostrarMensagemErro(false)
    }
  }

  const handlePrecoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPrecoFiltroInput(e.target.value)
    if (filtroAtivado) {
      setMostrarMensagemErro(false)
    }
  }

  // Funções para aplicar as sugestões clicadas
  const aplicarSugestaoFaixaPreco = (faixa: string) => {
    setPrecoFiltroInput(faixa)
    // Aplicar filtros automaticamente se os outros campos estiverem preenchidos
    if (tipoFiltroInput && provinciaFiltroInput) {
      aplicarFiltros()
    }
  }

  const aplicarSugestaoProvincia = (provincia: string) => {
    setProvinciaFiltroInput(provincia)
    // Aplicar filtros automaticamente se os outros campos estiverem preenchidos
    if (tipoFiltroInput && precoFiltroInput) {
      aplicarFiltros()
    }
  }

  useEffect(() => {
    async function carregarProdutosParaSelects() {
      try {
        const produtosRecebidos = await buscarProdutosPorCategoria("Insumos", {})
        setProdutosOriginais(produtosRecebidos)
      } catch (error) {
        console.log("Erro ao carregar produtos:", error)
      }
    }

    if (!filtroAtivado) {
      carregarProdutosParaSelects()
    }
  }, [filtroAtivado])

  // Eliminar duplicatas de produtos baseado no nome
  const produtosUnicosPorNome = produtosOriginais.filter(
    (produto, index, self) => 
      index === self.findIndex(p => p.nome === produto.nome)
  );

  const isFormValid = tipoFiltroInput && provinciaFiltroInput && precoFiltroInput

  // Função para traduzir o código da faixa de preço para texto legível
  const traduzirFaixaPreco = (codigo: string) => {
    switch(codigo) {
      case "0-5000": return "Até 5.000 AOA";
      case "5000-50000": return "5.000 - 50.000 AOA";
      case "50000-100000": return "50.000 - 100.000 AOA";
      case "100000-plus": return "Acima de 100.000 AOA";
      default: return codigo;
    }
  }

  return (
    <main>
      <Head>
        <title>Categoria Insumos</title>
      </Head>
      <Navbar />

      <div className="mb-20 mt-[52%] lg:mt-[18%]">
        <h1 className="text-center my-6 text-[1.5rem] lg:text-[2rem] sm:text-[1.75rem] md:text-[2rem] font-bold text-marieth">Insumos Agrícolas</h1>

        {/* Seção de filtros com ocupação horizontal completa */}
        <div className="my-12 mx-9 px-4">
          <div className="flex flex-col gap-4 lg:flex-row justify-between w-full">
            {/* Tipo de Fruta Select - Ocupando todo espaço disponível */}
            <div className="flex flex-col w-full">
              <label htmlFor="insumos" className="mb-[0.5rem] font-medium block">
                Tipo de  Insumos
                <div className="shadow-custom bg-white rounded-[10px] p-2">
                  <select
                    id="insumos"
                    value={tipoFiltroInput}
                    onChange={handleTipoChange}
                    className="w-full p-[0.8rem] rounded-[5px] text-sm sm:text-base border border-solid border-tab focus:outline-none focus:ring-2 focus:ring-marieth"
                  >
                    <option value="" disabled>Todos os tipos</option>
                    {produtosUnicosPorNome.map((produto, index) => (
                      <option key={index} value={produto.nome}>{produto.nome}</option>
                    ))}
                  </select>
                </div>
              </label>
            </div>
            
            {/* Província Select - Ocupando todo espaço disponível */}
            <div className="flex flex-col w-full">
              <label htmlFor="local" className="mb-[0.5rem] font-medium block">
                Província
                <div className="shadow-custom bg-white rounded-[10px] p-2">
                  <select
                    id="local"
                    value={provinciaFiltroInput}
                    onChange={handleProvinciaChange}
                    className="w-full p-[0.8rem] rounded-[5px] text-sm sm:text-base border border-solid border-tab focus:outline-none focus:ring-2 focus:ring-marieth"
                  >
                    <option value="" disabled>Todas as províncias</option>
                    {Array.from(new Set(produtosOriginais.map(p => p.provincia)))
                      .filter(Boolean)
                      .map((prov, index) => (
                        <option key={index} value={prov}>{prov}</option>
                      ))}
                  </select>
                </div>
              </label>
            </div>
            
            {/* Faixa de Preço Select - Ocupando todo espaço disponível */}
            <div className="flex flex-col w-full">
              <label htmlFor="intervalo-preco" className="mb-[0.5rem] font-medium block">
                Faixa de Preço (AOA)
                <div className="shadow-custom bg-white rounded-[10px] p-2">
                  <select
                    id="intervalo-preco"
                    value={precoFiltroInput}
                    onChange={handlePrecoChange}
                    className="w-full p-[0.8rem] rounded-[5px] text-sm sm:text-base border border-solid border-tab focus:outline-none focus:ring-2 focus:ring-marieth"
                  >
                    <option value="" disabled>Todas as faixas</option>
                    <option value="0-5000">Até 5.000 AOA</option>
                    <option value="5000-50000">5.000 - 50.000 AOA</option>
                    <option value="50000-100000">50.000 - 100.000 AOA</option>
                    <option value="100000-plus">Acima de 100.000 AOA</option>
                  </select>
                </div>
              </label>
            </div>
          </div>
            
          {/* Botão de pesquisa com estilo melhorado */}
          <button
            onClick={aplicarFiltros}
            disabled={!isFormValid}
            className={`flex border-none text-white bg-marieth hover:bg-verdeaceso py-[0.8rem] px-6 rounded-[5px] text-sm sm:text-base items-center gap-2 my-4 mx-auto transition-all duration-300 ${!isFormValid ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 cursor-pointer'}`}
          >
            <BiSearch className="text-[1.1rem]" />
            Pesquisar
          </button>
        </div>

        {/* Mensagem de erro com sugestões */}
        {mostrarMensagemErro && (
          <div className="w-full mx-9 px-4 py-6 bg-red-50 border border-red-100 rounded-lg shadow-sm">
            <p className="text-base sm:text-lg text-red-600 font-semibold text-center mb-4">
              Nenhum produto encontrado com os filtros aplicados.
            </p>
            
            <div className="space-y-4">
              {/* Sugestões de províncias */}
              {provinciasSugeridas.length > 0 && (
                <div className="text-center">
                  <p className="text-gray-700 text-sm sm:text-base mb-2">Províncias onde há frutas disponíveis:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {provinciasSugeridas.map((provincia, index) => (
                      <button
                        key={index}
                        onClick={() => aplicarSugestaoProvincia(provincia)}
                        className="bg-white border border-marieth text-marieth py-1 px-3 rounded-full hover:bg-marieth hover:text-white transition-colors duration-300 text-xs sm:text-sm"
                      >
                        {provincia}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Sugestões de faixas de preço */}
              {faixasPrecosSugeridas.length > 0 && (
                <div className="text-center">
                  <p className="text-gray-700 text-sm sm:text-base mb-2">Faixas de preço disponíveis:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {faixasPrecosSugeridas.map((faixa, index) => (
                      <button
                        key={index}
                        onClick={() => aplicarSugestaoFaixaPreco(faixa)}
                        className="bg-white border border-marieth text-marieth py-1 px-3 rounded-full hover:bg-marieth hover:text-white transition-colors duration-300 text-xs sm:text-sm"
                      >
                        {traduzirFaixaPreco(faixa)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Dica geral */}
              <p className="text-gray-600 text-center text-xs sm:text-sm mt-4">
                Tente usar filtros menos específicos ou escolha uma das sugestões acima.
              </p>
            </div>
          </div>
        )}

        {/* Seção de produtos */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {filtroAtivado && produtosFiltrados.length > 0 && (
            produtosFiltrados.map((produto, index) => (
              <Link href={`/DetalhesProduto/${produto.id_produtos}`} key={index}>
                <div className="p-8 max-w-[1200px] flex flex-row gap-6 -mt-16 lg:ml-6">
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
                      <div className="h-[200px] w-[380px] text-center bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                        Imagem indisponível
                      </div>
                    )}

                    <div className="p-4">
                      <h3 className="text-[0.95rem] sm:text-[1.1rem] mb-[0.5rem] font-bold">{produto.nome}</h3>
                      <h3 className="text-[1rem] sm:text-[1.2rem] text-marieth font-bold">
                        {produto.preco.toLocaleString('pt-AO')} Kz/{produto.quantidade}{produto.Unidade}
                      </h3>
                      <h3 className="text-[0.8rem] sm:text-[0.9rem] text-cortexto">Vendido por: {produto.nome_vendedor}</h3>
                      <p className="text-[0.75rem] sm:text-[0.85rem] text-gray-500 mt-1">
                        {produto.provincia}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </section>
      </div>

      <Footer />
    </main>
  )
}