import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Head from "next/head"


export default function Politica(){
    return(

        <div>
            
            <Head>
                <title>Politica de Privacidade</title>
            </Head>
            <Navbar/>
            <div className="flex flex-col mb-20 gap-2 mt-[15%] max-w-[1200px] shadow-custom p-8 ml-0 rounded-[10px] lg:ml-8">

           
                <h1 className="text-[2rem] text-center text-marieth font-bold mb-8">Politica de Privacidade</h1>

                <h3 className=" text-[1.5rem] mb-4  font-bold text-marieth">1. Introdução</h3>
            <p className="text-profile" >A plataforma  <span className="font-bold">NzoAgro</span> respeita a privacidade de seus usuários e se compromete a proteger todas as
                 informações fornecidas. Esta Política de Privacidade explica como coletamos, usamos, 
                 armazenamos e compartilhamos suas informações ao utilizar nossa plataforma.</p>

            <p  className=" mb-4">Ao acessar e usar o <span className="font-bold">NzoAgro</span> , você concorda com os termos desta política.</p>

            <h3 className=" text-[1.5rem] mb-4 font-bold text-marieth">2. Coleta de Dados Pessoais</h3>
            <p className="text-profile" > Coletamos as seguintes informações pessoais quando você se cadastra, 
                usa ou interage com a plataforma:</p>
            <p className="text-profile" >2.1 Dados de identificação : Nome, e-mail, número de telefone, endereço de entrega. </p>
            <p className="text-profile" > 2.2 Dados financeiros : Informações de pagamento, como contas bancárias e pagamentos móveis 
                ( Unitel Money, Afrimoney e multicaixaexpress).</p>
                <p className="text-profile" >2.3 Dados de transações : Compras e vendas realizadas na plataforma,
                     produtos adquiridos ou vendidos, valores e dados</p>
                     <p className="text-profile" >2.4 Dados de localização : Endereço de entrega e retirada de produtos.</p>
                     <p className=" mb-4" >2.5 Dados de uso : Informações sobre a interação com a plataforma, incluindo páginas visitadas,
                         tempo de navegação e ações realizadas.</p>


            <h3 className=" text-[1.5rem] mb-4  font-bold text-marieth">3. Uso dos Dados Pessoais</h3>
            <p className="text-profile" > 3.1 Os dados coletados são utilizados para:</p>
            <p className="text-profile" > 3.2 Gerenciar sua conta na plataforma.</p>
            <p className="text-profile" > 3.4 Processar transações de compra e venda.</p>
            <p className="text-profile" > 3.5 Fornecer suporte ao usuário e melhorar a experiência de uso.</p>
            <p className="text-profile" > 3.6 Garantir a segurança e prevenir fraudes.</p>
            <p className=" mb-4">3.7 Cumprir obrigações legais e regulatórias.</p>


        <h3 className=" text-[1.5rem] mb-4  font-bold text-marieth">4. Compartilhamento de Dados</h3>
        <p className="text-profile" >Podemos compartilhar suas informações nas seguintes situações:</p>

        <p className="text-profile" >4.1 Com fornecedores e transportadores para facilitar entregas e compras.</p>
        <p className="text-profile"  > 4.2 Com rapidez de pagamento , como Unitel Money e Afrimoney e multicaixaexpress , para realizar transações</p>
        <p className="text-profile" > 4.3 Com autoridades legais , é necessário cumprir a lei ou responder a processos judiciais.</p>
        <p className=" mb-4">4.4 Com parceiros de marketing , caso autorizado pelo usuário.</p>
       
        <h3 className=" text-[1.5rem] mb-4  font-bold text-marieth">5. Segurança dos Dados</h3>
        <p className="text-profile" >A plataforma <span className="font-bold">NzoAgro</span> adopta medidas para proteger seus dados contra acessos não autorizados,
             uso indevido e perdas, incluindo:</p>

        <p className="text-profile" >5.1 Criptografia de dados sensíveis .</p>
        <p className="text-profile" >5.2 Autenticação segura para login . .</p>
        <p className="text-profile" >5.3 Monitoramento contínuo para prevenção de fraudes . .</p>
        <p className="text-profile">No entanto, nenhum sistema é 100% seguro, e o usuário deve adotar 
            boas práticas de segurança, como manter sua senha protegida.</p>

            <h3 className=" text-[1.5rem] mb-4  font-bold text-marieth">6. Armazenamento e Retenção de Dados</h3>
            <p className="text-profile">Os dados dos usuários são armazenados em servidores seguros e mantidos apenas pelo tempo necessário para cumprir os objetivos descritos nesta política.
            <p className=" text-profile mb-4">Se desejar excluir sua conta e seus dados, entre em contato com nosso suporte.</p>
</p>

        <h3 className=" text-[1.5rem] mb-4  font-bold text-marieth">7 Direitos do Usuário</h3>
        <p className="text-profile">O usuário tem direito a:</p>
        <p className="text-profile">7.1 Acessar seus dados armazenados na plataforma.</p>
        <p className="text-profile">7.2 Corrigir informações incorretas ou desatualizadas.</p>
        <p className="text-profile">7.3 Solicitar a exclusão de dados (exceto quando exigido por lei)..</p>
        <p className="text-profile">7.4 Revogar o consentimento para o uso de seus dados para marketing.</p>
        <p className="text-profile mb-4">Para exercer esses direitos, entre em contato pelo e-mail <span className="text-blue-500"> [nzoagroorg@gmail.com]</span> .</p>
            
            <h3 className=" text-[1.5rem] mb-4  font-bold text-marieth">8. Alterações na Política de Privacidade</h3>
            <p className="text-profile">Podemos atualizar esta política a qualquer momento. Os usuários serão notificados 
                sobre mudanças relevantes e continuarão a usar a plataforma implica na 
                acessível da versão mais recente da política.</p>

                <h3 className=" text-[1.5rem] mb-4  font-bold text-marieth">9. Contato</h3>
                <p className="text-profile mb-4">
                Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato com 
                nossa equipe pelo  <span className="text-blue-500"> [nzoagroorg@gmail.com]</span>
                </p>
                




















            </div>


















            <Footer/>

        </div>





    )
}