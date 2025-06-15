"use client"
import Head from "next/head"
import Footer from "../Components/Footer"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation";
import { criarUsuario } from "../Services/user"
import { FiEye, FiEyeOff } from "react-icons/fi";


export default function CadastroAgricultodor() {
    const [tipoUsuario] = useState("Agricultor"); 
     const [etapa, setEtapa] = useState(1);
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
            descricao: formData.descricao.trim(),
             rua:formData.rua.trim(),
            bairro:formData.bairro.trim(),
            municipio:formData.municipio,
            provincia:formData.provincia,

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
            tipo_usuario: tipoUsuario,
             rua:formData.rua.trim(),
            bairro:formData.bairro.trim(),
            municipio:formData.municipio,
            provincia:formData.provincia,
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
                <title>Cadastrar Agricultor</title>
            </Head>
            <div className="p-6 text-center text-white bg-primary">
                <h1 className="text-[32px] font-bold">Cadastrar Agricultor</h1>
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
                                        <label htmlFor="descricao" className="mb-2 font-medium block text-profile">Descreve as Principais culturas</label>
                                        <textarea 
                                            id="descricao" 
                                            name="descricao"
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
                                            required 
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