"use client"
import Head from "next/head"
import Footer from "../Components/Footer"
import React, { useState } from "react"
import { useRouter } from "next/navigation";
import { criarUsuario } from "../Services/user"
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function CadastroAgricultor() {
    const [tipoUsuario] = useState("Agricultor"); 
    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        senha: "",
        confirmarSenha: "",
        descricao: "",
        contacto: "244|",
        rua: "",
        bairro: "",
        municipio: "",
        provincia: "",
    });
    const [senhaVisivel, setSenhaVisivel] = useState(false)
    const [confirmarSenhaVisivel, setConfirmarSenhaVisivel] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sucesso, setSucesso] = useState(false);

    interface Erros {
        contacto?: string;
        confirmarSenha?: string;
        geral?: string;
    }

    const [erros, setErros] = useState<Erros>({});
    const router = useRouter();
    const [etapa, setEtapa] = useState(1);
   
    const handleInputChange = (e :React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        if (name ==="contacto") {
            let somenteNumeros = value.replace(/\D/g, ""); // Remove tudo que não for número
            
            // Se o valor digitado for apenas "244", evita remover o prefixo acidentalmente
            if (somenteNumeros.startsWith("244")) {
                somenteNumeros = somenteNumeros.slice(3); // Remove o prefixo para evitar duplicação
            }
    
            const numeroFormatado = `244|${somenteNumeros.slice(0, 9)}`; // Garante no máximo 9 dígitos após o código do país
            setFormData((prev) => ({ ...prev, contacto: numeroFormatado }));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };
    
    const handleNext = () => {
        if(!formData.nome.trim() || !formData.email.trim() || !formData.contacto.trim()
        || !formData.senha.trim() || !formData.confirmarSenha.trim()){
            alert("Por favor, insira todos os dados")
            return
        }
        setEtapa(2)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErros({});
        setLoading(true);
    
        // Validação do formulário
        if (formData.senha !== formData.confirmarSenha) {
            setErros({ confirmarSenha: "As senhas não coincidem." });
            setLoading(false);
            return;
        }
    
        // Remover o prefixo do número de telefone
        const contactoLimpo = formData.contacto.replace("244|", "");
    
        try {
            const resposta = await criarUsuario({
                nome: formData.nome.trim(),
                email: formData.email.trim(),
                senha: formData.senha,
                descricao: formData.descricao,
                contacto: contactoLimpo, 
                tipo_usuario: tipoUsuario,
                rua: formData.rua || "",
                bairro: formData.bairro || "",
                municipio: formData.municipio || "",
                provincia: formData.provincia || ""
            });
    
            console.log("Usuário criado com sucesso:", resposta);
            setSucesso(true);
            
            
            // Usar um timeout mais longo para garantir que o alerta seja visto
            setTimeout(() => {
                router.push("/");
            }, 1000);
        } catch (error: any) {
            console.log("Erro ao criar conta:", error);
            
            // Tratamento de erro específico para cada campo
             if (error.status === 409) {
                setErros({ geral: error.message || "Este email já está em uso." });
            } else {
                setErros({ geral: error.message || "Erro ao criar conta. Por favor, tente novamente." });
            }
        } finally {
            setLoading(false);
        }
    };
    
    // Se o sucesso for true e não houver redirecionamento automático, forçar o redirecionamento
    React.useEffect(() => {
        if (sucesso) {
            const timer = setTimeout(() => {
                router.push("/");
            }, 3000);
            
            return () => clearTimeout(timer);
        }
    }, [sucesso, router]);

    return (
        <main>
            <Head>
                <title>Cadastrar Agricultor</title>
            </Head>
            <div className="p-6 text-center text-white bg-primary">
                <h1 className="text-[32px] font-bold">Cadastrar Agricultor</h1>
            </div>
            <div className="mb-20 mt-10"> 
                <div className="bg-white rounded-[10px] p-8 w-full max-w-[800px] lg:ml-[20%] shadow-custom">
                    <div className="mx-32"></div>

                    {sucesso ? (
                        <div className="text-center py-6">
                            <div className="text-green-600 text-xl font-bold mb-4">
                                Conta criada com sucesso!
                            </div>
                            <p className="mb-4">Bem-vindo(a) à NzoAgro. Redirecionando para a página inicial...</p>
                            <div className="animate-pulse text-marieth">
                                Aguarde um momento...
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            {etapa === 1 && (
                                <>
                                    <div className="mb-4 gap-2">
                                        <label htmlFor="nome" className="mb-2 font-medium block text-profile">Nome Completo</label>
                                        <input 
                                            type="text" 
                                            id="nome" 
                                            name="nome"
                                            className="p-3 border-solid border-[1px] hover:border-marieth border-tab w-[100%] text-base rounded-[5px]" 
                                            required 
                                            value={formData.nome}
                                            placeholder="Ex.: Marieth Pascoal" 
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="email" className="mb-2 font-medium block text-profile">Email</label>
                                        <input 
                                            type="email" 
                                            id="email" 
                                            name="email"
                                            value={formData.email}
                                            className="p-3 border-solid border-[1px] hover:border-marieth border-tab w-[100%] text-base rounded-[5px]" 
                                            required 
                                            placeholder="Ex.: marieth@example.com"
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="contacto" className="mb-2 font-medium block text-profile">Telefone</label>
                                        <input 
                                            type="tel" 
                                            id="contacto" 
                                            name="contacto"
                                            value={formData.contacto}
                                            className="p-3 border-solid border-[1px] hover:border-marieth border-tab w-[100%] text-base rounded-[5px]" 
                                            required 
                                            max={13}
                                            placeholder="9xxxxxxxx"
                                            onChange={handleInputChange}
                                        />
                                        {erros.contacto && <p className="text-vermelho text-sm">{erros.contacto}</p>}
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="senha" className="mb-2 font-medium block text-profile">
                                            Senha
                                        </label>
                            
                                        <div className="relative">
                                            <input 
                                                type={senhaVisivel ? "text" : "password" } 
                                                id="senha" 
                                                name="senha"
                                                value={formData.senha}
                                                className="p-3 pr-10 border border-tab hover:border-marieth w-full text-base rounded-[5px]"  
                                                required
                                                maxLength={12}
                                                placeholder="xxxxxxxxxxxx"
                                                onChange={handleInputChange}
                                            />
                            
                                            <span 
                                                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                                                onClick={() => setSenhaVisivel(!senhaVisivel)}
                                            >
                                                {senhaVisivel ? (
                                                    <FiEyeOff className="w-5 h-5" />
                                                ) : (
                                                    <FiEye className="w-5 h-5" />
                                                )}
                                            </span>
                                        </div>
                                    </div>
                            
                                    <div className="mb-4">
                                        <label htmlFor="confirmarSenha" className="mb-2 font-medium block text-profile">
                                            Confirmar Senha
                                        </label>
                            
                                        <div className="relative">
                                            <input 
                                                type={confirmarSenhaVisivel ? "text" : "password"} 
                                                id="confirmarSenha" 
                                                name="confirmarSenha"
                                                value={formData.confirmarSenha}
                                                className="p-3 pr-10 border border-tab hover:border-marieth w-full text-base rounded-[5px]"  
                                                required
                                                maxLength={12}
                                                placeholder="xxxxxxxxxxxx"
                                                onChange={handleInputChange}
                                            />
                            
                                            <span 
                                                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                                                onClick={() => setConfirmarSenhaVisivel(!confirmarSenhaVisivel)}
                                            >
                                                {confirmarSenhaVisivel ? (
                                                    <FiEyeOff className="w-5 h-5" />
                                                ) : (
                                                    <FiEye className="w-5 h-5" />
                                                )}
                                            </span>
                                        </div>
                                        {erros.confirmarSenha && <p className="text-vermelho text-sm">{erros.confirmarSenha}</p>}
                                    </div>
                            
                                    <div className="mb-4">
                                        <label htmlFor="descricao" className="mb-2 font-medium block text-profile">Descreve as Principais culturas</label>
                                        <textarea 
                                            id="descricao" 
                                            name="descricao"
                                            required
                                            value={formData.descricao}
                                            maxLength={255}
                                            className="p-3 border-solid border-[1px] resize-y hover:border-marieth min-h-[80px] border-tab w-[100%] text-base rounded-[5px]"  
                                            onChange={handleInputChange}
                                            placeholder="Eu sou X e cultivo Milho, Soja, Café, Banana etc.."
                                        ></textarea>
                                    </div>

                                    <div className="flex justify-between mt-6">
                                        <button 
                                            type="button" 
                                            onClick={() => router.push("/Seleccionar")} 
                                            className="border-marieth border-[1px] bg-transparent py-[0.8rem] font-medium cursor-pointer rounded-[5px] text-base px-8 text-marieth"
                                        >
                                            Voltar
                                        </button>

                                        <button 
                                            type="button"
                                            onClick={handleNext}
                                            className="bg-gradient-to-r from-green-500 to-green-600 text-white py-[0.8rem] border-none font-medium cursor-pointer rounded-[5px] text-base px-8 hover:bg-verdeaceso"
                                        >
                                            Próximo Passo
                                        </button>
                                    </div>
                                </>
                            )}
                           
                            {etapa === 2 && (
                                <>
                                    <h1 className="text-xl text-marieth mb-4">Endereço da Propriedade</h1>
                                    <label htmlFor="provincia" className="sr-only">Provincia</label>
                                    <div className="mb-4"> 
                                        <select 
                                            name="provincia" 
                                            onChange={handleInputChange} 
                                            value={formData.provincia} 
                                            id="provincia" 
                                            className="p-3 border-solid border-[1px] hover:border-marieth border-tab w-[100%] text-base rounded-[5px]"
                                            required
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
                                            <option value="Moxico">Moxíco</option>
                                            <option value="Namibe">Namibe</option>
                                            <option value="Uige">Uíge</option>
                                            <option value="Zaire">Zaíre</option>
                                        </select>
                                    </div>
                               
                                    <div className="mb-4 gap-2">
                                        <label htmlFor="municipio" className="mb-2 font-medium block text-profile">Munucípio</label>
                                        <input 
                                            type="text" 
                                            id="municipio" 
                                            name="municipio"
                                            className="p-3 border-solid border-[1px] hover:border-marieth border-tab w-[100%] text-base rounded-[5px]" 
                                            required 
                                            value={formData.municipio} 
                                            onChange={handleInputChange}
                                            placeholder="Ex.: Cazenga, Viana, Lubango, etc."
                                        />
                                    </div>
                                    <div className="mb-4 gap-2">
                                        <label htmlFor="bairro" className="mb-2 font-medium block text-profile">Bairro</label>
                                        <input 
                                            type="text" 
                                            id="bairro" 
                                            name="bairro"
                                            className="p-3 border-solid border-[1px] hover:border-marieth border-tab w-[100%] text-base rounded-[5px]" 
                                            required 
                                            value={formData.bairro}
                                            placeholder="Ex.:Calemba2" 
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="mb-4 gap-2">
                                        <label htmlFor="rua" className="mb-2 font-medium block text-profile">Rua</label>
                                        <input 
                                            type="text" 
                                            id="rua" 
                                            name="rua"
                                            className="p-3 border-solid border-[1px] border-tab w-[100%] hover:border-marieth text-base rounded-[5px]" 
                                            required 
                                            value={formData.rua}
                                            placeholder="Ex.: Rua da Gabela" 
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    {erros.geral && <p className="text-red-500 text-sm mb-4">{erros.geral}</p>}

                                    <div className="flex justify-between">
                                        <button 
                                            type="button" 
                                            onClick={() => setEtapa(1)}
                                            className="border-marieth border-[1px] bg-transparent py-[0.8rem] font-medium cursor-pointer rounded-[5px] text-base transition-all duration- ease-in-out px-8 text-marieth"
                                        >
                                            Voltar
                                        </button>

                                        <button 
                                            type="submit"
                                            disabled={loading}
                                            className={`${loading ? 'bg-gray-400' : 'bg-marieth hover:bg-verdeaceso'} text-white py-[0.8rem] border-none font-medium cursor-pointer rounded-[5px] text-base transition-all duration- ease-in-out px-8`}
                                        >
                                            {loading ? 'Processando...' : 'Cadastrar'}
                                        </button>
                                    </div>
                                </>
                            )}
                        </form>
                    )}
                </div>
            </div>
            <Footer />
        </main>
    );
}