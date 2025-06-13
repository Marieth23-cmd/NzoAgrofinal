"use client"
import { useState, useEffect } from "react";
import { criarPedido } from "../Services/pedidos"; 
import { useRouter } from "next/navigation";
import Head from "next/head";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

export default function Localizacao() {
  const [formData, setFormData] = useState({
    provincia: "",
    municipio: "",
    bairro: "",
    rua: "",
    pais: "Angola",
    numero: "",
    referencia: "",
    endereco_padrao: false
  });

  const [errors, setErrors] = useState({
    provincia: "",
    municipio: "",
    bairro: "",
    rua: "",
    numero: "",
    referencia: ""
  });


  interface Pedido {
  id_pedido?: number; // O id_pedido pode ser opcional se não for retornado imediatamente
  estado: string;
  valor_total: number;
  rua: string;
  bairro: string;
  pais: string;
  municipio: string;
  referencia: string;
  provincia: string;
  numero: string;
  itens: Array<{
    quantidade_comprada: number;
    preco: number;
    subtotal: number;
    id_produto: number;
  }>;
}


  const router = useRouter();
  const [formValid, setFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  // Validar o número de telefone angolano (deve começar com 9 e ter 9 dígitos)
  const validarNumeroAngola = (numero: string) => {
    const regex = /^9\d{8}$/;
    return regex.test(numero);
  };

  // Validar todo o formulário sempre que os dados mudam
  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = () => {
    const newErrors = {
      provincia: formData.provincia ? "" : "Selecione uma província",
      municipio: formData.municipio ? "" : "Digite o município",
      bairro: formData.bairro ? "" : "Digite o bairro",
      rua: formData.rua ? "" : "Digite a rua ou referência",
      numero: !formData.numero 
        ? "Digite o número de contato" 
        : !validarNumeroAngola(formData.numero) 
          ? "O contato deve ter 9 dígitos e começar com 9" 
          : "",
      referencia: formData.referencia ? "" : "Digite uma referência"
    };

    setErrors(newErrors);

    // Verificar se não há erros no formulário
    const isValid = Object.values(newErrors).every(error => error === "");
    setFormValid(isValid);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      let fieldValue: string | boolean = value;
      if (type === "checkbox" && e.target instanceof HTMLInputElement) {
        fieldValue = e.target.checked;
      }
      setFormData(prev => ({
        ...prev,
        [name]: fieldValue,
      }));
    };


const navegarParaPagamento = (idPedido: number) => {
  console.log('Tentando navegar para pagamento com ID:', idPedido);
  
  if (!idPedido || idPedido <= 0) {
    console.error('ID do pedido inválido:', idPedido);
    setSubmitError('ID do pedido inválido');
    return;
  }

  try {
    const url = `/telapaga/${idPedido}`;
    console.log('Navegando para:', url);
    router.push(url);
  } catch (error) {
    console.error('Erro na navegação:', error);
    setSubmitError('Erro ao redirecionar para pagamento');
  }
};




  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  
  if (!formValid) {
    validateForm();
    return;
  }
  
  setSubmitError("");
  setSubmitSuccess("");
  setIsSubmitting(true);

  try {
    // Seus dados existentes...
    const itens: any[] = []; 
    const valor_total: number = 0; 
    
    const dadosParaEnviar = {
      provincia: formData.provincia,
      municipio: formData.municipio,
      bairro: formData.bairro,
      rua: formData.rua,
      pais: formData.pais,
      numero: formData.numero,
      referencia: formData.referencia,
      estado: "Pendente",
      valor_total: valor_total,
      itens: itens
    };
    
    // Chamada à API - certifique-se que retorna o id_pedido
    const response: Pedido = await criarPedido(dadosParaEnviar);
    
    // Verificar se a resposta contém o id_pedido
    if (!response.id_pedido) {
      throw new Error('ID do pedido não retornado pela API');
    }
    
    setSubmitSuccess("Pedido criado com sucesso! Redirecionando...");
    
    // Salvar endereço padrão se necessário
    if (formData.endereco_padrao) {
      localStorage.setItem('endereco_padrao', JSON.stringify({
        provincia: formData.provincia,
        municipio: formData.municipio,
        bairro: formData.bairro,
        rua: formData.rua,
        pais: formData.pais,
        numero: formData.numero,
        referencia: formData.referencia
      }));
    }
    
    // Aguardar um pouco antes de redirecionar (opcional)
   setTimeout(() => {
  if (response.id_pedido && response.id_pedido > 0) {
    navegarParaPagamento(response.id_pedido);
  } else {
    setSubmitError('Erro: ID do pedido não foi retornado pela API');
  }
}, 1500);
    
  } catch (error: unknown) {
    console.error("Erro ao criar pedido:", error);
    if (typeof error === "object" && error !== null && "mensagem" in error) {
      setSubmitError((error as { mensagem: string }).mensagem);
    } else {
      setSubmitError("Ocorreu um erro ao processar seu pedido. Tente novamente.");
    }
  } finally {
    setIsSubmitting(false);
  }
};


    // Carregar endereço padrão se existir (opcional)
  useEffect(() => {
    const enderecoPadrao = localStorage.getItem('endereco_padrao');
    if (enderecoPadrao) {
      try {
        const endereco = JSON.parse(enderecoPadrao);
        setFormData(prev => ({
          ...prev,
          ...endereco,
          endereco_padrao: true
        }));
      } catch (e) {
        console.log("Erro ao carregar endereço padrão:", e);
      }
    }
  }, []);

  return (
    <div>
      <Head>
        <title>Localização de Entrega</title>
        <meta name="description" content="Indique a sua localização para encontrarmos a filial mais próxima de si." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      
    <div className="flex justify-center items-center min-h-screen bg-white p-4 mt-[35%] sm:mt-[5%] md:mt-[10%] lg:mt-[15%] mb-20">
      <div className="bg-white rounded-2xl p-6 shadow-lg w-full max-w-xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-marieth">Localização de Entrega</h1>
          <p className="text-gray-600">Indique a sua localização para encontrarmos a filial mais próxima de si.</p>
        </div>

        {submitError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {submitError}
          </div>
        )}

        {submitSuccess && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
            {submitSuccess}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label htmlFor="provincia" className="block mb-1 font-medium text-profile">Província*</label>
            <select
              name="provincia"
              id="provincia"
              value={formData.provincia}
              onChange={handleChange}
              className={`w-full border ${errors.provincia ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
              disabled={isSubmitting}
            >
              <option value="" disabled>Selecione a província</option>
              <option value="Bengo">Bengo</option>
              <option value="Benguela">Benguela</option>
              <option value="Bié">Bié</option>
              <option value="Cabinda">Cabinda</option>
              <option value="Cuando Cubango">Cuando Cubango</option>
              <option value="Cuanza Norte">Cuanza Norte</option>
              <option value="Cuanza Sul">Cuanza Sul</option>
              <option value="Cunene">Cunene</option>
              <option value="Huambo">Huambo</option>
              <option value="Huíla">Huíla</option>
              <option value="Luanda">Luanda</option>
              <option value="Lunda Norte">Lunda Norte</option>
              <option value="Lunda Sul">Lunda Sul</option>
              <option value="Malanje">Malanje</option>
              <option value="Moxico">Moxico</option>
              <option value="Namibe">Namibe</option>
              <option value="Uige">Uíge</option>
              <option value="Zaire">Zaire</option>
            </select>
            {errors.provincia && <p className="text-red-500 text-sm mt-1">{errors.provincia}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="numero" className="block mb-1 font-medium text-profile">Contacto*</label>
            <input
              type="tel"
              name="numero"
              id="numero"
              value={formData.numero}
              onChange={handleChange}
              placeholder="Digite o seu contacto (9xxxxxxxx)"
              className={`w-full border ${errors.numero ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
              disabled={isSubmitting}
            />
            {errors.numero && <p className="text-red-500 text-sm mt-1">{errors.numero}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="municipio" className="block mb-1 font-medium text-profile">Município*</label>
            <input
              type="text"
              name="municipio"
              id="municipio"
              value={formData.municipio}
              onChange={handleChange}
              placeholder="Digite o município"
              className={`w-full border ${errors.municipio ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
              disabled={isSubmitting}
            />
            {errors.municipio && <p className="text-red-500 text-sm mt-1">{errors.municipio}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="bairro" className="block mb-1 font-medium text-profile">Bairro / Zona*</label>
            <input
              type="text"
              name="bairro"
              id="bairro"
              value={formData.bairro}
              onChange={handleChange}
              placeholder="Digite o seu bairro"
              className={`w-full border ${errors.bairro ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
              disabled={isSubmitting}
            />
            {errors.bairro && <p className="text-red-500 text-sm mt-1">{errors.bairro}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="rua" className="block mb-1 font-medium text-profile">Rua*</label>
            <input
              type="text"
              name="rua"
              id="rua"
              value={formData.rua}
              onChange={handleChange}
              placeholder="Digite a sua rua"
              className={`w-full border ${errors.rua ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
              disabled={isSubmitting}
            />
            {errors.rua && <p className="text-red-500 text-sm mt-1">{errors.rua}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="referencia" className="block mb-1 font-medium text-profile">Referência específica*</label>
            <input
              type="text"
              name="referencia"
              id="referencia"
              value={formData.referencia}
              onChange={handleChange}
              placeholder="Digite uma referência (ex: perto do mercado)"
              className={`w-full border ${errors.referencia ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
              disabled={isSubmitting}
            />
            {errors.referencia && <p className="text-red-500 text-sm mt-1">{errors.referencia}</p>}
          </div>
          
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              name="endereco_padrao"
              id="endereco_padrao"
              checked={formData.endereco_padrao}
              onChange={handleChange}
              className="mr-2"
              disabled={isSubmitting}
            />
            <label htmlFor="endereco_padrao" className="text-gray-700">Definir como endereço padrão</label>
          </div>

        

                <button
          type="submit"
          className={`w-full ${
            formValid && !isSubmitting 
              ? 'bg-marieth hover:bg-verdeaceso' 
              : 'bg-gray-400 cursor-not-allowed'
          } text-white py-3 rounded font-semibold transition-colors`}
          disabled={!formValid || isSubmitting}
        >
          {isSubmitting ? "Processando..." : "Confirmar Localização"}
        </button>

        </form>
      </div>
    </div> 
    <Footer />
    </div>
  );
}
   

