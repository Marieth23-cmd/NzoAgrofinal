
import Image from "next/image"
import { AiFillBell, AiFillBilibili, AiFillHome, AiOutlineShoppingCart } from "react-icons/ai"
import { BiBarChartSquare } from "react-icons/bi"
import { HiOutlineArrowLeft } from "react-icons/hi2"
import { IoPersonCircleOutline } from "react-icons/io5"
import Link from "next/link"
import notificacoes from "../notificacoes/page"

export default function Navbar() {
    return (

        <nav className=" flex justify-between max-w-full -mt-[11rem]  bg-white p-4 shadow-sm top-0 sticky z-[100] ">

            <div className=" flex items-center max-w-[75rem]"  >
                <div className=" flex items-center gap-4 ">
                    <Image src="/images/nzoagro.png" alt="logotipo" width={50} height={50} />
                    <p className="text-2xl text-marieth font-bold">NzoAgro</p>
                </div >
            </div>

            <ul className="   ml-[33rem] gap-8 hidden lg:flex">
                <li className="  text-[1.2rem] cursor-pointer hover:text-marieth "> <Link href="./"> <AiFillHome className="gap-2 text-[1.4rem] ml-2  mt-[0.1rem]" /> <span>Inicio</span></Link> </li>
                <li className="  text-[1.2rem] cursor-pointer hover:text-marieth "> <Link href="./carrinho"> <AiOutlineShoppingCart className="gap-2 text-[1.4rem] ml-5 mt-[0.1rem] " />  <span className="hidden lg:block ">Carrinho</span> </Link></li>
                <li className=" text-[1.2rem] cursor-pointer hover:text-marieth "> <Link href="./notificacoes"><AiFillBell className="gap-2   text-[1.4rem] ml-7 mt-[0.1rem]" /> <span className="hidden lg:block">Notificações</span>   </Link></li>
                <li className="  text-[1.2rem] cursor-pointer hover:text-marieth "> <Link href="./relatoriocomprador"><BiBarChartSquare className="gap-2 ml-6 text-[1.4rem]  mt-[0.2rem]" /> Relatórios</Link></li>
                <li className="  text-[1.2rem] cursor-pointer hover:text-marieth "> <Link href="./perfilcomprador"><IoPersonCircleOutline className="gap-2  text-[1.4rem] ml-2  mt-[0.2rem]" />Perfil</Link> </li>

            </ul>





        </nav>
    )

}