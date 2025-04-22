"use client"
import { useState } from "react";

export default function Localizacao() {
  const [formData, setFormData] = useState({
    province: "",
    municipality: "",
    neighborhood: "",
    street: "",
    defaultAddress: false,
    contacto:""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value, type } = target;
    const checked = type === "checkbox" ? (target as HTMLInputElement).checked : undefined;
  
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Dados de localização:", formData);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-2xl p-6 shadow-lg w-full max-w-xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-marieth">Localização de Entrega</h1>
          <p className="text-gray-600">Indique a sua localização para encontrarmos a filial mais próxima de si.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="provincia" className="block mb-1 font-medium text-profile">Província</label>
            <select
              name="province"
              id="provincia"
              value={formData.province}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
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
          </div>
          <div className="mb-4">
            <label htmlFor="contacto" className="block mb-1 font-medium text-profile"> Contacto</label>
            <input
              type="tel"
              name="contacto"
              id="contacto"
              value={formData.contacto}
              onChange={handleChange}
              required
              placeholder="Digite o seu contacto"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="municipio" className="block mb-1 font-medium text-profile">Município</label>
            <input
              type="text"
              name="municipio"
              id="municipio"
              value={formData.municipality}
              onChange={handleChange}
              required
              placeholder="Digite o município"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="bairro" className="block mb-1 font-medium text-profile">Bairro / Zona</label>
            <input
              type="text"
              name="bairro"
              id="bairro"
              value={formData.neighborhood}
              onChange={handleChange}
              required
              placeholder="Digite o seu bairro"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="rua" className="block mb-1 font-medium text-profile">Rua ou referência específica</label>
            <input
              type="text"
              name="rua"
              id="rua"
              value={formData.street}
              onChange={handleChange}
              required
              placeholder="Digite a sua rua"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              name="endereco_padrao"
              id="endereco_padrao"
              checked={formData.defaultAddress}
              onChange={handleChange}
              placeholder="Digite o município"
              className="mr-2"
            />
            <label htmlFor="endereco_padrao" className="text-gray-700">Definir como endereço padrão</label>
          </div>

          <button
            type="submit"
            className="w-full bg-marieth text-white py-3 rounded font-semibold hover:bg-verdeaceso transition-colors"
          >
            Confirmar Localização
          </button>
        </form>
      </div>
    </div>
  );
}
