'use client';
import { useState, ChangeEvent, FormEvent } from "react";
import { BiCamera, BiUser } from "react-icons/bi";

export default function EditarPerfil() {
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Dados do perfil para atualização:", formData);
    alert("Perfil atualizado com sucesso!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] p-5">
      <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#333] mb-6">Editar Perfil</h1>

          <div className="relative w-36 h-36 mx-auto mb-4">
            <label
              htmlFor="profile-picture-input"
              className="w-full h-full rounded-full border-4 border-marieth bg-gray-100 flex items-center justify-center overflow-hidden cursor-pointer"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <BiUser className="w-12 h-12 text-gray-500" />
              )}
            </label>
            <label
              htmlFor="profile-picture-input"
              className="absolute bottom-0 right-0 bg-marieth p-2 rounded-full cursor-pointer"
            >
              <BiCamera className="w-5 h-5 text-white" />
            </label>
            <input
              id="profile-picture-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-[#333] font-medium mb-1">
                Nome Completo
              </label>
              <input
                id="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-[#333] font-medium mb-1">
                E-mail
              </label>
              <input
                id="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-marieth"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-[#333] font-medium mb-1">
                Telefone
              </label>
              <input
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                type="tel"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-marieth"
              />
            </div>
            
            <div>
              <label htmlFor="address" className="block text-[#333] font-medium mb-1">
                Endereço
              </label>
              <input
                id="address"
                value={formData.address}
                onChange={handleChange}
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-marieth"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="w-full py-3 rounded-md border border-gray-300 font-semibold text-[#333] hover:bg-gray-100 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full py-3 rounded-md bg-marieth text-white font-semibold hover:bg-verdeaceso transition"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
