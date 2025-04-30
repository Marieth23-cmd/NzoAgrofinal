// Dashboard.tsx
"use client";

import React from "react";
import { FaHome, FaUser, FaTruck, FaBell, FaCog, FaEdit } from "react-icons/fa";

const Dashboard = () => {
  return (
    <div className="grid grid-cols-[250px_1fr] min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="bg-white p-4 border-r border-gray-200">
        <div className="text-center p-4 mb-8 font-bold text-xl text-marieth">
          Transporte NzoAgro
        </div>
        <ul className="space-y-2">
          <li>
            <a className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-md gap-2" href="#">
              <FaHome /> Início
            </a>
          </li>
          <li>
            <a className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-md gap-2" href="#">
              <FaTruck /> Pedidos
            </a>
          </li>
          <li>
            <a className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-md gap-2" href="#">
              <FaUser /> Perfil
            </a>
          </li>
          <li>
            <a className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-md gap-2" href="#">
              <FaBell /> Notificações
            </a>
          </li>
          <li>
            <a className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-md gap-2" href="#">
              <FaCog /> Configurações
            </a>
          </li>
        </ul>
      </aside>

     
      <main className="p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Painel de Pedidos</h1>

        {/* Stats Cards */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3 mb-8">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="text-2xl text-marieth font-bold">42</div>
            <div className="text-gray-700 mt-2">Pedidos Pendentes</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="text-2xl text-marieth font-bold">85</div>
            <div className="text-gray-700 mt-2">Entregues</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="text-2xl text-orange-500 font-bold">13</div>
            <div className="text-gray-700 mt-2">Em Trânsito</div>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow flex flex-col justify-between"
            >
              <div className="flex justify-between items-center border-b pb-2 mb-4">
                <span className="text-marieth font-semibold">#PED000{index + 1}</span>
                <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm">
                  Pendente
                </span>
              </div>
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-gray-700">Cliente:</span>
                  <span className="text-gray-800">João Pedro</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-gray-700">Localização:</span>
                  <span className="text-gray-800">Luanda</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Total:</span>
                  <span className="text-gray-800">Kz 12.000</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="bg-marieth text-white px-3 py-2 rounded-md w-full">
                  Aceitar
                </button>
                <button className="bg-marieth text-white px-3 py-2 rounded-md w-full">
                  Mensagem
                </button>
                <button className="bg-red-500 text-white px-3 py-2 rounded-md w-full">
                  Rejeitar
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
