
import Image from "next/image";
import Footer from "./Components/Footer";
import { FaApple, FaAppleAlt, FaCarrot, FaSeedling } from "react-icons/fa";
import { GiCabbage, GiSeedling } from "react-icons/gi";
import Link from "next/link";
import Navbar from "./Components/Navbar";
import { LuWheat } from "react-icons/lu";

export default function Home() {
  return (
    <div>
      <Navbar />

      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center 
    min-h-screen p-8 pb-20 gap-16 sm:p-20 mt-[16%] ">


        <div className="backgroundimage">
          <h1 className="text-[2rem] font-bold" > Conectando o Campo à sua Mesa  </h1>
          <p>Encontre produtos frescos direto dos produtores locais</p>
          <button className=" bg-marieth text-white py-4 px-8 text-[1.1rem] border-none rounded-[5px] cursor-pointers hover:bg-verdeaceso transition-colors duration-150">
            <Link href="./comecarcomprar " > Começar a Comprar </Link>
          </button>
        </div>

        <section className="max-w-[75rem] md:p-8 -mb-12  mt-24 ml:-mt-20">
          <h1 className=" text-center mb-4 text-2xl mt-0 font-bold md:mt[5rem] ">Categorias</h1>
          <div className="grid gap-6 grid-cols-2 md:grid-cols-5  ">
            <div className=" flex items-center justify-center bg-white p-6  rounded-[10px] hover:shadow-xl text-center cursor-pointer shadow-custom   hover:translate-y-2 " >
              <h3 className="  font-bold text-[1.17rem] mb-[0.5rem]" >        <Link href="./categoriafrutas"><FaAppleAlt className="mb-4 text-marieth text-[2.5rem] " />
                Frutas</Link>
              </h3>
            </div>
            <div className=" flex items-center justify-center bg-white p-6  rounded-[10px] hover:shadow-xl text-center cursor-pointer shadow-custom  hover:translate-y-2">
              <h3 className="  font-bold text-[18.72px]  mb-[0.5rem] " ><Link href="./categoriaverdura"> <GiCabbage className="mb-4 ml-4  text-marieth text-[2.5rem]" />
                Verduras </Link></h3>
            </div>

            <div className=" flex justify-center items-center bg-white p-6  rounded-[10px] hover:shadow-xl text-center cursor-pointer shadow-custom  hover:translate-y-2" >
              <h3 className="  font-bold text-[18.72px]  mb-[0.5rem]" >
                <Link href="./categoriainsumo"> <FaSeedling className="mb-4 ml-11  text-marieth text-[2.5rem]" /> Insumos Agrícolas  </Link>
              </h3>
            </div>


            <div className=" flex items-cente justify-center bg-white p-6  rounded-[10px] hover:shadow-xl text-center cursor-pointer shadow-custom  hover:translate-y-2">
              <h3 className="  font-bold text-[18.72px]  mb-[0.5rem]" >
                <Link href="./categoriagrao"><LuWheat className="mb-4 ml-4  text-marieth text-[2.5rem]" /> Grãos</Link>
              </h3>
            </div>
            <div className=" flex items-center justify-center bg-white p-6  rounded-[10px] hover:shadow-xl text-center cursor-pointer shadow-custom  hover:translate-y-2" >
              <h3 className="  font-bold text-[18.72px]  mb-[0.5rem]" >
                <Link href="./categoriatuberraiz"  ><FaCarrot className=" text-marieth mb-4 text-[2.5rem] ml-10" /> Tubérculos e Raízes</Link>
              </h3>
            </div>
          </div>
        </section>


        <h2 className="text-center text-2xl font-bold">Produtos em Destaque</h2>
        <section  >
          <div className="  p-8 max-w-[75rem]  grid grid-cols-2 md:grid-cols-5 gap-6  -mt-16" >
            <div className="rounded-[10px]  shadow-custom transition-transform duration-150 bg-white overflow-hidden hover:translate-y-[5px]"   >
              <Image src="/images/tomateorg.jpg" alt="ImagemProduto" height={200} width={380} className=" object-cover " />
              <div className="p-4">
                <h3 className="text[1.1rem] mb-[0.5rem] font-bold">Tomate</h3>
                <h3 className="text-[1.2rem] text-marieth font-bolds font-bold"> kz 350/unidade</h3>
                <h3 className="text-[0.9rem] text-cortexto"> Vendido por: Horta Feliz</h3>
              </div>
            </div>


            <div className="rounded-[10px]  shadow-custom transition-transform duration-150 bg-white overflow-hidden hover:translate-y-[5px]"   >
              <Image src="/images/hortaliciA.jpg" alt="ImagemProduto" height={200} width={380} className=" object-cover " />
              <div className="p-4">
                <h3 className="text[1.1rem] mb-[0.5rem] font-bold">hortalicia</h3>
                <h3 className="text-[1.2rem] text-marieth font-bolds font-bold"> kz 350/unidade</h3>
                <h3 className="text-[0.9rem] text-cortexto"> Vendido por: Horta Feliz</h3>
              </div>
            </div>

            <div className="rounded-[10px]  shadow-custom transition-transform duration-150 bg-white overflow-hidden hover:translate-y-[5px]"   >
              <Image src="/images/beringela.png" alt="Beringela" height={200} width={380} className=" object-cover " />
              <div className="p-4">
                <h3 className="text[1.1rem] mb-[0.5rem] font-bold">Beringela</h3>
                <h3 className="text-[1.2rem] text-marieth font-bolds font-bold"> kz 350/unidade</h3>
                <h3 className="text-[0.9rem] text-cortexto"> Vendido por: Horta Feliz</h3>
              </div>
            </div>


            <div className="rounded-[10px]  shadow-custom transition-transform duration-150 bg-white overflow-hidden hover:translate-y-[5px]"   >
              <Image src="/images/ananas.jpg" alt="ImagemProduto" height={200} width={380} className=" object-cover " />
              <div className="p-4">
                <h3 className="text[1.1rem] mb-[0.5rem] font-bold">Ananás</h3>
                <h3 className="text-[1.2rem] text-marieth font-bolds font-bold"> kz 350/unidade</h3>
                <p className="text-[0.9rem] text-cortexto"> Vendido por: Horta Feliz</p>
              </div>
            </div>



          </div>
        </section>





      </div>
      <Footer />
    </div>


  );
};
