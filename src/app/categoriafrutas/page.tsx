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


export default function CategoriaFrutas() {
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
  const [isLoading, setIsLoading] = useState(false);
  // States para sugestões contextuais
  const [sugestoesContextuais, setSugestoesContextuais] = useState<{
    provincias: string[],
    faixasPreco: string[],
    tipos: string[],
    mensagem: string
  }>({
    provincias: [],
    faixasPreco: [],
    tipos: [],
    mensagem: ""
  })

  // Função extraída para aplicar filtros com valores específicos
  const aplicarFiltrosComValores = async (
    tipo: string,
    provincia: string,
    precoFiltro: string
  ) => {
    setFiltroAtivado(true);
    setMostrarMensagemErro(false);
    setIsLoading(true);

    let precoMin: number | undefined = undefined;
    let precoMax: number | undefined = undefined;

    if (precoFiltro === "0-5000") {
      precoMax = 5000;
    } else if (precoFiltro === "5000-50000") {
      precoMin = 5000;
      precoMax = 50000;
    } else if (precoFiltro === "50000-100000") {
      precoMin = 50000;
      precoMax = 100000;
    } else if (precoFiltro === "100000-plus") {
      precoMin = 100000;
    }

    try {
      const resultado = await buscarProdutosPorCategoria("Frutas", {
        provincia: provincia,
        precoMin,
        precoMax,
      });

      const nomeMatch = tipo.toLowerCase();
      const filtrados = resultado.filter(p =>
        tipo ? p.nome.toLowerCase().includes(nomeMatch) : true
      );

      setProdutosFiltrados(filtrados);

      if (filtrados.length === 0) {
        await gerarSugestoesContextuais();
        setMostrarMensagemErro(true);
      } else {
        setMostrarMensagemErro(false);
        setSugestoesContextuais({ provincias: [], faixasPreco: [], tipos: [], mensagem: "" });
      }
    } catch (error) {
      console.log("Erro ao aplicar filtros:", error);
      setMostrarMensagemErro(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  const aplicarFiltros = async () => {
    await aplicarFiltrosComValores(tipoFiltroInput, provinciaFiltroInput, precoFiltroInput);
  };

  // Função para gerar sugestões contextuais mais inteligentes
  const gerarSugestoesContextuais = async () => {
    try {
      const todosProdutos = await buscarProdutosPorCategoria("Frutas", {})
      let sugestoes = {
        provincias: [] as string[],
        faixasPreco: [] as string[],
        tipos: [] as string[],
        mensagem: ""
      }

      // Cenário 1: Se o usuário selecionou um tipo específico, mas não há esse tipo na província/preço escolhido
      if (tipoFiltroInput) {
        const produtosPorTipo = todosProdutos.filter(p => 
          p.nome.toLowerCase().includes(tipoFiltroInput.toLowerCase())
        )
        
        if (produtosPorTipo.length > 0) {
          // Se existem produtos desse tipo, mas não na província selecionada
          if (provinciaFiltroInput) {
            const provinciasDisponiveis = Array.from(new Set(
              produtosPorTipo.map(p => p.provincia)
            )).filter(p => p !== provinciaFiltroInput)
            
            sugestoes.provincias = provinciasDisponiveis.slice(0, 3)
            sugestoes.mensagem = `"${tipoFiltroInput}" está disponível nas seguintes províncias:`
          }
          
          // Se existem produtos desse tipo, mas não na faixa de preço selecionada
          if (precoFiltroInput && sugestoes.provincias.length === 0) {
            const precosMapeados = new Set<string>()
            
            // Filtrar por província se selecionada
            const produtosFiltradosPorProvincia = provinciaFiltroInput 
              ? produtosPorTipo.filter(p => p.provincia === provinciaFiltroInput)
              : produtosPorTipo
            
            produtosFiltradosPorProvincia.forEach(p => {
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
            
            sugestoes.faixasPreco = Array.from(precosMapeados).filter(f => f !== precoFiltroInput)
            sugestoes.mensagem = `"${tipoFiltroInput}" ${provinciaFiltroInput ? `em ${provinciaFiltroInput}` : ''} está disponível nestas faixas de preço:`
          }
        }
      }
      
      // Cenário 2: Se o usuário selecionou província mas não tipo específico
      else if (provinciaFiltroInput) {
        const produtosPorProvincia = todosProdutos.filter(p => p.provincia === provinciaFiltroInput)
        
        if (produtosPorProvincia.length > 0) {
          // Sugerir tipos disponíveis nessa província na faixa de preço selecionada
          let produtosFiltrados = produtosPorProvincia
          
          if (precoFiltroInput) {
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
            
            produtosFiltrados = produtosPorProvincia.filter(p => {
              if (precoMin !== undefined && precoMax !== undefined) {
                return p.preco >= precoMin && p.preco <= precoMax
              } else if (precoMax !== undefined) {
                return p.preco <= precoMax
              } else if (precoMin !== undefined) {
                return p.preco >= precoMin
              }
              return true
            })
          }
          
          if (produtosFiltrados.length === 0 && precoFiltroInput) {
            // Sugerir outras faixas de preço para essa província
            const precosMapeados = new Set<string>()
            
            produtosPorProvincia.forEach(p => {
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
            
            sugestoes.faixasPreco = Array.from(precosMapeados).filter(f => f !== precoFiltroInput)
            sugestoes.mensagem = `Em ${provinciaFiltroInput}, temos frutas nestas faixas de preço:`
          } else if (produtosFiltrados.length > 0) {
            const tiposDisponiveis = Array.from(new Set(produtosFiltrados.map(p => p.nome)))
            sugestoes.tipos = tiposDisponiveis.slice(0, 3)
            sugestoes.mensagem = `Em ${provinciaFiltroInput} ${precoFiltroInput ? `na faixa ${traduzirFaixaPreco(precoFiltroInput)}` : ''}, temos estas frutas:`
          }
        }
      }
      
      // Cenário 3: Se o usuário só selecionou faixa de preço
      else if (precoFiltroInput) {
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
        
        const produtosPorPreco = todosProdutos.filter(p => {
          if (precoMin !== undefined && precoMax !== undefined) {
            return p.preco >= precoMin && p.preco <= precoMax
          } else if (precoMax !== undefined) {
            return p.preco <= precoMax
          } else if (precoMin !== undefined) {
            return p.preco >= precoMin
          }
          return true
        })
        
        if (produtosPorPreco.length > 0) {
          const provinciasDisponiveis = Array.from(new Set(produtosPorPreco.map(p => p.provincia)))
          const tiposDisponiveis = Array.from(new Set(produtosPorPreco.map(p => p.nome)))
          
          sugestoes.provincias = provinciasDisponiveis.slice(0, 3)
          sugestoes.tipos = tiposDisponiveis.slice(0, 3)
          sugestoes.mensagem = `Na faixa ${traduzirFaixaPreco(precoFiltroInput)}, temos frutas em:`
        }
      }

      setSugestoesContextuais(sugestoes)
    } catch (error) {
      console.log("Erro ao gerar sugestões:", error)
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

  // Funções para aplicar as sugestões clicadas - CORRIGIDAS
  const aplicarSugestaoFaixaPreco = async (faixa: string) => {
    setPrecoFiltroInput(faixa);
    setMostrarMensagemErro(false);
    setSugestoesContextuais({ provincias: [], faixasPreco: [], tipos: [], mensagem: "" });
    
    // Aplicar filtros com o novo valor diretamente
    await aplicarFiltrosComValores(tipoFiltroInput, provinciaFiltroInput, faixa);
  }

  const aplicarSugestaoProvincia = async (provincia: string) => {
    setProvinciaFiltroInput(provincia);
    setMostrarMensagemErro(false);
    setSugestoesContextuais({ provincias: [], faixasPreco: [], tipos: [], mensagem: "" });
    
    // Aplicar filtros com o novo valor diretamente
    await aplicarFiltrosComValores(tipoFiltroInput, provincia, precoFiltroInput);
  }

  const aplicarSugestaoTipo = async (tipo: string) => {
    setTipoFiltroInput(tipo);
    setMostrarMensagemErro(false);
    setSugestoesContextuais({ provincias: [], faixasPreco: [], tipos: [], mensagem: "" });
    
    // Aplicar filtros com o novo valor diretamente
    await aplicarFiltrosComValores(tipo, provinciaFiltroInput, precoFiltroInput);
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
        <title>Categoria Tubérculos e Raízes</title>
      </Head>
      <Navbar />

      <div className="mb-20 mt-[52%] lg:mt-[18%]" role="main">
        <h1 className="text-center my-6 text-[1.5rem] lg:text-[2rem] sm:text-[1.75rem] md:text-[2rem] font-bold text-marieth" aria-label="Tubérculos e Raízes">Frutas</h1>
      
        {/* Seção de filtros com ocupação horizontal ajustada */}
        <div className="my-12 mx-4 sm:mx-6 md:mx-9 px-2 sm:px-3 md:px-4">
          <div className="flex flex-col gap-4 lg:flex-row justify-between w-full">
            {/* Tipo de Fruta Select - Ocupando todo espaço disponível */}
            <div className="flex flex-col w-full">
              <label htmlFor="fruta" className="mb-[0.5rem] font-medium block">
                Tipo Fruta
                <div className="shadow-custom bg-white rounded-[10px] p-2">
                  <select
                    id="fruta"
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
    disabled={!isFormValid || isLoading}
    className={`flex border-none text-white bg-marieth hover:bg-verdeaceso py-[0.8rem] px-6 rounded-[5px] text-sm sm:text-base items-center gap-2 my-8 mx-auto transition-all duration-300 ${
        !isFormValid || isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 cursor-pointer'
    }`}
>
           {isLoading ? (
             <span className="flex items-center gap-2">
            <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
            Pesquisando...
             </span>
               ) : (
               <>
            <BiSearch className="text-[1.1rem]" />
            Pesquisar
               </>
               )}
</button>
        {/* Mensagem de erro com sugestões contextuais */}
        {mostrarMensagemErro && (
          <div className="mx-4 sm:mx-6 md:mx-9 px-4 py-6 bg-red-50 border border-red-100 rounded-lg shadow-sm mb-8">
            <p className="text-base sm:text-lg text-red-600 font-semibold text-center mb-4">
              Nenhum produto encontrado com os filtros aplicados.
            </p>
            
            {sugestoesContextuais.mensagem && (
              <div className="space-y-4">
                <p className="text-gray-700 text-sm sm:text-base text-center font-medium">
                  {sugestoesContextuais.mensagem}
                </p>
                
                {/* Sugestões de tipos de frutas */}
                {sugestoesContextuais.tipos.length > 0 && (
                  <div className="text-center">
                    <div className="flex flex-wrap justify-center gap-2">
                      {sugestoesContextuais.tipos.map((tipo, index) => (
                        <button
                          key={index}
                          onClick={() => aplicarSugestaoTipo(tipo)}
                          className="bg-white border border-marieth text-marieth py-2 px-4 rounded-full hover:bg-marieth hover:text-white transition-colors duration-300 text-xs sm:text-sm font-medium"
                        >
                          {tipo}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Sugestões de províncias */}
                {sugestoesContextuais.provincias.length > 0 && (
                  <div className="text-center">
                    <div className="flex flex-wrap justify-center gap-2">
                      {sugestoesContextuais.provincias.map((provincia, index) => (
                        <button
                          key={index}
                          onClick={() => aplicarSugestaoProvincia(provincia)}
                          className="bg-white border border-marieth text-marieth py-2 px-4 rounded-full hover:bg-marieth hover:text-white transition-colors duration-300 text-xs sm:text-sm font-medium"
                        >
                          {provincia}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Sugestões de faixas de preço */}
                {sugestoesContextuais.faixasPreco.length > 0 && (
                  <div className="text-center">
                    <div className="flex flex-wrap justify-center gap-2">
                      {sugestoesContextuais.faixasPreco.map((faixa, index) => (
                        <button
                          key={index}
                          onClick={() => aplicarSugestaoFaixaPreco(faixa)}
                          className="bg-white border border-marieth text-marieth py-2 px-4 rounded-full hover:bg-marieth hover:text-white transition-colors duration-300 text-xs sm:text-sm font-medium"
                        >
                          {traduzirFaixaPreco(faixa)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Seção de produtos */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-8 mb-20">
          {filtroAtivado && produtosFiltrados.length > 0 && (
            produtosFiltrados.map((produto, index) => (
              <Link href={`/DetalhesProduto/${produto.id_produtos}`} key={index}>
                <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] flex flex-row gap-6 lg:gap-4 -mt-14 lg:ml-6">
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
    </div>
    </main>
  )
}     