import  Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";


export default function Politica(){
    return(

        <div>
            <Navbar/>
            <head>
                <title>Termos de Uso</title>
            </head>
            <div className="flex flex-col mb-20 gap-2 mt-[15%] max-w-[1200px] shadow-custom p-8 ml-0  rounded-[10px] lg:ml-8">

           
                <h1 className="text-[2rem] text-center text-marieth font-bold mb-8">Termos de Uso</h1>

                <h3 className=" text-[1.5rem] mb-4  font-bold text-marieth">1. Aceitação dos Termos</h3>
            <p className="text-profile" >Ao acessar e utilizar a plataforma <span className="font-bold">NzoAgro</span> , o usuário concorda com os presentes Termos de Uso. Caso não esteja de acordo com
                 qualquer parte deste documento, não deve utilizar a plataforma.</p>

            

            <h3 className=" text-[1.5rem] mb-4 font-bold text-marieth">2. Cadastro e Responsabilidades do Usuário</h3>
           
            <p className="text-profile" > 2.1 O usuário deve fornecer informações verídicas e atualizadas no momento do cadastro. </p>
            <p className="text-profile" > É proibido criar múltiplas contas para burlar regras ou restrições do sistema.

</p>
                <p className="text-profile" > 2.2 O usuário é responsável por todas as atividades realizadas em sua conta.</p>
                     <p className="text-profile" >  2.3 Não é permitido compartilhar credenciais de acesso (login e senha) com terceiros.</p>


            <h3 className=" text-[1.5rem] mb-4  font-bold text-marieth">3. Uso da Plataforma</h3>
            <p className="text-profile" > 3.1 O <span className="font-bold">NzoAgro</span> conecta agricultores, fornecedores, 
                compradores e transportadores , 
                permitindo a comercialização de produtos agrícolas e insumos.</p>
            <p className="text-profile" > 3.2 O usuário deve utilizar a plataforma somente para fins legais e de acordo com a legislação vigente</p>
            <p className="text-profile" > 3.3 É proibido cadastrar produtos inadequados , falsificados, vencidos ou que violem normas sanitárias e comerciais</p>
            <p className="text-profile" > 3.4 Se um usuário tentar cadastrar um produto inadequado , sua conta poderá ser restrita ou suspensa imediatamente .</p>
            <p className="text-profile" > 3.5 Em caso de reincidência ou tentativa de fraude, o <span className="font-bold">NzoAgro</span> poderá banir permanentemente a conta do usuário.</p>
            


        <h3 className=" text-[1.5rem] mb-4  font-bold text-marieth">4. Compras e Pagamentos</h3>

        <p className="text-profile" >4.1 As transações realizadas na plataforma devem seguir os métodos de pagamento 
            aceitos (ex: Unitel Money ,  multicaixaexpress e Afrimoney ).</p>
        <p className="text-profile"  > 4.2 O <span className="font-bold">NzoAgro</span> não se responsabiliza por transações realizadas fora da plataforma.</p>
        <p className="text-profile" > 4.3 Em caso de não retirada do produto , o comprador deverá entrar em contato com o vendedor e, se necessário,
             com o suporte da plataforma.</p>
        
       
        <h3 className=" text-[1.5rem] mb-4  font-bold text-marieth">5. Entregas e Transporte</h3>

        <p className="text-profile" >5.1 Os transportadores cadastrados no <span className="font-bold">NzoAgro</span>  são responsáveis 
            pelas entregas e devem cumprir os prazos estabelecidos.</p>
        <p className="text-profile" >5.2 O comprador deverá fornecer um endereço válido para a entrega dos produtos.</p>
        <p className="text-profile" >5.3 Em caso de problemas na entrega, o usuário poderá 
            solicitar suporte da plataforma.</p>
       
            <h3 className=" text-[1.5rem] mb-4  font-bold text-marieth">6. Penalidades e Restrição de Conta	</h3>
            <p className="text-profile"> 6.1 O descumprimento dos Termos de Uso pode levar a advertências, restrições de funcionalidades ou suspensão de conta  </p>   
         <p className=" text-profile mb-4"> 6.2 Em casos graves, como fraude, cadastro de produtos 
            proibidos ou uso indevido da plataforma , 
            o <span className="font-bold"> 6.3 NzoAgro</span> poderá banir permanentemente o usuário.</p>
            <p className=" text-profile mb-4"> 6.4 A plataforma reserva o direito de tomar medidas legais 
                contra usuários que violem a legislação vigente.</p>


        <h3 className=" text-[1.5rem] mb-4  font-bold text-marieth">7. Alterações nos Termos de Uso</h3>
        <p className="text-profile">O <span className="font-bold">NzoAgro</span> pode atualizar os Termos de Uso a qualquer momento. 
            As alterações serão notificadas aos usuários e continuem a utilizar 
            a plataforma implica na acessibilidade dos novos termos.</p>
        
           
                <h3 className=" text-[1.5rem] mb-4  font-bold text-marieth">8. Contato</h3>
                <p className="text-profile mb-4"> Para dúvidas, suporte ou denúncias, entre em contato pelo e-mail 
          <a className="text-white cursor-pointer "  href="mailto:nzoagro@gmail.com"><span className="text-marieth">nzoagro@gmail.com</span></a>
                </p>
                




















            </div>


















            <Footer/>

        </div>





    )
}