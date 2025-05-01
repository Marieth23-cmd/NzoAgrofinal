import Link from "next/link"
 
 export default function Footer(){

    return(
        
          
            <footer className="text-white p-8 -mt-16 bg-profile ">

                <div className=" grid gap-8   grid-cols-2 md:grid-cols-3 max-w-[75rem] ">
                 
                  <div>
                    <h3 className="mb-4 text-verdeaceso text-[1.17rem] font-bold">Sobre Nós</h3>
                    <p>Conectando agricultores , fornecedores e compradores em uma plataforma única e eficiente.</p>
                </div>
                
                
                <div>
        <h3 className="mb-4 text-verdeaceso font-bold  text-[1.17rem] ">Links Úteis</h3>
        <ul>
        <li className="my-2 mx-0" > <a className="text-white cursor-pointer "  href="">Ajuda</a></li>
          <li className="my-2 mx-0" > <a className="text-white cursor-pointer "  href="">Sobre</a></li>
          <li className="my-2 mx-0"> <Link  className="text-white cursor-pointer " href="./termosuso">Termos de Uso</Link></li>
          <li className="my-2 mx-0"> <Link className="text-white cursor-pointer "  href="./PoliticaPrivacidade">Política de Privacidade</Link></li>
        </ul>
      </div>

      <div >
        <h3 className="mb-4 text-verdeaceso text-[1.17rem] font-bold">Contato</h3>
        <ul>
          <li> <a className="text-white cursor-pointer "  href="mailto:nzoagro@gmail.com">Email:<span className="text-blue-500"> [nzoagroorg@gmail.com]</span> </a></li>
          <li> <a href="https://wa.me/937-828-846">Whatsapp :(244)937-828-846 </a></li>
          <li>Endereço: Luanda, Talatona , Bairro Sapú</li>
        </ul>
       
      </div>
    
 
              </div>
<p className="text-white text-center pt-6 mt-4 lg:pt-4 border-t-[1px] border-solid border-gray-600 ">&copy; 2025 Nzoagro. Todos os direitos reservados.</p>
                


                </footer> 
            
       



    )
 }