"use client"
import Head from "next/head"
import Footer from "../Components/Footer"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation";
import { criarUsuario } from "../Services/user"
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function CadastroFornecedor() {
    const [tipoUsuario] = useState("Fornecedor"); 
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
        nome?: string;
        email?: string;
        senha?: string;
        contacto?: string;
        confirmarSenha?: string;
        descricao?: string;
        provincia?: string;
        municipio?: string;
        bairro?: string;
        rua?: string;
        geral?: string;
    }

    const [erros, setErros] = useState<Erros>({});
    const router = useRouter();
    const [etapa, setEtapa] = useState(1);

    // Validação em tempo real
    useEffect(() => {
        validateForm();
    }, [formData]);

    const validateForm = () => {
        const newErros: Erros = {};

        // Validação do nome
        if (formData.nome && formData.nome.trim().length < 2) {
            newErros.nome = "O nome deve ter pelo menos 2 caracteres";
        }

        // Validação do email
        if (formData.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                newErros.email = "Email inválido";
            }
        }

        // Validação da senha
        if (formData.senha) {
            if (formData.senha.length < 6 || formData.senha.length > 12) {
                newErros.senha = "A senha deve ter entre 6 e 12 caracteres";
            }
        }

        // Validação de confirmar senha
        if (formData.confirmarSenha && formData.senha !== formData.confirmarSenha) {
            newErros.confirmarSenha = "As senhas não coincidem";
        }

        // Validação do contacto
        if (formData.contacto) {
            const contactoLimpo = formData.contacto.replace("244|", "");
            const numeroAngola = /^9\d{8}$/;
            if (contactoLimpo && !numeroAngola.test(contactoLimpo)) {
                newErros.contacto = "O contacto deve ter 9 dígitos e começar com 9";
            }
        }

        // Validação da descrição
        if (formData.descricao && formData.descricao.trim().length < 10) {
            newErros.descricao = "A descrição deve ter pelo menos 10 caracteres";
        }

        // Validações da etapa 2 (endereço)
        if (etapa === 2) {
            if (formData.provincia && formData.provincia.trim().length < 1) {
                newErros.provincia = "Selecione uma província";
            }

            if (formData.municipio && formData.municipio.trim().length < 2) {
                newErros.municipio = "O município deve ter pelo menos 2 caracteres";
            }

            if (formData.bairro && formData.bairro.trim().length < 2) {
                newErros.bairro = "O bairro deve ter pelo menos 2 caracteres";
            }

            if (formData.rua && formData.rua.trim().length < 3) {
                newErros.rua = "A rua deve ter pelo menos 3 caracteres";
            }
        }

        setErros(newErros);
    };
   
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        if (name === "contacto") {
            let somenteNumeros = value.replace(/\D/g, "");
            
            if (somenteNumeros.startsWith("244")) {
                somenteNumeros = somenteNumeros.slice(3);
            }
    
            const numeroFormatado = `244|${somenteNumeros.slice(0, 9)}`;
            setFormData((prev) => ({ ...prev, contacto: numeroFormatado }));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };
    
    const handleNext = () => {
        // Verificar se há erros de validação na etapa 1
        const hasValidationErrors = ['nome', 'email', 'senha', 'confirmarSenha', 'contacto', 'descricao'].some(field => 
            erros[field as keyof Erros]
        );
        
        // Verificar campos obrigatórios da etapa 1
        if (hasValidationErrors || !formData.nome.trim() || !formData.email.trim() || !formData.contacto.trim() ||
            !formData.senha.trim() || !formData.confirmarSenha.trim() || !formData.descricao.trim()) {
            setErros(prev => ({ ...prev, geral: "Por favor, corrija os erros antes de continuar." }));
            return;
        }

        setErros({});
        setEtapa(2);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Forçar validação completa
        validateForm();
        
        // Verificar se há erros de validação
        const hasValidationErrors = Object.keys(erros).some(key => key !== 'geral' && erros[key as keyof Erros]);
        
        // Verificar campos obrigatórios da etapa 2
        if (hasValidationErrors || !formData.provincia || !formData.municipio || !formData.bairro || !formData.rua) {
            setErros(prev => ({ ...prev, geral: "Por favor, corrija os erros antes de continuar." }));
            return;
        }

        setErros({});
        setLoading(true);
    
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
            setTimeout(() => {
                router.push("/");
            }, 1000);
        } catch (error: any) {
            console.log("Erro ao criar conta:", error);
            
            if (error.status === 409) {
                setErros({ geral: error.message || "Este email já está em uso." });
            } else {
                setErros({ geral: error.message || "Erro ao criar conta. Por favor, tente novamente." });
            }
        } finally {
            setLoading(false);
        }
    };
    
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
                <title>Cadastrar Fornecedor</title>
            </Head>
            <div className="p-6 text-center text-white bg-primary">
                <h1 className="text-[32px] font-bold">Cadastrar Fornecedor</h1>
            </div>
            <div className="flex items-center justify-center mb-20 mt-10"> 
                <div className="bg-white rounded-[10px] p-8 w-full max-w-[800px] shadow-custom">
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
                                            className={`p-3 border-solid border-[1px] ${erros.nome ? 'border-red-500' : 'hover:border-marieth border-tab'} w-[100%] text-base rounded-[5px]`}
                                            required 
                                            value={formData.nome}
                                            placeholder="Ex.: Marieth Pascoal" 
                                            onChange={handleInputChange}
                                        />
                                        {erros.nome && <p className="text-red-500 text-sm mt-1">{erros.nome}</p>}
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="email" className="mb-2 font-medium block text-profile">Email</label>
                                        <input 
                                            type="email" 
                                            id="email" 
                                            name="email"
                                            value={formData.email}
                                            className={`p-3 border-solid border-[1px] ${erros.email ? 'border-red-500' : 'hover:border-marieth border-tab'} w-[100%] text-base rounded-[5px]`}
                                            required 
                                            placeholder="Ex.: marieth@example.com"
                                            onChange={handleInputChange}
                                        />
                                        {erros.email && <p className="text-red-500 text-sm mt-1">{erros.email}</p>}
                                    </div>
                                       
                                    <div className="mb-4">
                                        <label htmlFor="contacto" className="mb-2 font-medium block text-profile">Telefone</label>
                                        <input 
                                            type="tel" 
                                            id="contacto" 
                                            name="contacto"
                                            value={formData.contacto}
                                            className={`p-3 border-solid border-[1px] ${erros.contacto ? 'border-red-500' : 'hover:border-marieth border-tab'} w-[100%] text-base rounded-[5px]`}
                                            required 
                                            max={13}
                                            onChange={handleInputChange}
                                            placeholder="9xxxxxxxx"
                                        />
                                        {erros.contacto && <p className="text-red-500 text-sm mt-1">{erros.contacto}</p>}
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
                                                className={`p-3 pr-10 border ${erros.senha ? 'border-red-500' : 'border-tab hover:border-marieth'} w-full text-base rounded-[5px]`}
                                                required
                                                maxLength={12}
                                                onChange={handleInputChange}
                                                placeholder="xxxxxxxxxxxx"
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
                                        {erros.senha && <p className="text-red-500 text-sm mt-1">{erros.senha}</p>}
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
                                                className={`p-3 pr-10 border ${erros.confirmarSenha ? 'border-red-500' : 'border-tab hover:border-marieth'} w-full text-base rounded-[5px]`}
                                                required
                                                maxLength={12}
                                                onChange={handleInputChange}
                                                placeholder="xxxxxxxxxxxx"
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
                                        {erros.confirmarSenha && <p className="text-red-500 text-sm mt-1">{erros.confirmarSenha}</p>}
                                    </div>
                            
                                    <div className="mb-4">
                                        <label htmlFor="descricao" className="mb-2 font-medium block text-profile">Descreve as Principais culturas(opcional)</label>
                                        <textarea 
                                            id="descricao" 
                                            name="descricao"
                                            required
                                            value={formData.descricao}
                                            maxLength={255}
                                            className={`p-3 border-solid border-[1px] resize-y ${erros.descricao ? 'border-red-500' : 'hover:border-marieth border-tab'} min-h-[80px] w-[100%] text-base rounded-[5px]`}
                                            onChange={handleInputChange}
                                            placeholder="Eu sou X e cultivo Milho, Soja, Café, Banana etc.."
                                        ></textarea>
                                        {erros.descricao && <p className="text-red-500 text-sm mt-1">{erros.descricao}</p>}
                                    </div>

                                    {erros.geral && <p className="text-red-500 text-sm mb-4">{erros.geral}</p>}

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
                                    
                                    <div className="mb-4"> 
                                        <label htmlFor="provincia" className="mb-2 font-medium block text-profile">Província</label>
                                        <select 
                                            name="provincia" 
                                            onChange={handleInputChange} 
                                            value={formData.provincia} 
                                            id="provincia" 
                                            className={`p-3 border-solid border-[1px] ${erros.provincia ? 'border-red-500' : 'hover:border-marieth border-tab'} w-[100%] text-base rounded-[5px]`}
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
                                        {erros.provincia && <p className="text-red-500 text-sm mt-1">{erros.provincia}</p>}
                                    </div>
                               
                                    <div className="mb-4 gap-2">
                                        <label htmlFor="municipio" className="mb-2 font-medium block text-profile">Munucípio</label>
                                        <input 
                                            type="text" 
                                            id="municipio" 
                                            name="municipio"
                                            className={`p-3 border-solid border-[1px] ${erros.municipio ? 'border-red-500' : 'hover:border-marieth border-tab'} w-[100%] text-base rounded-[5px]`}
                                            required 
                                            value={formData.municipio} 
                                            onChange={handleInputChange}
                                            placeholder="Ex.: Cazenga, Viana, Lubango, etc."
                                        />
                                        {erros.municipio && <p className="text-red-500 text-sm mt-1">{erros.municipio}</p>}
                                    </div>
                                    
                                    <div className="mb-4 gap-2">
                                        <label htmlFor="bairro" className="mb-2 font-medium block text-profile">Bairro</label>
                                        <input 
                                            type="text" 
                                            id="bairro" 
                                            name="bairro"
                                            className={`p-3 border-solid border-[1px] ${erros.bairro ? 'border-red-500' : 'hover:border-marieth border-tab'} w-[100%] text-base rounded-[5px]`}
                                            
                                            value={formData.bairro}
                                            placeholder="Ex.:Calemba2" 
                                            onChange={handleInputChange}
                                        />
                                        {erros.bairro && <p className="text-red-500 text-sm mt-1">{erros.bairro}</p>}
                                    </div>
                                    
                                    <div className="mb-4 gap-2">
                                        <label htmlFor="rua" className="mb-2 font-medium block text-profile">Rua</label>
                                        <input 
                                            type="text" 
                                            id="rua" 
                                            name="rua"
                                            className={`p-3 border-solid border-[1px] ${erros.rua ? 'border-red-500' : 'border-tab hover:border-marieth'} w-[100%] text-base rounded-[5px]`}
                                            required 
                                            value={formData.rua}
                                            placeholder="Ex.: Rua da Gabela" 
                                            onChange={handleInputChange}
                                        />
                                        {erros.rua && <p className="text-red-500 text-sm mt-1">{erros.rua}</p>}
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