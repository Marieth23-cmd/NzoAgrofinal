import Navbar from "../Components/Navbar"
import Footer from "../Components/Footer"
 export default function Comprador (){
    return(
        <div>
            <Navbar/>
            
            <div className=" flex flex-col mb-20 gap-2 mt-[15%] max-w-[1200px] shadow-custom p-8  rounded-[10px] ml-8">
          
            <div  className=" flex  items-center mb-8">
            
            <div className="flex gap-4 items-center">
                <h1 className="text-marieth text-[2rem] font-bold"> Relatório de Compras</h1>
                
                <input type="date" className="ml-80 p-2 rounded-[5px] items-center border-[1px] border-solid border-tab" />
                <input type="date"  className="p-2 rounded-[5px] items-center border-[1px] border-solid border-tab"/>
                <button className="bg-marieth border-none hover:bg-verdeaceso text-white py-2 px-4 rounded-[5px] cursor-pointer ">Filtrar</button>
          
            </div>
            </div>

            <div className=" grid grid-cols-4 mb-8 gap-6">
                <div className=" p-6 rounded-[10px] text-center shadow-custom bg-white">
                    <h3 className="m-0 text-cortexto text-[1.17rem]">Total Gasto</h3>
                    <p className="text-marieth font-bold p-4 my-2 mx-0 text-[2rem]" >kzs 250.000</p>
                </div>
                <div className=" p-6 rounded-[10px] text-center shadow-custom bg-white" >
                    <h3 className="m-0 text-cortexto text-[1.17rem]">Quantidade de Pedidos</h3>
                    <p className="text-marieth font-bold p-4 my-2 mx-0 text-[2rem]" >143</p>
                </div>
                <div className=" p-6 rounded-[10px] text-center shadow-custom bg-white">
                    <h3 className="m-0 text-cortexto text-[1.17rem]">Média por Pedido</h3>
                    <p className="text-marieth font-bold p-4 my-2 mx-0 text-[2rem]" >kzs 219</p>
                </div>
                <div className=" p-6 rounded-[10px] text-center shadow-custom bg-white">
                    <h3 className="m-0 text-cortexto text-[1.17rem]">Fornecedores</h3>
                    <p className="text-marieth font-bold p-4 my-2 mx-0 text-[2rem]" > 24</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded[10px] mb-8 border-[1px] border-solid border-tab">
              <canvas></canvas>
            </div>



            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                <thead>
          <tr >
            <th className="p-4 text-left border-b-[1px] border-b-solid border-b-tab text-cortexto bg-th">Data</th>
            <th className="p-4 text-left border-b-[1px] border-b-solid border-b-tab text-cortexto bg-th" >Produto</th>
            <th  className="p-4 text-left border-b-[1px] border-b-solid border-b-tab text-cortexto bg-th">Fornecedor</th>
            <th className="p-4 text-left border-b-[1px] border-b-solid border-b-tab text-cortexto bg-th" >Quantidade</th>
            <th  className="p-4 text-left border-b-[1px] border-b-solid border-b-tab text-cortexto bg-th" >Valor Total</th>
            <th  className="p-4 text-left border-b-[1px] border-b-solid border-b-tab text-cortexto bg-th">Estado</th>
          </tr>
        </thead>    

        <tbody>
          <tr className="hover:bg-th">
            <td className="p-4 text-left border-b-[1px] border-b-solid border-b-tab" >10/05/2023</td>
            <td className="p-4 text-left border-b-[1px] border-b-solid border-b-tab" >Tomate Orgânico</td>
            <td className="p-4 text-left border-b-[1px] border-b-solid border-b-tab" >Fazenda Sol Nascente</td>
            <td className="p-4 text-left border-b-[1px] border-b-solid border-b-tab" >100 kg</td>
            <td className="p-4 text-left border-b-[1px] border-b-solid border-b-tab" >kzs 850,00</td>
            <td className="p-4 text-left border-b-[1px] border-b-solid border-b-tab" >Entregue</td>
          </tr>
          <tr className="hover:bg-th" >
            <td className="p-4 text-left border-b-[1px] border-b-solid border-b-tab" >08/05/2023</td>
            <td className="p-4 text-left border-b-[1px] border-b-solid border-b-tab" >Alface Crespa</td>
            <td className="p-4 text-left border-b-[1px] border-b-solid border-b-tab" >Horta Verde</td>
            <td className="p-4 text-left border-b-[1px] border-b-solid border-b-tab" >50 kg</td>
            <td className="p-4 text-left border-b-[1px] border-b-solid border-b-tab" >kzs 375,00</td>
            <td className="p-4 text-left border-b-[1px] border-b-solid border-b-tab" >Pendente</td>
          </tr>
          <tr className="hover:bg-th">
            <td className="p-4 text-left border-b-[1px] border-b-solid border-b-tab" >05/05/2023</td>
            <td className="p-4 text-left border-b-[1px] border-b-solid border-b-tab" >Cenoura</td>
            <td className="p-4 text-left border-b-[1px] border-b-solid border-b-tab" >Agricultura Familiar</td>
            <td className="p-4 text-left border-b-[1px] border-b-solid border-b-tab" >200 kg</td>
            <td className="p-4 text-left border-b-[1px] border-b-solid border-b-tab" >kzs 600,00</td>
            <td className="p-4 text-left border-b-[1px] border-b-solid border-b-tab" >Entregue</td>
          </tr>
        </tbody>           
                </table>
            </div> 
            <div>
            <button className="bg-marieth cursor-pointer rounded-[10px] border-none
            hover:bg-verdeaceso text-white   py-[0.8rem] px-[1.5rem]">Exportar Relatório</button>
 </div>
                            
    </div>      
    <Footer/>
        </div>
    )
 }