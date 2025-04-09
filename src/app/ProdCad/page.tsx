import Head from "next/head";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import { criarProduto } from "../Services/produtos";
import { useState } from "react";

export default function CriarProduto() {
    const [formData, setFormData] = useState({
        provincia: "",
        categoria: "",
        nomeProduto: "",
        quantidade: "",
        unidade: "",
        preco: "",
        descricao: "",
    });

    const handlechange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validação simples
        if (!formData.nomeProduto || !formData.preco || !formData.quantidade) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        try {
            const response = await criarProduto(formData);
            alert("Produto cadastrado com sucesso");
            console.log(response);
        } catch (error) {
            alert("Erro ao cadastrar Produto");
            console.error(error);
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
                            className="w-full p-[0.8rem] border-[1px] border-solid border-tab rounded-[10px] text-base transition-colors duration-150 cursor-pointer font-medium text-profile"
                        >
                            <option value="Província">Província</option>
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
                            <option value="">Escolha uma Categoria</option>
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
                            onChange={handlechange}
                            value={formData.nomeProduto}
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
                            value={formData.unidade}
                            className="w-full p-[0.8rem] border-[1px] border-solid border-tab rounded-[10px] text-base transition-colors duration-150 cursor-pointer font-medium text-profile"
                        >
                            <option value="Unidade">Unidade</option>
                            <option value="Tonelada">Tonelada(1000Kg)</option>
                            <option value="Quintal(100Kg)">Quintal(100Kg)</option>
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
                        <label htmlFor="" className="block font-medium text-profile mb-2">
                            <p className="font font-medium mt.4">Clique e arraste a foto</p>
                        </label>
                    </div>

                    <div className="flex justify-between">
                        <button
                            type="button"
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
