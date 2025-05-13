"use client";
import { useState } from "react";
import Image from "next/image";
import { login } from "../Services/auth";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [senhaVisivel, setSenhaVisivel] = useState(false);
    const [erro, setErro] = useState("");
    
    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => 
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setter(e.target.value);
            setErro(""); // Limpa o erro quando o usuário modifica os campos
        };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !senha) {
            setErro("Preencha todos os campos.");
            return;
        }

        try {
            const response = await login(email, senha);
            console.log("Usuário logado:", response);
            
            // Verifica o tipo de usuário e redireciona adequadamente
            if (response.tipo_usuario?.trim() === "Administrador") {
                toast.success("Login realizado com sucesso! Redirecionando para área administrativa...");
                // Importante: espere o toast ser exibido antes de 
                setTimeout(() => {
                    router.push("/Administrador");
                }, 1000);
            } else {
                toast.success("Login realizado com sucesso! Bem-vindo(a) de volta!");
                setTimeout(() => {
                    router.push("/");
                }, 1000);
            }
            
            setErro(""); 
          
        } catch (error: any) {
            console.error("Erro de login:", error);
            setErro(error.message || "Erro ao Iniciar Sessão!");
            toast.error("Erro ao iniciar sessão. Tente novamente!");
        }
    };

    return (
        <main className="flex flex-col justify-center mt-28 items-center lg:mt-20">
            {/* ToastContainer deve estar dentro do return */}
            <ToastContainer position="top-right" autoClose={5000} />
            
            <div className="bg-white p-8 w-full rounded-lg max-w-[400px] m-4 shadow-lg">
                <div className="flex mb-8 items-center justify-center">
                    <Image src="/images/logo.jpg" alt="logotipo" width={150} height={150} />
                </div>

                <form onSubmit={handleLogin}>
                    <div className="mb-6">
                        <label htmlFor="email" className="font-medium mb-2 block text-profile">
                            E-mail
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="w-full p-3 rounded border border-gray-300"
                                required
                                value={email}
                                onChange={handleInputChange(setEmail)}
                            />
                        </label>
                    </div>

                    <div className="mb-6 relative">
                        <label htmlFor="senha" className="font-medium mb-2 block text-profile">
                            Senha
                            <div className="relative">
                                <input
                                    type={senhaVisivel ? "text" : "password"}
                                    id="senha"
                                    name="senha"
                                    className="w-full p-3 rounded border border-gray-300 pr-10"
                                    required
                                    value={senha}
                                    onChange={handleInputChange(setSenha)}
                                />
                                <span 
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                                    onClick={() => setSenhaVisivel(!senhaVisivel)}
                                >
                                    {senhaVisivel ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                </span>
                            </div>
                        </label>
                    </div>

                    {erro && <p className="text-red-500 text-sm mb-4">{erro}</p>}

                    <button
                        type="submit"
                        className="bg-green-600 text-white p-3 rounded w-full hover:bg-green-700"
                    >
                        Entrar
                    </button>
                </form>

                <p className="mt-4 text-center text-gray-600">Esqueceu a Senha?</p>
                <p className="mt-4 text-center">
                    Não tem uma conta? <a href="./Seleccionar" className="text-green-600">Cadastra-se</a>
                </p>
            </div>
        </main>
    );
}