"use client"
import Head from "next/head";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import { criarProduto } from "../Services/produtos";
import { useState, useEffect } from "react";
import { verificarAuth } from "../Services/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CriarProduto() {
    const router = useRouter();
    const [autenticado, setAutenticado] = useState<boolean | null>(null);
    const [foto_produto, setFotoProduto] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Verificação de autenticação
    useEffect(() => {
        const checar = async () => {
            try {
                await verificarAuth();
                setAutenticado(true);
            } catch (error) {
                setAutenticado(false);
                router.push("/login");
            }
        };
        checar();
    }, [router]);

    // Estado do formulário
    const [formData, setFormData] = useState({
        provincia: "",
        categoria: "",
        nome: "",
        quantidade: "",
        Unidade: "Unidade", // Valor padrão
        preco: "",
        descricao: ""
    });

    // Manipulador de mudanças em campos de texto e seleção
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? value : value
        }));
    };

    // Manipulador específico para o upload de imagem
    const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFotoProduto(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    // Envio do formulário
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        // Validações
        if (!formData.nome || !formData.preco || !formData.quantidade) {
            toast.error("Por favor, preencha todos os campos obrigatórios.");
            setLoading(false);
            return;
        }

        if (!formData.provincia || formData.provincia === "Escolha sua Provincia") {
            toast.error("Por favor, selecione uma província válida.");
            setLoading(false);
            return;
        }
        
        if (!formData.categoria || formData.categoria === "Escolha uma Categoria") {
            toast.error("Por favor, selecione uma categoria válida.");
            setLoading(false);
            return;
        }

        const precoNumerico = Number(formData.preco);
        const quantidadeNumerica = Number(formData.quantidade);
        
        if (isNaN(precoNumerico) || precoNumerico <= 0) {
            toast.error("O preço deve ser um número válido e maior que zero.");
            setLoading(false);
            return;
        }
    
        if (isNaN(quantidadeNumerica) || quantidadeNumerica <= 0) {
            toast.error("A quantidade deve ser um número válido e maior que zero.");
            setLoading(false);
            return;
        }

        // Preparação dos dados para envio
        const formDataToSend = new FormData();
        formDataToSend.append("provincia", formData.provincia);
        formDataToSend.append("categoria", formData.categoria);
        formDataToSend.append("nome", formData.nome);
        formDataToSend.append("quantidade", formData.quantidade);
        formDataToSend.append("Unidade", formData.Unidade);
        formDataToSend.append("preco", formData.preco);
        formDataToSend.append("descricao", formData.descricao);
        
        if (foto_produto) {
            formDataToSend.append("foto_produto", foto_produto);
        }
    
        try {
            await criarProduto(formDataToSend);
            toast.success("Produto cadastrado com sucesso!");
            
            // Reset do formulário após sucesso
            setFormData({
                provincia: "",
                categoria: "",
                nome: "",
                quantidade: "",
                Unidade: "Unidade",
                preco: "",
                descricao: ""
            });
            setFotoProduto(null);
            setPreviewUrl(null);
            
            // Opcional: redirecionar para lista de produtos
            // setTimeout(() => router.push("/produtos"), 2000);
            
        } catch (error: any) {
            toast.error(error.mensagem || "Erro ao cadastrar produto");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Se ainda estiver verificando autenticação, pode mostrar um loader
    if (autenticado === null) {
        return <div className="flex justify-center items-center h-screen">Carregando...</div>;
    }

    return (
        <main>
            <Head>
                <title>Cadastrar Produto</title>
            </Head>
            <Navbar />
            <ToastContainer position="top-right" autoClose={5000} />
            
            <div className="flex justify-center px-4 py-8">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-[10px] p-8 w-full max-w-[800px] mb-20 mt-[35%] lg:mt-[15%] shadow-custom"
                >
                    <h3 className="mb-6 text-marieth text-[1.8rem] font-bold">Cadastrar Novo Produto</h3>

                    <div className="mb-4">
                        <label htmlFor="provincia" className="block font-medium text-profile mb-2">Província</label>
                        <select
                            name="provincia"
                            id="provincia"
                            required
                            value={formData.provincia}
                            onChange={handleChange}
                            className="w-full p-[0.8rem] border-[1px] border-solid border-tab rounded-[10px] text-base transition-colors duration-150 cursor-pointer font-medium text-profile"
                        >
                            <option value="Escolha sua Provincia" disabled>Escolha sua Província</option>
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
                        <label htmlFor="categoria" className="block font-medium text-profile mb-2">Categoria</label>
                        <select
                            name="categoria"
                            id="categoria"
                            required
                            value={formData.categoria}
                            onChange={handleChange}
                            className="w-full p-[0.8rem] border-[1px] border-solid border-tab rounded-[10px] text-base transition-colors duration-150 cursor-pointer font-medium text-profile"
                        >
                            <option value="Escolha uma Categoria" disabled>Escolha uma Categoria</option>
                            <option value="Frutas">Frutas</option>
                            <option value="Verduras">Verduras</option>
                            <option value="Insumos">Insumos Agrícolas</option>
                            <option value="Graos">Grãos</option>
                            <option value="Tuberculos">Tubérculos e Raízes</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="nome" className="block font-medium text-profile mb-2">Nome do Produto:</label>
                        <input
                            type="text"
                            name="nome"
                            id="nome"
                            value={formData.nome}
                            onChange={handleChange}
                            required
                            className="w-full p-[0.8rem] border-[1px] border-solid border-tab rounded-[10px]"
                        />
                    </div>

                    <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="quantidade" className="block font-medium text-profile mb-2">Quantidade:</label>
                            <input
                                type="number"
                                min="1"
                                name="quantidade"
                                id="quantidade"
                                value={formData.quantidade}
                                onChange={handleChange}
                                required
                                className="w-full p-[0.8rem] border-[1px] border-solid border-tab rounded-[10px] text-base transition-colors duration-150"
                            />
                        </div>
                        <div>
                            <label htmlFor="Unidade" className="block font-medium text-profile mb-2">Unidade:</label>
                            <select
                                name="Unidade"
                                id="Unidade"
                                value={formData.Unidade}
                                onChange={handleChange}
                                required
                                className="w-full p-[0.8rem] border-[1px] border-solid border-tab rounded-[10px] text-base transition-colors duration-150 cursor-pointer font-medium text-profile"
                            >
                                <option value="Unidade" disabled hidden>Unidade</option>
                                <option value="Tonelada">Tonelada (1000Kg)</option>
                                <option value="kg">Kilograma (kg)</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="preco" className="block font-medium text-profile mb-2">Preço (AOA):</label>
                        <input
                            type="number"
                            name="preco"
                            id="preco"
                            value={formData.preco}
                            onChange={handleChange}
                            required
                            min={1}
                            className="w-full p-[0.8rem] border-[1px] border-solid border-tab rounded-[10px] text-base transition-colors duration-150"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="descricao" className="block font-medium text-profile mb-2">Descrição:</label>
                        <textarea
                            name="descricao"
                            id="descricao"
                            value={formData.descricao}
                            onChange={handleChange}
                            className="w-full rounded-[10px] text-base border-[1px] border-solid p-[0.8rem] border-tab min-h-[120px] resize-y"
                        ></textarea>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="foto_upload" className="block font-medium text-profile mb-2">Foto do Produto:</label>
                        <div 
                            className="w-full p-4 border-[2px] min-h-[150px] border-dashed hover:border-marieth border-tab text-center transition-all duration-150 cursor-pointer rounded-[10px] relative flex flex-col items-center justify-center"
                            onClick={() => document.getElementById('foto_upload')?.click()}
                        >
                            {!previewUrl ? (
                                <>
                                    <div className="text-gray-500 mb-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <p className="font-medium">Clique para selecionar uma imagem</p>
                                    <p className="text-sm text-gray-500 mt-1">ou arraste e solte aqui</p>
                                </>
                            ) : (
                                <div className="relative">
                                    <Image 
                                        src={previewUrl}
                                        alt="Pré-visualização"
                                        width={250}
                                        height={200}
                                        className="mx-auto max-h-48 object-contain rounded-[10px]"
                                    />
                                    <button 
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setPreviewUrl(null);
                                            setFotoProduto(null);
                                        }}
                                        aria-label="Remover imagem"
                                        title="Remover imagem"
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                            <input
                                type="file"
                                id="foto_upload"
                                name="foto_upload"
                                accept="image/*"
                                onChange={handleImagemChange}
                                className="hidden"
                            />
                        </div>
                    </div>

                    <div className="flex justify-between mt-6 gap-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="bg-vermelho text-white lg:py-3 lg:px-6 py-2 px-5 text-sm lg:text-base cursor-pointer font-medium transition-colors duration-150 hover:bg-red-500 flex border-none rounded-[10px]"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`bg-marieth text-white py:2 lg:py-3 px-5 lg:px-6 text-sm lg:text-base cursor-pointer font-medium transition-colors duration-150 hover:bg-verdeaceso flex border-none rounded-[10px] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Cadastrando...
                                </>
                            ) : (
                                'Cadastrar Produto'
                            )}
                        </button>
                    </div>
                </form>
            </div>
            <Footer />
        </main>
    );
}