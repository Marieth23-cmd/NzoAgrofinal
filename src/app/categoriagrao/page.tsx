import { BiSearch } from "react-icons/bi"
import Footer from "../Components/Footer"
import Navbar from "../Components/Navbar"
import Image from "next/image"
import Head from "next/head"

  export default function Categoriagrao(){
     return(

        <main >
       
         <Head>
                <title> Categoria </title>
            </Head>
            <Navbar/>

        
            
       <div  className="mb-20  mt-[18%]">
<h1 className="text-center my-6  mx-0 text-[2rem] font-bold text-marieth" >Grãos</h1>

      <div className=" max-w-[1200px] my-12 mx-9 py-0 px-4 " >

<div className=" gap-4  grid grid-cols-3 ">
      
       
  
      <label htmlFor="graos"  className="mb-[0.5rem] font-medium block" > Tipo de Grão
      <div className="p-4  shadow-custom  bg-white rounded-[10px] "  >
         <select id="graos" className="w-full p-[0.8rem] rounded-[5px] text-base border-[1px] border-solid border-tab">
        <option value="">Todos os tipos</option>
        <option value="Milho">Milho</option>
        <option value="Soja">Soja</option>
        <option value="Trigo">Trigo</option>
        <option value="Ervilhas">Ervilhas</option>
        <option value="Feijão">Feijão</option>
        <option value="Lentilhas">Lentilhas</option>
        
        
        
      </select>
      </div>
      </label>
    


         <label htmlFor="local"  className="mb-[0.5rem] font-medium block " > Província
       <div  className="p-4  shadow-custom  bg-white rounded-[10px]">
        <select id="local " className="w-full p-[0.8rem] rounded-[5px] text-base border-[1px] border-solid border-tab">
          <option value="">Todas as províncias</option>
          <option value="Luanda">Luanda</option>
          <option value="Benguela">Benguela</option>
          <option value="huambo">Huambo</option>
          <option value="Huila">Huíla</option>
          <option value="Malanje">Malanje</option>
          <option value="Namibe">Namibe</option>
          <option value="Bengo">Bengo</option>
          <option value="Lunda-Sul">Lunda-Sul</option>
        </select>
      </div>
      </label>

     <label htmlFor="intrvalo-preco" className="mb-[0.5rem] font-medium block "   >   Faixa de Preço (AOA)
      <div className="p-4  shadow-custom  bg-white rounded-[10px]" >
        <select id="intrvalo-preco" className="w-full p-[0.8rem] rounded-[5px] text-base border-[1px] border-solid border-tab">
          <option value="">Todas as faixas</option>
          <option value="0-2000">Até 2.000 AOA</option>
          <option value="2000-5000">2.000 - 5.000 AOA</option>
          <option value="5000-10000">5.000 - 10.000 AOA</option>
          <option value="10000-plus">Acima de 10.000 AOA</option>
        </select>
       
      </div>
       </label>


       

    </div>
       
       <button  className=" flex border-none text-white bg-marieth hover:bg-verdeaceso py-[0.8rem] px-6 rounded-[5px] text-base items-center
       cursor-pointer gap-2 my-4 mx-auto transition-transform"> <BiSearch className=" text-[1.1rem]"/>Pesquisar</button>

      </div>


      <section>

         <div className="  p-8 max-w-[1200px]  flex flex-row gap-6  -mt-16 ml-6" > 
               <div className="rounded-[10px]  shadow-custom transition-transform duration-150 bg-white overflow-hidden hover:translate-y-[5px]"   >
               <Image src= "/images/tomateorg.jpg" alt="ImagemProduto" height={200} width={380} className=" object-cover " />
               <div  className="p-4">
                 <h3 className="text[1.1rem] mb-[0.5rem] font-bold">Tomate</h3>
                 <h3  className="text-[1.2rem] text-marieth font-bolds font-bold"> kz 350/unidade</h3>
                 <h3  className="text-[0.9rem] text-cortexto"> Vendido por: Horta Feliz</h3>
               </div>
         </div>
        

          <div className="rounded-[10px]  shadow-custom transition-transform duration-150
           bg-white overflow-hidden hover:translate-y-[5px]"   >
               <Image src= "/images/beringela.png" alt="ImagemProduto" height={200} width={380} className=" object-cover " />
               <div  className="p-4">
                 <h3 className="text[1.1rem] mb-[0.5rem] font-bold">Beringela</h3>
                 <h3  className="text-[1.2rem] text-marieth font-bolds font-bold"> kz 350/unidade</h3>
                 <h3  className="text-[0.9rem] text-cortexto"> Vendido por: Horta Feliz</h3>
               </div>     
         </div>
         
         <div className="rounded-[10px]  shadow-custom transition-transform duration-150 bg-white overflow-hidden hover:translate-y-[5px]"   >
               <Image src= "/images/hortaliciA.jpg" alt="ImagemProduto" height={200} width={380} className=" object-cover " />
               <div  className="p-4">
                 <h3 className="text[1.1rem] mb-[0.5rem] font-bold">hortalicia</h3>
                 <h3  className="text-[1.2rem] text-marieth font-bolds font-bold"> kz 350/unidade</h3>
                 <h3  className="text-[0.9rem] text-cortexto"> Vendido por: Horta Feliz</h3>
               </div>     
         </div>
         <div className="rounded-[10px]  shadow-custom transition-transform duration-150 bg-white overflow-hidden hover:translate-y-[5px]"   >
               <Image src= "/images/hortaliciA.jpg" alt="ImagemProduto" height={200} width={380} className=" object-cover " />
               <div  className="p-4">
                 <h3 className="text[1.1rem] mb-[0.5rem] font-bold">hortalicia</h3>
                 <h3  className="text-[1.2rem] text-marieth font-bolds font-bold"> kz 350/unidade</h3>
                 <h3  className="text-[0.9rem] text-cortexto"> Vendido por: Horta Feliz</h3>
               </div>     
         </div>
          </div>
      </section>






      </div>
      <Footer/>
    </main>
    
    )
    }