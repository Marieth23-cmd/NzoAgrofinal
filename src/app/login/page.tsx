 import Image from "next/image"
 
 export default function login (){
    return(
        <main className=" flex flex-col justify-center items-center mt-6">

         
            
            <div className=" bg-white p-8 w-full rounded-[15px] max-w-[400px] m-5 shadow-custom">
            <div className="  flex  mb-8 items-center  justify-center relative">
            <Image  src="/images/nzoagro.png" alt="logotipo" width={150} height={150} />
        
        </div>
 <div className=" mb-6">
    
    <label htmlFor="Email" className=" font-medium mb-2 block text-profile "  >E-mail
    <input type="email" name="Email" className="w-full p-[0.8rem] rounded-[5px] box-border text-base border-[1px] 
    border-solid border-tab" required   />
      </label>
       </div>
       
       <div  className=" mb-6">
    <label htmlFor="Senha"  className=" font-medium mb-2 block text-profile " >Senha
    <input type="password" name="Senha" className="w-full p-[0.8rem] rounded-[5px] box-border text-base 
    border-[1px] border-solid border-tab  " required/>
      </label>
       </div>

       <div>
            <button  className="bg-marieth text-white p-4  border-none rounded-[5px] 
            cursor-pointer font-semibold text-base w-full hover:bg-verdeaceso">Entrar</button>
            <p className="mt-4 text-center text-marieth">Esqueceu a Senha?</p>
           <p className="mt-4 text-center" > Não tem uma conta? <a href="./select" className="text-marieth">Cadastra-se</a>  </p>
       </div>
       
       </div>
        </main>
    )
 }