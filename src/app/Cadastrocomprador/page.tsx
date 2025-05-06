"use client"
import Head from "next/head"
import Footer from "../Components/Footer"
import React, { useState } from "react"
import { useRouter } from "next/navigation";
import { criarUsuario } from "../Services/user"
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function CadastroComprador() {
    const [tipoUsuario] = useState("Comprador"); 
    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        senha: "",
        confirmarSenha:"",
        descricao: "",
        contacto: "244|",
    });
     const [senhaVisivel,setSenhaVisivel]=useState(false)
     const [ConfirmarsenhaVisivel,setConfirmarsenhaVisivel]=useState(false)
    const [erros, setErros] = useState<{ confirmarSenha?: string;
         geral?: string ; contacto?:string }>({});
    const router = useRouter();
    

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> ) => {
        const { name, value } = e.target;
            

           
    
        if (name === "contacto") {
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
    
    
   
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // setErros({});
    
        if (formData.senha !== formData.confirmarSenha) {
            setErros({ confirmarSenha: "As senhas não coincidem." });
            return;
        }
    
    console.log("Dados do formulário:", formData);

        try {
           const resposta = await criarUsuario({
             nome: formData.nome,
                email: formData.email,
                senha: formData.senha,
                descricao: formData.descricao,
                contacto: formData.contacto.replace("244|", ""),
                tipo_usuario: tipoUsuario
            });
    
            console.log("Usuário criado com sucesso:", resposta);
          alert("Conta criada com Sucesso. Bem-vindo(a) à NzoAgro");
            setTimeout(() => {
                router.push("/");
            }, 50)
         } catch (error: any) {
            console.log("Erro ao criar conta",error.message);
            if (error?.response.data.campo==="contacto") {
                
                setErros({contacto:error.response.data.mensagem})
            } else {
                setErros({geral:error.response?.data?.mensagem || "Erro ao criar conta"})
            }
        } 
      };

    return (
        <main>
            <Head>
                <title>Cadastrar Comprador</title>
            </Head>
            <div className="p-6 text-center text-white bg-primary">
                <h1 className="text-[32px] font-bold">Cadastrar Comprador</h1>
            </div>
            <div className="mb-20 mt-10"> 
                <div className="bg-white rounded-[10px] p-8 w-full max-w-[800px] lg:ml-[20%] shadow-custom">
                    <div className="mx-32"></div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4 gap-2">
                            <label htmlFor="nome" className="mb-2 font-medium block text-profile"> Nome Completo</label>
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
                            <label htmlFor="email" className="mb-2 font-medium block text-profile"> Email</label>
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
                            <label htmlFor="contacto" className="mb-2 font-medium block text-profile"> Telefone </label>
                            <input 
                                type="tel" 
                                id="contacto" 
                                name="contacto"
                                value={formData.contacto}
                                className="p-3 border-solid border-[1px] hover:border-marieth border-tab w-[100%] text-base rounded-[5px]" 
                                required 


                                onChange={handleInputChange}
                                     />
                                     {erros.contacto && <p className="text-vermelho text-sm"></p>}
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
        <label htmlFor="confirmarsenha" className="mb-2 font-medium block text-profile">
            Confirmar Senha
        </label>

        <div className="relative">
            <input 
            type={ConfirmarsenhaVisivel ? "text" : "password"} 
            id="confirmarSenha" 
            name="confirmarSenha"
            value={formData.confirmarSenha}
            className="p-3 pr-10 border border-tab hover:border-marieth w-full text-base rounded-[5px]"  
            required
            onChange={handleInputChange}
            />

            <span 
            className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
            onClick={() => setConfirmarsenhaVisivel(!ConfirmarsenhaVisivel)}
            >
            {ConfirmarsenhaVisivel ? (
                <FiEyeOff className="w-5 h-5" />
            ) : (
                <FiEye className="w-5 h-5" />
            )}
            </span>
        </div>
        </div>


                        <div className="mb-4">
                            <label htmlFor="descricao" className="mb-2 font-medium block text-profile"> Descrição (Opcional) </label>
                            <textarea 
                                id="descricao" 
                                name="descricao"
                                value={formData.descricao}
                                className="p-3 border-solid border-[1px] hover:border-marieth resize-y min-h-[80px] border-tab w-[100%] text-base rounded-[5px]"  
                                onChange={handleInputChange}>
                           </textarea >
                        </div>

                        {erros.geral && <p className="text-red-500 text-sm mb-4">{erros.geral}</p>}

                        <div className="flex justify-between">
                            <button 
                                type="button" onClick={()=>router.push("/Seleccionar")} 
                                className="border-marieth border-[1px] bg-transparent py-[0.8rem] font-medium cursor-pointer rounded-[5px] text-base transition-all duration- ease-in-out px-8 text-marieth"
                            >
                                Voltar
                            </button>

                            <button 
                                type="submit"
                                className="bg-marieth text-white py-[0.8rem] border-none font-medium cursor-pointer rounded-[5px] text-base transition-all duration- ease-in-out px-8 hover:bg-verdeaceso"
                            >
                                Cadastrar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </main>
    );
}
