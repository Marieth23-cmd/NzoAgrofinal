"use client"
import { useState } from "react"
import Head from "next/head"
import { FaTrash } from "react-icons/fa6"
import Footer from "../Components/Footer"
import Navbar from "../Components/Navbar"
import Image from "next/image"



  export default function categoriainsumo(){


    const [showcaixa , setshowcaixa] =useState(false)
     return(

        <div >
       
         <Head>
                <title> Carrinho </title>
            </Head>
            <Navbar/>

       <div  className="mb-20  mt-[18%]">

<div className="max-w-[1200px] my-8 mx-auto py-0 px-4  items-center gap-4 grid grid-cols-1 
relative border-b-[1px]">

     <h1 className="text-[2rem] font-bold mb-8 text-marieth">Meu Carrinho</h1>

     <div className="flex  p-2 border-b-[1px]">
      <Image src= "/images/tomateorg.jpg" alt="ImagemProduto" height={100} width={100} className="object-cover rounded-[5px]"  />
     <div className="flex-1 py-0 px-4 ">
     <h3  className="font-bold mb-2">Legumes</h3>
      <p  className=" font-bold text-marieth -mb-6">Kzs 5000/<span>1</span>tonelada</p>
          <FaTrash className=" ml-[60rem] mb-2 border-none bg-none text-vermelho text-[1.2rem] cursor-pointer"/>
         <button className=" hover:bg-verdeaceso bg-marieth rounded-[5px] cursor-pointer text-white p-2 text-[0.9rem] 
          border-none bottom-4  " onClick={()=>setshowcaixa(true)}>+ Adicionar mais</button> 
          
      </div>
       </div> 

       
       <div className="flex  p-2 border-b-[1px]">
      <Image src= "/images/tomateorg.jpg" alt="ImagemProduto" height={100} width={100} className="object-cover rounded-[5px]"  />
     <div className="flex-1 py-0 px-4 ">
     <h3  className="font-bold mb-2">Legumes</h3>
      <p  className=" font-bold text-marieth -mb-6">Kzs 5000/<span>1</span>tonelada</p>
          <FaTrash className=" ml-[60rem] mb-2 border-none bg-none text-vermelho text-[1.2rem] cursor-pointer"/>
         <button className=" hover:bg-verdeaceso bg-marieth rounded-[5px] cursor-pointer text-white p-2 text-[0.9rem] 
          border-none bottom-4  " onClick={()=>setshowcaixa(true)}>+ Adicionar mais</button> 
          
      </div>
       </div> 
       <div className="flex  p-2 border-b-[1px]">
      <Image src= "/images/tomateorg.jpg" alt="ImagemProduto" height={100} width={100} className="object-cover rounded-[5px]"  />
     <div className="flex-1 py-0 px-4 ">
     <h3  className="font-bold mb-2">Legumes</h3>
      <p  className=" font-bold text-marieth -mb-6">Kzs 5000/<span>1</span>tonelada</p>
          <FaTrash className=" ml-[60rem] mb-2 border-none bg-none text-vermelho text-[1.2rem] cursor-pointer"/>
         <button className=" hover:bg-verdeaceso bg-marieth rounded-[5px] cursor-pointer text-white p-2 text-[0.9rem] 
          border-none bottom-4  " onClick={()=>setshowcaixa(true)} >+ Adicionar mais</button> 
          
      </div>
       </div>
       
       <div className="flex  p-2 border-b-[1px]">
      <Image src= "/images/tomateorg.jpg" alt="ImagemProduto" height={100} width={100} className="object-cover rounded-[5px]"  />
     <div className="flex-1 py-0 px-4 ">
     <h3  className="font-bold mb-2">Legumes</h3>
      <p  className=" font-bold text-marieth -mb-6">Kzs 5000/<span>1</span>tonelada</p>
          <FaTrash className=" ml-[60rem] mb-2 border-none bg-none text-vermelho text-[1.2rem] cursor-pointer"/>
         <button className=" hover:bg-verdeaceso bg-marieth rounded-[5px] cursor-pointer text-white p-2 text-[0.9rem] 
          border-none bottom-4  "  onClick={ ()=>setshowcaixa(true)}>+ Adicionar mais</button> 
          
      </div>
       </div> 


       
       <div className="flex  p-2 border-b-[1px]">
      <Image src= "/images/tomateorg.jpg" alt="ImagemProduto" height={100} width={100} className="object-cover rounded-[5px]"  />
     <div className="flex-1 py-0 px-4 ">
     <h3  className="font-bold mb-2">Legumes</h3>
      <p  className=" font-bold text-marieth -mb-6">Kzs 5000/<span>1</span>tonelada</p>
          <FaTrash className=" ml-[60rem] mb-2 border-none bg-none text-vermelho text-[1.2rem] cursor-pointer "/>
         <button className=" hover:bg-verdeaceso bg-marieth rounded-[5px] cursor-pointer  text-white p-2 text-[0.9rem] 
          border-none bottom-4" onClick={()=>setshowcaixa(true)} >+ Adicionar mais</button> 
      </div>
       </div> 

      
      
    
     
      <div className=" mt-8 p-4 bg-white rounded-[10px] shadow-custom"  >
        <div className="flex justify-between border-b-[1px] border-solid border-tab py-2 px-0  " >
          <span >Subtotal:</span>
          <span>kzs 409,70</span>
        </div>

        <div className="flex justify-between border-b-[1px] border-solid border-tab py-2 px-0 " >
          <span>Transporte:</span>
          <span>kzs 25,00</span>
        </div>

        <div  className="flex justify-between border-b-[1px] border-solid mt-[1rem] border-tab py-2 px-0 ">
          <span className="text-marieth text-[1.2rem] font-bold ">Total:</span>
          <span>kzs 434,70</span>
        </div>
        
        <button  className=" transition-all hover:bg-verdeaceso text-[1.1rem] mt-4 block w-full p-4 bg-marieth
         text-white border-none rounded-[5px] cursor-pointer">Finalizar Compra</button>
      </div>

           </div  >   

           { showcaixa &&(<div className="flex items-center  " >
        <div className="top-[40%] left-[40%] min-w-[300px] bg-white shadow-custom rounded-[10px] p-8 absolute " >
          <h2 className="font-bold text-2xl mb-4">Alterar Quantidade</h2>
          <div></div>
            <div className=" mb-4 gap-2 grid grid-cols-2">
            <button data-value="0.5" className="p-2 bg-marieth rounded-[5px] border-nonr cursor-pointer text-white text-[0.9rem] hover:bg-verdeaceso">+0.5</button>
            <button data-value="1"  className="p-2 bg-marieth rounded-[5px] border-nonr cursor-pointer text-white text-[0.9rem] hover:bg-verdeaceso">+1</button>
            <button data-value="5"  className="p-2 bg-marieth rounded-[5px] border-nonr cursor-pointer text-white text-[0.9rem] hover:bg-verdeaceso">+5</button>
            <button data-value="10"  className="p-2 bg-marieth rounded-[5px] border-nonr cursor-pointer text-white text-[0.9rem] hover:bg-verdeaceso">+10</button>
            </div>
          <div className="flex flex-col gap-4 my-4 mx-0">
             <label htmlFor="number">Ajustar
    <input type="number" name="numero" min={0}  step={0.1} className="text-4 p-2 border-[1px] border-solid border-tab rounded-[5px]" />
     </label> 

     <label htmlFor="verduras">
      <select title="verduras" className="text-4 p-2 border-[1px] border-solid border-tab rounded-[5px]" >
        <option value="Toneladas">Toneladas</option>
        <option value="Quintais">Quintais</option>
        </select>
        </label>
       </div>

       <div  className=" flex gap-4 justify-end cursor-pointer  border-none ">
        <button className="bg-vermelho py-2 px-4 text-white rounded-[5px]" onClick={()=>setshowcaixa(false)}>Cancelar</button>
        <button className= " bg-marieth py-2 px-4 text-white rounded-[5px]">Confirmar</button>
      </div>
        </div>

       </div>)} 
        

     
     </div>
      <Footer/>
    </div>
    
    )
    }