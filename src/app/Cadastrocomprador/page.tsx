"use client"
import Head from "next/head"
import Footer from "../Components/Footer"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation";
import { criarUsuario } from "../Services/user"
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function CadastroComprador() {
    const [tipoUsuario] = useState("Comprador"); 
    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        senha: "",
        confirmarSenha: "",
        descricao: "",
        contacto: "244|"
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
        geral?: string;
    }

    const [erros, setErros] = useState<Erros>({});
    const router = useRouter();

    console.log("🚀 Componente CadastroComprador renderizado");
    console.log("📋 FormData atual:", formData);
    console.log("❌ Erros atuais:", erros);
    console.log("⏳ Loading:", loading);

    // Remover validação em tempo real que pode estar causando problemas
    // useEffect(() => {
    //     validateForm();
    // }, [formData]);

    const validateForm = () => {
        console.log("🔍 Iniciando validação do formulário");
        const newErros: Erros = {};

        // Validação do nome
        if (formData.nome && formData.nome.trim().length < 2) {
            newErros.nome = "O nome deve ter pelo menos 2 caracteres";
            console.log("❌ Erro no nome:", newErros.nome);
        }

        // Validação do email
        if (formData.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                newErros.email = "Email inválido";
                console.log("❌ Erro no email:", newErros.email);
            }
        }

        // Validação da senha
        if (formData.senha) {
            if (formData.senha.length < 6 || formData.senha.length > 12) {
                newErros.senha = "A senha deve ter entre 6 e 12 caracteres";
                console.log("❌ Erro na senha:", newErros.senha);
            }
        }

        // Validação de confirmar senha
        if (formData.confirmarSenha && formData.senha !== formData.confirmarSenha) {
            newErros.confirmarSenha = "As senhas não coincidem";
            console.log("❌ Erro na confirmação de senha:", newErros.confirmarSenha);
        }

        // Validação do contacto
        if (formData.contacto) {
            const contactoLimpo = formData.contacto.replace("244|", "");
            const numeroAngola = /^9\d{8}$/;
            if (contactoLimpo && !numeroAngola.test(contactoLimpo)) {
                newErros.contacto = "O contacto deve ter 9 dígitos e começar com 9";
                console.log("❌ Erro no contacto:", newErros.contacto);
            }
        }

        // Validação da descrição
        if (formData.descricao && formData.descricao.trim().length < 10) {
            newErros.descricao = "A descrição deve ter pelo menos 10 caracteres";
            console.log("❌ Erro na descrição:", newErros.descricao);
        }

        console.log("✅ Validação concluída. Erros encontrados:", newErros);
        return newErros;
    };
   
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        console.log(`📝 Input alterado - ${name}:`, value);
        
        if (name === "contacto") {
            let somenteNumeros = value.replace(/\D/g, "");
            
            if (somenteNumeros.startsWith("244")) {
                somenteNumeros = somenteNumeros.slice(3);
            }
    
            const numeroFormatado = `244|${somenteNumeros.slice(0, 9)}`;
            console.log("📞 Contacto formatado:", numeroFormatado);
            setFormData((prev) => ({ ...prev, contacto: numeroFormatado }));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("🚀 INICIANDO PROCESSO DE CADASTRO");
        console.log("📋 Dados do formulário no submit:", formData);
        
        // Validar formulário
        const validationErrors = validateForm();
        setErros(validationErrors);
        
        console.log("🔍 Erros de validação:", validationErrors);
        
        // Verificar se há erros de validação (exceto erro geral)
        const hasValidationErrors = Object.keys(validationErrors).length > 0;
        console.log("❓ Tem erros de validação?", hasValidationErrors);
        
        // Verificar campos obrigatórios
        const camposObrigatorios = {
            nome: formData.nome.trim(),
            email: formData.email.trim(), 
            senha: formData.senha,
            confirmarSenha: formData.confirmarSenha,
            descricao: formData.descricao.trim()
        };
        
        console.log("📋 Campos obrigatórios:", camposObrigatorios);
        
        const camposFaltando = Object.entries(camposObrigatorios)
            .filter(([key, value]) => !value)
            .map(([key]) => key);
            
        console.log("❌ Campos faltando:", camposFaltando);

        if (hasValidationErrors || camposFaltando.length > 0) {
            const mensagemErro = "Por favor, corrija os erros antes de continuar.";
            console.log("🛑 PARANDO EXECUÇÃO - Erros encontrados:", mensagemErro);
            setErros(prev => ({ ...prev, geral: mensagemErro }));
            return;
        }

        console.log("✅ Validações OK - Prosseguindo com o cadastro");
        setErros({});
        setLoading(true);

        const contactoLimpo = formData.contacto.replace("244|", "");
        console.log("📞 Contacto limpo:", contactoLimpo);

        const dadosParaEnvio = {
            nome: formData.nome.trim(),
            email: formData.email.trim(),
            senha: formData.senha,
            descricao: formData.descricao.trim(),
            contacto: contactoLimpo, 
            tipo_usuario: tipoUsuario
        };
        
        console.log("📤 Dados que serão enviados para API:", dadosParaEnvio);

        try {
            console.log("🌐 Chamando API criarUsuario...");
            const resposta = await criarUsuario(dadosParaEnvio);

            console.log("✅ Usuário criado com sucesso:", resposta);
            setSucesso(true);
            
            setTimeout(() => {
                console.log("🔄 Redirecionando para página inicial...");
                router.push("/");
            }, 1000);
        } catch (error: any) {
            console.log("❌ ERRO ao criar conta:", error);
            console.log("❌ Tipo do erro:", typeof error);
            console.log("❌ Status do erro:", error?.status);
            console.log("❌ Mensagem do erro:", error?.message);
            
            if (error.status === 409) {
                setErros({ geral: error.message || "Este email já está em uso." });
            } else {
                setErros({ geral: error.message || "Erro ao criar conta. Por favor, tente novamente." });
            }
        } finally {
            console.log("🏁 Finalizando processo de cadastro");
            setLoading(false);
        }
    };
    
    React.useEffect(() => {
        if (sucesso) {
            console.log("🎉 Sucesso! Configurando redirecionamento...");
            const timer = setTimeout(() => {
                console.log("🔄 Executando redirecionamento...");
                router.push("/");
            }, 3000);
            
            return () => clearTimeout(timer);
        }
    }, [sucesso, router]);

    return (
        <main>
            <Head>
                <title>Cadastrar Comprador</title>
            </Head>
            <div className="p-6 text-center text-white bg-primary">
                <h1 className="text-[32px] font-bold">Cadastrar Comprador</h1>
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
                                    placeholder="9xxxxxxxx"
                                    onChange={handleInputChange}
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
                                        placeholder="xxxxxxxxxxxx"
                                        onChange={handleInputChange}
                                    />
                    
                                    <span 
                                        className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                                        onClick={() => setConfirmarSenhaVisivel(!confirmarSenhaVisível)}
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

                            {/* CAMPO DESCRIÇÃO QUE ESTAVA FALTANDO NO FORMULÁRIO! */}
                            <div className="mb-4">
                                <label htmlFor="descricao" className="mb-2 font-medium block text-profile">Descrição</label>
                                <textarea 
                                    id="descricao" 
                                    name="descricao"
                                    value={formData.descricao}
                                    className={`p-3 border-solid border-[1px] ${erros.descricao ? 'border-red-500' : 'hover:border-marieth border-tab'} w-[100%] text-base rounded-[5px] min-h-[100px]`}
                                    required 
                                    placeholder="Descreva um pouco sobre você..."
                                    onChange={handleInputChange}
                                />
                                {erros.descricao && <p className="text-red-500 text-sm mt-1">{erros.descricao}</p>}
                            </div>

                            {/* Mostrar erro geral se houver */}
                            {erros.geral && (
                                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                    {erros.geral}
                                </div>
                            )}
                    
                            <div className="flex justify-between">
                                <button 
                                    type="button" 
                                    onClick={() => router.back()}
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
                        </form>
                    )}
                </div>
            </div>
            <Footer />
        </main>
    );
}