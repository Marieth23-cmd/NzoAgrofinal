"use client"
import Head from "next/head";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import { criarProduto } from "../Services/produtos";
import { useState } from "react";
import { verificarAuth} from "../Services/auth"
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";


export default function CriarProduto() {
    const router = useRouter();
    const [autenticado, setAutenticado] = useState<boolean | null>(null);
    const [foto_produto, setfoto] = useState<File | null>(null);
const [previewUrl, setPreviewUrl] = useState<string | null>(null);
const [loading, setLoading] = useState(false); 

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

    const [formData, setFormData] = useState({
        provincia: "",
        categoria: "",
        nome: "",
        quantidade: "",
        Unidade: "",
        preco: "",
        descricao: "",
        foto_produto:""
    });

    const handlechange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.type === 'number' ? Number(e.target.value) : e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    

        if (!formData.nome || !formData.preco || !formData.quantidade) {
            alert( "Por favor, preencha todos os campos obrigatórios.");
            return;
        }
    
        
        const produtoData = {
            ...formData,
            quantidade: Number(formData.quantidade),
            preco: Number(formData.preco),
        };
    
        if (isNaN(produtoData.preco) || produtoData.preco <= 0) {
            alert("O preço deve ser um número válido e maior que zero.");
            return;
        }
    
        if (isNaN(produtoData.quantidade) || produtoData.quantidade <= 0) {
            alert("A quantidade deve ser um número válido e maior que zero.");
            return;
        }
        if (!formData.provincia || formData.provincia === "Escolha sua Provincia") {
            alert("Por favor, selecione uma província válida.");
            return;
        }
        
        if (!formData.categoria || formData.categoria === "Escolha uma Categoria") {
            alert("Por favor, selecione uma categoria válida.");
            return;
        }
        
    
        
        const form = new FormData();
        form.append("provincia", formData.provincia);
        form.append("categoria", formData.categoria);
        form.append("nome", formData.nome);
        form.append("quantidade", formData.quantidade.toString());  
        form.append("Unidade", formData.Unidade);
        form.append("preco", formData.preco.toString());  
        form.append("descricao", formData.descricao);
        form.append("foto_produto", formData.foto_produto);
    
    
        if (foto_produto) {
            form.append("foto_produto", foto_produto);  
        }
    
        
        try {
            const response = await criarProduto(form);  
            alert("Produto cadastrado com sucesso");
            console.log(response);
        } catch (error:any) {
            alert( error.mensagem || "Erro ao cadastrar Produto");
            console.error(error);
        }
        setLoading(false);
    };
    
    const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setfoto(file);
            setPreviewUrl(URL.createObjectURL(file)); // mostra preview
        }
    };

    return (
        <main>
            <Head>
                <title>Cadastrar Produto</title>
            </Head>
            <Navbar />
            <div>
                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-[10px] p-8 w-full max-w-[800px] ml-[20%] mb-20 mt-[15%] shadow-custom"
                >
                    <h3 className="mb-6 text-marieth text-[1.8rem] font-bold ">Cadastrar Novo Produto</h3>

                    <div className="mb-4 items-center">
                        <label htmlFor="Provincia" className="sr-only">Província</label>
                        <select
                             name="provincia"
                             id="Provincia"
                             required
                             value={formData.provincia}
                             onChange={handlechange}
                            className="w-full p-[0.8rem] border-[1px] border-solid border-tab rounded-[10px] text-base transition-colors duration-150 cursor-pointer font-medium text-profile"
                        >
                            <option value="Escolha sua Provincia" disabled hidden>Escolha sua Província</option>
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
                            onChange={handlechange}
                            value={formData.categoria}
                            id="option"
                            required
                            className="mb-6 cursor-pointer font-medium text-profile w-full p-[0.8rem] border-[1px] border-solid border-tab rounded-[10px] text-base transition-colors duration-150"
                        >
                            <option value="Escolha uma Categoria"  disabled hidden>Escolha uma Categoria</option>
                            <option value="Frutas">Frutas</option>
                            <option value="Verduras">Verduras</option>
                            <option value="Insumos ">Insumos Agricolas</option>
                            <option value="Graos">Grãos</option>
                            <option value="Tuberculos">Tubérculos e Raízes</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="nome">Nome:</label>
                        <input
                            type="text"
                            name="nomeProduto"
                            onChange={handlechange}
                            value={formData.nome}
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
                            value={formData.quantidade}
                            onChange={handlechange}
                            name="quantidade"
                            id="quantidade"
                            className="w-full p-[0.8rem] cursor-pointer border-[1px] border-solid border-tab rounded-[10px] text-base transition-colors duration-150"
                        />
                        <label htmlFor="unidade" className="sr-only">Unidade</label>
                        <select
                            name="unidade"
                            id="unidade"
                            required
                            onChange={handlechange}
                            value={formData.Unidade}
                            className="w-full p-[0.8rem] border-[1px] border-solid border-tab rounded-[10px] text-base transition-colors duration-150 cursor-pointer font-medium text-profile"
                        >
                            <option value="Unidade">Unidade</option>
                            <option value="Tonelada">Tonelada(1000Kg)</option>
                            <option value="kg">Kilograma(kg)</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="preco" className="block font-medium text-profile mb-2">Preço(AOA)</label>
                        <input
                            type="number"
                            onChange={handlechange}
                            value={formData.preco}
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
                            value={formData.descricao}
                            onChange={handlechange}
                            id="descricao"
                            required
                            className="w-full rounded-[10px] text-base border-[1px] border-solid p-[0.8rem] border-tab min-h-[120px] resize-y"
                        ></textarea>
                    </div>

                    <div className="w-full mb-4 border-[2px] min-h-[80px] border-dashed hover:border-marieth border-tab text-center transition-all duration-150 cursor-pointer rounded-[10px]">
                        <label htmlFor="imagem" className="block font-medium text-profile mb-2">
                            <p className="font font-medium mt.4">Clique e arraste a foto</p>

                            <input
                        type="file"
                        name="imagem"
                        id="imagem"
                        accept="image/*"
                        onChange={handleImagemChange}
                        width={200} 
                        height={200}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {previewUrl && (<Image src={previewUrl}
                    height={200}
                    width={250}
                    alt="Pré-visualização"
            className="mx-auto mt-4 max-h-48 object-contain rounded-[10px]"
       />)}
                    



                        </label>
                    </div>

                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={()=>router.back()}
                            className="bg-vermelho text-white py-4 px-8 text-base cursor-pointer font-medium transition-colors duration-150 hover:bg-red-400 mt-4 flex border-none rounded-[10px]"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-marieth text-white py-4 px-8 text-base cursor-pointer font-medium transition-colors duration-150 hover:bg-verdeaceso mt-4 flex border-none rounded-[10px]"
                        >

                            Cadastrar
                        </button>
                    </div>
                </form>
            </div>
            <Footer />
        </main>
    );
}
