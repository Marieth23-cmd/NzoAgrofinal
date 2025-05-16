import { GrAction } from "react-icons/gr";
import Footer from "../Components/Footer";
import { FaApple, FaAppleAlt, FaCarrot, FaSeedling } from "react-icons/fa";
import { GiCabbage } from "react-icons/gi";
import Navbar from "../Components/Navbar";
import Link from "next/link";
import Head from "next/head";

export default function ComecarComprar() { 
    return (
        <main className="min-h-screen flex flex-col">
            <Head>
                <title>Começar a Comprar</title>
            </Head>
            
            <Navbar />
            
            <div className="p-4 md:p-8 mb-8 mx-auto w-full max-w-[800px] mt-30 sm:mt-34 md:mt-28 lg:mt-15 flex-grow">
                <div className="text-center mb-8">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl mb-4 text-marieth font-bold">
                        Bem-vindo à NzoAgro!
                    </h1>
                    <p className="mb-6 text-base sm:text-lg md:text-xl text-profile">
                        Para começar suas compras, selecione uma categoria abaixo ou explore todos os 
                        nossos produtos disponíveis. Temos uma grande variedade de produtos agrícolas 
                        de alta qualidade esperando por você!
                    </p>
                    <Link href="./TodosProdutos">
                        <span className="bg-marieth text-white py-3 px-6 border-none rounded-md
                            text-base md:text-lg cursor-pointer inline-block hover:bg-verdeaceso 
                            transition-colors duration-150">
                            Ver Todos os Produtos
                        </span>
                    </Link>
                </div>

                {/* Grid de categorias melhorado */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mt-8">
                    {/* Card 1 - Fruta */}
                    <div className="w-full">
                        <Link href="./categoriafrutas">
                            <div className="flex flex-col items-center justify-center rounded-lg p-6 
                                cursor-pointer shadow-custom bg-branco transition-transform duration-150 
                                ease-in-out hover:translate-y-1 h-full">
                                <FaAppleAlt className="text-marieth text-4xl md:text-5xl mb-2" />
                                <h2 className="font-bold text-base md:text-lg text-profile">Fruta</h2>
                            </div>
                        </Link>
                    </div>

                    {/* Card 2 - Verduras */}
                    <div className="w-full">
                        <Link href="./categoriaverdura">
                            <div className="flex flex-col items-center justify-center rounded-lg p-6 
                                cursor-pointer shadow-custom bg-branco transition-transform duration-150 
                                ease-in-out hover:translate-y-1 h-full">
                                <GiCabbage className="text-marieth text-4xl md:text-5xl mb-2" />
                                <h2 className="font-bold text-base md:text-lg text-profile">Verduras</h2>
                            </div>
                        </Link>
                    </div>

                    {/* Card 3 - Insumos Agrícolas */}
                    <div className="w-full">
                        <Link href="./categoriainsumo">
                            <div className="flex flex-col items-center justify-center rounded-lg p-6 
                                cursor-pointer shadow-custom bg-branco transition-transform duration-150 
                                ease-in-out hover:translate-y-1 h-full">
                                <FaSeedling className="text-marieth text-4xl md:text-5xl mb-2" />
                                <h2 className="font-bold text-base md:text-lg text-profile">Insumos Agrícolas</h2>
                            </div>
                        </Link>
                    </div>

                    {/* Card 4 - Tubérculos e Raízes */}
                    <div className="w-full">
                        <Link href="./categoriatuberraiz">
                            <div className="flex flex-col items-center justify-center rounded-lg p-6 
                                cursor-pointer shadow-custom bg-branco transition-transform duration-150 
                                ease-in-out hover:translate-y-1 h-full">
                                <FaCarrot className="text-marieth text-4xl md:text-5xl mb-2" />
                                <h2 className="font-bold text-base md:text-lg text-profile">Tubérculos e Raízes</h2>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}