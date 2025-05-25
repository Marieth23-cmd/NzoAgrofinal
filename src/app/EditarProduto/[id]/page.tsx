"use client"
import Head from "next/head"
import Footer from "../../Components/Footer"
import Navbar from "../../Components/Navbar"
import React, { useState, useEffect, Suspense } from "react";
import { atualizarProduto } from "../../Services/produtos";
import { useRouter, useSearchParams } from "next/navigation"
import { getProdutoById } from "../../Services/produtos";
import Image from "next/image";
import { verificarAuth } from "../../Services/auth";

// Componente de carregamento para usar com Suspense
function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-marieth mx-auto mb-4"></div>
                <p>Carregando produto...</p>
            </div>
        </div>
    );
}

// Componente que usa o searchParams
function EditarProdutoForm() {
    // Constantes do router e outros hooks
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams?.get("id") || null;

    // Estados com tipagem correta
    const [nome, setNome] = useState<string>("");
    const [descricao, setDescricao] = useState<string>("");
    const [preco, setPreco] = useState<number>(0);
    const [quantidade, setQuantidade] = useState<number>(0);
    const [categoria, setCategoria] = useState<string>("");
    const [Unidade, setUnidade] = useState<string>("");
    const [foto_produto, setfoto] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [provincia, setProvincia] = useState<string>("");
    const [autenticado, SetAutenticado] = useState<boolean | null>(null);
    const [tipo_usuario, setTipoUsuario] = useState<string | null>(null);
    const [isLoadingProduto, setIsLoadingProduto] = useState<boolean>(true);
    const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Verificação de autenticação
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await verificarAuth();
                SetAutenticado(true);
                setTipoUsuario(res.tipo_usuario);
                setIsLoadingAuth(false);
            } catch (error) {
                console.error("Erro na autenticação:", error);
                SetAutenticado(false);
                setIsLoadingAuth(false);
                router.push("/login");
            }
        };

        checkAuth();
    }, [router]);

    // Carrega dados do produto quando ID e autenticação estiverem prontos
    useEffect(() => {
        if (!id) {
            setError("ID do produto não fornecido");
            setIsLoadingProduto(false);
            return;
        }

        if (autenticado === null || isLoadingAuth) {
            return; // Aguarda autenticação
        }

        if (autenticado === false) {
            return; // Não carrega se não autenticado
        }

        const loadProduto = async () => {
            try {
                console.log("Carregando produto ID:", id);
                const produto = await getProdutoById(Number(id));
                console.log("Produto carregado:", produto);
                
                setNome(produto.nome || "");
                setDescricao(produto.descricao || "");
                setPreco(produto.preco || 0);
                setQuantidade(produto.quantidade || 0);
                setCategoria(produto.categoria || "");
                setUnidade(produto.Unidade || "");
                setProvincia(produto.provincia || "");
                
                if (produto.foto_produto) {
                    setPreviewUrl(`${process.env.NEXT_PUBLIC_BACKEND_URL}${produto.foto_produto}`);
                }
                
                setIsLoadingProduto(false);
            } catch (error) {
                console.error("Erro ao carregar produto:", error);
                setError("Erro ao carregar os dados do produto");
                setIsLoadingProduto(false);
            }
        };

        loadProduto();
    }, [id, autenticado, isLoadingAuth]);

    // Mostra carregando enquanto verifica autenticação ou carrega produto
    if (isLoadingAuth || (autenticado && isLoadingProduto)) {
        return <Loading />;
    }

    // Mostra erro se houver
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg">
                        <h2 className="text-xl font-bold mb-2">Erro</h2>
                        <p>{error}</p>
                        <button 
                            onClick={() => router.back()}
                            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        >
                            Voltar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Se não está autenticado, não renderiza nada (redirecionamento já foi feito)
    if (autenticado === false) {
        return null;
    }

    const handleAtualizar = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Criando o FormData para enviar os dados
        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('descricao', descricao);
        formData.append('preco', preco.toString());
        formData.append('quantidade', quantidade.toString());
        formData.append('categoria', categoria);
        formData.append('Unidade', Unidade);
        formData.append('provincia', provincia);
      
        if (foto_produto) {
            formData.append('foto', foto_produto);
        }
        
        if (!nome || !descricao || !categoria || !Unidade || !provincia) {
            alert("Preencha todos os campos obrigatórios");
            return;
        }
        
        try {
            await atualizarProduto(Number(id), formData);
            alert("Produto atualizado com sucesso");
            router.push(tipo_usuario === "Agricultor" ? "/perfilagricultor" : "/perfilfornecedor");
        } catch (error) {
            console.error("Erro ao atualizar produto:", error);
            alert("Erro ao atualizar produto!");
        }
    };

    const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setfoto(file);
            const preview = URL.createObjectURL(file);
            setPreviewUrl(preview);
        }
    };

    const handleCancel = () => {
        if (confirm("Tens certeza que queres cancelar? As alterações não serão salvas.")) {
            router.back();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <form onSubmit={handleAtualizar}>
                    <div className="bg-white rounded-[10px] p-8 w-full max-w-[800px] mx-auto shadow-lg">
                       
                         <h3 className="mb-6 text-marieth text-[1.8rem] font-bold">Editar Produto</h3>

                         <div className="mb-4 items-center">
                            <label htmlFor="Provincia" className="block font-medium text-gray-700 mb-2">Província</label>
                            <select
                                 name="provincia"
                                 id="Provincia"
                                 required
                                 value={provincia}
                                onChange={(e) => setProvincia(e.target.value)}
                                className="w-full p-[0.8rem] border-[1px] border-solid border-gray-300 rounded-[10px] text-base transition-colors duration-150 cursor-pointer font-medium focus:outline-none focus:ring-2 focus:ring-marieth"
                            >
                                <option value="" disabled>Escolha sua Província</option>
                                <option value="Bengo">Bengo</option>
                                <option value="Benguela">Benguela</option>
                                <option value="Bié">Bié</option>
                                <option value="Cabinda">Cabinda</option>
                                <option value="Cuanza Sul">Cuanza Sul</option>
                                <option value="Cuanza Norte">Cuanza Norte</option>
                                <option value="Cuando Cubango">Cuando Cubango</option>
                                <option value="Cunene">Cunene</option>
                                <option value="Huambo">Huambo</option>
                                <option value="Huíla">Huíla</option>
                                <option value="Luanda">Luanda</option>
                                <option value="Lunda Norte">Lunda Norte</option>
                                <option value="Lunda Sul">Lunda Sul</option>
                                <option value="Malanje">Malanje</option>
                                <option value="Moxíco">Moxíco</option>
                                <option value="Namibe">Namibe</option>
                                <option value="Uíge">Uíge</option>
                                <option value="Zaíre">Zaíre</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="option" className="block font-medium text-gray-700 mb-2">Categoria</label>
                            <select
                                name="categoria"
                                value={categoria}
                                onChange={(e) => setCategoria(e.target.value)}
                                id="option"
                                required
                                className="w-full p-[0.8rem] border-[1px] border-solid border-gray-300 rounded-[10px] text-base transition-colors duration-150 cursor-pointer font-medium focus:outline-none focus:ring-2 focus:ring-marieth"
                            >
                                <option value="" disabled>Escolha uma Categoria</option>
                                <option value="Frutas">Frutas</option>
                                <option value="Verduras">Verduras</option>
                                <option value="Insumos Agricolas">Insumos Agricolas</option>
                                <option value="Grãos">Grãos</option>
                                <option value="Tubérculos e Raízes">Tubérculos e Raízes</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="nome" className="block font-medium text-gray-700 mb-2">Nome</label>
                            <input
                                type="text"
                                name="nomeProduto"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                id="nome"
                                required
                                className="w-full p-[0.8rem] border-[1px] border-solid border-gray-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-marieth"
                            />
                        </div>

                        <div className="mb-4 grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="quantidade" className="block font-medium text-gray-700 mb-2">Quantidade</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={quantidade}
                                    onChange={(e) => setQuantidade(Number(e.target.value))}
                                    name="quantidade"
                                    id="quantidade"
                                    className="w-full p-[0.8rem] border-[1px] border-solid border-gray-300 rounded-[10px] text-base transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-marieth"
                                />
                            </div>
                            <div>
                                <label htmlFor="unidade" className="block font-medium text-gray-700 mb-2">Unidade</label>
                                <select
                                    name="unidade"
                                    id="unidade"
                                    required
                                    value={Unidade}
                                    onChange={(e) => setUnidade(e.target.value)}
                                    className="w-full p-[0.8rem] border-[1px] border-solid border-gray-300 rounded-[10px] text-base transition-colors duration-150 cursor-pointer font-medium focus:outline-none focus:ring-2 focus:ring-marieth"
                                >
                                    <option value="">Selecione a Unidade</option>
                                    <option value="Tonelada">Tonelada (1000Kg)</option>
                                    <option value="kg">Kilograma</option>
                                </select>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="preco" className="block font-medium text-gray-700 mb-2">Preço (AOA)</label>
                            <input
                                type="number"
                                value={preco}
                                onChange={(e) => setPreco(Number(e.target.value))}
                                name="preco"
                                id="preco"
                                required
                                min={1}
                                className="w-full p-[0.8rem] border-[1px] border-solid border-gray-300 rounded-[10px] text-base transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-marieth"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="descricao" className="block font-medium text-gray-700 mb-2">Descrição</label>
                            <textarea
                                name="descricao"
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                                id="descricao"
                                required
                                className="w-full rounded-[10px] text-base border-[1px] border-solid p-[0.8rem] border-gray-300 min-h-[120px] resize-y focus:outline-none focus:ring-2 focus:ring-marieth"
                            ></textarea>
                        </div>

                        <div className="mb-6">
                            <label className="block font-medium text-gray-700 mb-2">Foto do Produto</label>
                            <div className="w-full border-[2px] min-h-[120px] border-dashed hover:border-marieth border-gray-300 text-center transition-all duration-150 cursor-pointer rounded-[10px] p-4">
                                <input
                                    type="file"
                                    name="foto"
                                    id="foto"
                                    accept="image/*"
                                    onChange={handleImagemChange}
                                    className="hidden"
                                />
                                <label htmlFor="foto" className="cursor-pointer">
                                    {previewUrl ? (
                                        <div>
                                            <Image 
                                                src={previewUrl}
                                                width={200}
                                                height={200}
                                                alt="Pré-visualização"
                                                className="mx-auto max-h-48 object-contain rounded-[10px] mb-2"
                                            />
                                            <p className="text-sm text-gray-600">Clique para alterar a imagem</p>
                                        </div>
                                    ) : (
                                        <div className="py-8">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <p className="mt-2 text-sm text-gray-600">Clique e arraste a foto</p>
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-between gap-4">
                            <button 
                                type="button" 
                                onClick={handleCancel}
                                className="bg-red-600 text-white py-3 px-6 text-base cursor-pointer font-medium transition-colors duration-150 hover:bg-red-700 border-none rounded-[10px] flex-1"
                            >
                                Cancelar
                            </button>

                            <button 
                                type="submit" 
                                className="bg-marieth text-white py-3 px-6 text-base cursor-pointer font-medium transition-colors duration-150 hover:bg-verdeaceso border-none rounded-[10px] flex-1"
                            >
                                Atualizar
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Componente principal que envolve o formulário com Suspense
export default function EditarProduto() {
    return (
        <main className="min-h-screen bg-gray-50">
            <Head>
                <title>Editar Produto</title>
            </Head>
            <Navbar />
            <Suspense fallback={<Loading />}>
                <EditarProdutoForm />
            </Suspense>
            <Footer />
        </main>
    );
}