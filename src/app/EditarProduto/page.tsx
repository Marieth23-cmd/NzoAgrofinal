"use client"
import Head from "next/head"
import Footer from "../Components/Footer"
import Navbar from "../Components/Navbar"
import React, { useState, useEffect, Suspense } from "react";
import { atualizarProduto } from "../Services/produtos";
import { useRouter, useSearchParams } from "next/navigation"
import { getProdutoById } from "../Services/produtos";
import Image from "next/image";
import { verificarAuth } from "../Services/auth";

// Componente de carregamento para usar com Suspense
function Loading() {
    return <div className="text-center py-10">Carregando produto...</div>;
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
    const [isMounted, setIsMounted] = useState<boolean>(false);

    // Este useEffect garante que o componente só tenta acessar APIs do navegador depois de montado
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Carrega dados do produto apenas quando o componente estiver montado e o ID existir
    useEffect(() => {
        if (!isMounted || !id) return;

        getProdutoById(Number(id))
            .then((produto) => {
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
            })
            .catch((error) => {
                console.error("Erro ao carregar produto:", error);
                alert("Erro ao carregar os dados do produto");
                setIsLoadingProduto(false);
            });
    }, [id, isMounted]);

    // Verificação de autenticação apenas quando o componente estiver montado
    useEffect(() => {
        if (!isMounted) return;

        verificarAuth()
            .then((res) => {
                SetAutenticado(true);
                setTipoUsuario(res.tipo_usuario);
            })
            .catch(() => {
                SetAutenticado(false);
            });
    }, [isMounted]);

    // Redirecionamento quando não autenticado, apenas se montado e autenticado = false
    useEffect(() => {
        if (isMounted && autenticado === false) {
            router.push("/login");
        }
    }, [autenticado, isMounted, router]);

    // Mostra carregando enquanto verifica o produto
    if (!isMounted || isLoadingProduto) {
        return <div className="text-center py-10">Carregando produto...</div>;
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
            formData.append('foto', foto_produto); // O nome 'foto' deve ser o mesmo que o backend espera
        }
        
        if (!nome || !descricao || !categoria || !Unidade || !provincia) {
            alert("Preencha todos os campos obrigatórios");
            return;
        }
        
        try {
            // Envia os dados para o backend
            await atualizarProduto(Number(id), formData); // Passando o FormData para a função de atualização
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
        <form onSubmit={handleAtualizar}>
            <div className="bg-white rounded-[10px] p-8 w-full max-w-[800px] ml-[20%] mb-20 mt-[15%] shadow-custom">
               
                 <h3 className="mb-6 text-marieth text-[1.8rem] font-bold ">Editar Produto</h3>

                 <div className="mb-4 items-center">
                    <label htmlFor="Provincia" className="sr-only">Província</label>
                    <select
                         name="provincia"
                         id="Provincia"
                         required
                         value={provincia}
                        onChange={(e) => setProvincia(e.target.value)}
                        className="w-full p-[0.8rem] border-[1px] border-solid border-tab rounded-[10px] text-base transition-colors duration-150 cursor-pointer font-medium text-profile"
                    >
                        <option value="" disabled hidden>Escolha sua Província</option>
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
                            <option value="Uíge">Uíge </option>
                            <option value="Zaíre">Zaíre</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="option" className="sr-only">Nome da Categoria</label>
                    <select
                        name="categoria"
                        value={categoria}
                        onChange={(e) => setCategoria(e.target.value)}
                        id="option"
                        required
                        className="mb-6 cursor-pointer font-medium text-profile w-full p-[0.8rem] border-[1px] border-solid border-tab rounded-[10px] text-base transition-colors duration-150"
                    >
                        <option value=""  disabled hidden>Escolha uma Categoria</option>
                        <option value="Frutas">Frutas</option>
                        <option value="Verduras">Verduras</option>
                        <option value="Insumos Agricolas">Insumos Agricolas</option>
                        <option value="Grãos">Grãos</option>
                        <option value="Tubérculos e Raízes">Tubérculos e Raízes</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="nome">Nome:</label>
                    <input
                        type="text"
                        name="nomeProduto"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        id="nome"
                        required
                        className="w-full p-[0.8rem] cursor-pointer border-[1px] border-solid border-tab rounded-[10px]"
                    />
                </div>

                <div className="mb-4 flex gap-2">
                    <label htmlFor="quantidade" className="font-medium mt-3">Quantidade:</label>
                    <input
                        type="number"
                        min="1"
                        value={quantidade}
                        onChange={(e) => setQuantidade(Number(e.target.value))}
                        name="quantidade"
                        id="quantidade"
                        className="w-full p-[0.8rem] cursor-pointer border-[1px] border-solid border-tab rounded-[10px] text-base transition-colors duration-150"
                    />
                    <label htmlFor="unidade" className="sr-only">Unidade</label>
                    <select
                        name="unidade"
                        id="unidade"
                        required
                        value={Unidade}
                        onChange={(e) => setUnidade(e.target.value)}
                        className="w-full p-[0.8rem] border-[1px] border-solid border-tab rounded-[10px] text-base transition-colors duration-150 cursor-pointer font-medium text-profile"
                    >
                        <option value="">Unidade</option>
                        <option value="Tonelada">Tonelada(1000Kg)</option>
                        <option value="kg">Kilograma</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="preco" className="block font-medium text-profile mb-2">Preço(AOA)</label>
                    <input
                        type="number"
                        value={preco}
                        onChange={(e) => setPreco(Number(e.target.value))}
                        name="preco"
                        id="preco"
                        required
                        min={1}
                        className="w-full p-[0.8rem] cursor-pointer border-[1px] border-solid border-tab rounded-[10px] text-base transition-colors duration-150"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="descricao" className="block font-medium text-profile mb-2">Descrição</label>
                    <textarea
                        name="descricao"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        id="descricao"
                        required
                        className="w-full rounded-[10px] text-base border-[1px] border-solid p-[0.8rem] border-tab min-h-[120px] resize-y"
                    ></textarea>
                </div>

                <div className="w-full mb-4 border-[2px] min-h-[80px] border-dashed hover:border-marieth border-tab text-center transition-all duration-150 cursor-pointer rounded-[10px]">
                   
                    <label htmlFor="foto" className="block font-medium text-profile mb-2">
                        <p className="font font-medium mt.4">Clique e arraste a foto</p>

                        <input
                            type="file"
                            name="foto"
                            id="foto"
                            accept="image/*"
                            onChange={handleImagemChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        {previewUrl && (
                            <Image 
                                src={previewUrl}
                                width={200}
                                height={200}
                                alt="Pré-visualização"
                                className="mx-auto mt-4 max-h-48 object-contain rounded-[10px]"
                            />
                        )}
                    </label>
                </div>

                <div className="flex justify-between">
                    <button 
                        type="button" 
                        onClick={handleCancel}
                        className="bg-vermelho text-white py-4 px-8 text-base cursor-pointer font-medium transition-colors duration-150 hover:bg-red-400 mt-4 flex border-none rounded-[10px]"
                    >
                        Cancelar
                    </button>

                    <button 
                        type="submit" 
                        className="bg-marieth text-white py-4 px-8 text-base cursor-pointer font-medium transition-colors duration-150 hover:bg-verdeaceso mt-4 flex border-none rounded-[10px]"
                    >
                        Atualizar
                    </button>
                </div>
            </div>
        </form>
    );
}

// Componente principal que envolve o formulário com Suspense
export default function EditarProduto() {
    return (
        <main>
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