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
    const [produtosCadastrados, setProdutosCadastrados] = useState<string[]>([]);
    const [mostrarProdutosCadastrados, setMostrarProdutosCadastrados] = useState(false);

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

    // Estado do formulário - Valores padrão válidos
    const initialFormState = {
        provincia: "",
        categoria: "",
        nome: "",
        quantidade: "",
        Unidade: "kg",
        preco: "",
        descricao: "",
        peso_kg: ""
    };

    const [formData, setFormData] = useState(initialFormState);

    // Manipulador de mudanças em campos de texto e seleção
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
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

    // Limpar formulário
    const limparFormulario = () => {
        setFormData(initialFormState);
        setFotoProduto(null);
        setPreviewUrl(null);
    };

    // Redirecionar para a página de todos os produtos
    const irParaTodosProdutos = () => {
        router.push("/TodosProdutos");
    };

    // Alternância da visualização dos produtos cadastrados
    const toggleProdutosCadastrados = () => {
        setMostrarProdutosCadastrados(!mostrarProdutosCadastrados);
    };

    // Envio do formulário
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validações
            if (!formData.nome) {
                throw new Error("Por favor, informe o nome do produto.");
            }
            
            if (!formData.preco) {
                throw new Error("Por favor, informe o preço do produto.");
            }
            
            if (!formData.quantidade) {
                throw new Error("Por favor, informe a quantidade do produto.");
            }
            
            if (!formData.provincia || formData.provincia === "Escolha sua Provincia") {
                throw new Error("Por favor, selecione uma província válida.");
            }
            
            if (!formData.categoria || formData.categoria === "Escolha uma Categoria") {
                throw new Error("Por favor, selecione uma categoria válida.");
            }
            
            if (!formData.peso_kg || formData.peso_kg === "Por favor cadastre o peso do produto") {
                throw new Error("Por favor cadastre o peso do Produto.");
            }
            
            const precoNumerico = Number(formData.preco);
            const quantidadeNumerica = Number(formData.quantidade);
            
            if (isNaN(precoNumerico) || precoNumerico <= 0) {
                throw new Error("O preço deve ser um número válido e maior que zero.");
            }
        
            if (isNaN(quantidadeNumerica) || quantidadeNumerica <= 0) {
                throw new Error("A quantidade deve ser um número válido e maior que zero.");
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
            formDataToSend.append("peso_kg", formData.peso_kg);
            
            if (foto_produto) {
                formDataToSend.append("foto_produto", foto_produto);
            }
        
            const resultado = await criarProduto(formDataToSend);
            
            // Adicionar o produto à lista de produtos cadastrados
            setProdutosCadastrados(prev => [...prev, formData.nome]);
            
            toast.success(`Produto "${formData.nome}" cadastrado com sucesso!`);
            
            // Limpar o formulário para um novo cadastro
            limparFormulario();
            
        } catch (error: any) {
            toast.error(error.message || error.mensagem || "Erro ao cadastrar produto");
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
                <div className="w-full max-w-[800px] mb-20 mt-[35%] lg:mt-[15%]">
                    {/* Barra de informação de produtos cadastrados */}
                    {produtosCadastrados.length > 0 && (
                        <div className="bg-green-50 border border-green-200 rounded-[10px] p-4 mb-4 shadow-sm">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="font-medium text-green-800">
                                        {produtosCadastrados.length} {produtosCadastrados.length === 1 ? 'produto cadastrado' : 'produtos cadastrados'} nesta sessão
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={toggleProdutosCadastrados}
                                        className="text-sm text-green-700 hover:text-green-900 underline focus:outline-none"
                                    >
                                        {mostrarProdutosCadastrados ? 'Ocultar lista' : 'Ver lista'}
                                    </button>
                                </div>
                            </div>
                            
                            {/* Lista de produtos cadastrados (expansível) */}
                            {mostrarProdutosCadastrados && (
                                <div className="mt-3 pl-7">
                                    <ul className="list-disc text-sm text-green-800">
                                        {produtosCadastrados.map((produto, index) => (
                                            <li key={index}>{produto}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white rounded-[10px] p-8 shadow-custom"
                    >
                        <h3 className="mb-6 text-marieth text-[1.8rem] font-bold">
                            {produtosCadastrados.length > 0 ? 'Cadastrar Outro Produto' : 'Cadastrar Novo Produto'}
                        </h3>
                        
                        {produtosCadastrados.length > 0 && (
                            <div className="mb-6 bg-blue-50 border border-blue-100 rounded-[10px] p-4">
                                <div className="flex items-center text-blue-800">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    <span>Você já cadastrou produtos nesta sessão. Para encerrar e visualizar todos, clique em "Finalizar e Ver Todos Produtos" após terminar.</span>
                                </div>
                            </div>
                        )}

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
                                <option value="">Escolha sua Província</option>
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
                                <option value="">Escolha uma Categoria</option>
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
                                placeholder="Ex: Tomate, Cenoura, Milho"
                                autoComplete="off"
                                autoCorrect="off"
                                autoCapitalize="off"
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
                                    placeholder="Ex: 100"
                                    autoComplete="off"
                                    autoCorrect="off"
                                    autoCapitalize="off"
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
                                    autoComplete="off"
                                    autoCorrect="off"
                                    autoCapitalize="off"
                                    value={formData.Unidade}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-[0.8rem] border-[1px] border-solid border-tab rounded-[10px] text-base transition-colors duration-150 cursor-pointer font-medium text-profile"
                                >
                                    <option value="kg">Kilograma (kg)</option>
                                    <option value="Tonelada">Tonelada (1000Kg)</option>
                                </select>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="peso_kg" className="block font-medium text-profile mb-2">Peso (kg):</label>
                            <input
                                type="number"
                                name="peso_kg"
                                id="peso_kg"
                                value={formData.peso_kg}
                                onChange={handleChange}
                                required
                                min={1}
                                className="w-full p-[0.8rem] border-[1px] border-solid border-tab rounded-[10px] text-base transition-colors duration-150"
                            />
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

                        {/* Seção de botões de ação */}
                        <div className="mt-8">
                            {/* Botões de navegação e cancelamento */}
                            <div className="flex justify-between mb-4 gap-2 lg:gap-0">
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="bg-vermelho text-white lg:py-3 lg:px-6 py-2 px-5 text-sm lg:text-base cursor-pointer font-medium transition-colors duration-150 hover:bg-red-500 flex border-none rounded-[10px]"
                                    disabled={loading}
                                >
                                    Cancelar
                                </button>
                                
                                {produtosCadastrados.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={irParaTodosProdutos}
                                        className="bg-blue-600 text-white lg:py-3 lg:px-6 py-2 px-5 text-sm lg:text-base cursor-pointer font-medium transition-colors duration-150 hover:bg-blue-700 flex items-center border-none rounded-[10px]"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                        </svg>
                                        Finalizar e Ver Todos Produtos
                                    </button>
                                )}
                            </div>
                            
                            {/* Botão de submissão */}
                            <div className="flex w-full">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`bg-marieth text-white py-3 px-6 text-base cursor-pointer font-medium transition-colors duration-150 hover:bg-verdeaceso border-none rounded-[10px] w-full ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Cadastrando...
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                            </svg>
                                            {produtosCadastrados.length > 0 ? 'Cadastrar Mais Um Produto' : 'Cadastrar Produto'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </main>
    );
}