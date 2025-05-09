"use client";
import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { FaTrash } from "react-icons/fa";
import { IoCheckmark } from "react-icons/io5";
import {
  listarNotificacoes,
  deletarNotificacao,
  deletarTodasNotificacoes,
  marcarNotificacaoComoLida,
  
} from "../Services/notificacoes";

// Tipo da notificação
interface Notificacao {
  id_notificacoes: number;
  titulo: string;
  mensagem: string;
  data_legivel: string;
  is_lida: number;
}

export default function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [abaSelecionada, setAbaSelecionada] = useState<"todas" | "nao-lidas">("todas");
  const [carregando, setCarregando] = useState(true);
  const [quantidadeNaoLidas, setQuantidadeNaoLidas] = useState<number>(0);


  // Função que carrega as notificações da API
  const carregarNotificacoes = async () => {
    setCarregando(true);
    try {
      const resposta = await listarNotificacoes();
      const listaCompleta: Notificacao[] = resposta.notificacoes || [];
      // Limita para mostrar no máximo 30 notificações (as mais recentes)
      const ultimas30 = listaCompleta.slice(0, 30);
      setNotificacoes(ultimas30);
    } catch (error) {
      console.log("Erro ao carregar notificações:", error);
      setNotificacoes([]);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarNotificacoes();
  }, []);

  // Apagar uma notificação específica
  const handleApagar = async (id: number) => {
    try {
      await deletarNotificacao(id);
      setNotificacoes((prev) => prev.filter((n) => n.id_notificacoes !== id));
    } catch (error) {
      console.error("Erro ao apagar notificação:", error);
    }
  };

  // Apagar todas as notificações com confirmação
  const handleApagarTodas = async () => {
    if (notificacoes.length === 0) return;

    const confirmacao = window.confirm("Tem certeza que deseja apagar todas as notificações?");
    if (!confirmacao) return;

    try {
      await deletarTodasNotificacoes();
      setNotificacoes([]);
    } catch (error) {
      console.log("Erro ao apagar todas as notificações:", error);
    }
  };

  // Marcar uma notificação como lida
  const handleMarcarComoLida = async (id: number) => {
    try {
      await marcarNotificacaoComoLida(id);
      setNotificacoes((prev) =>
        prev.map((n) =>
          n.id_notificacoes === id ? { ...n, is_lida: 1 } : n
        )
      );
    } catch (error) {
      console.log("Erro ao marcar como lida:", error);
    }
  };

  // Filtro para exibir notificações com base na aba
  const notificacoesFiltradas = notificacoes.filter((n) =>
    abaSelecionada === "todas" ? true : !n.is_lida
  );


  
  return (
    <main>
      <Navbar />
      
      <div className="flex flex-col mb-20 gap-2 mt-[25%] lg:mt-[15%] max-w-[1200px] shadow-custom">
        
        <div className="flex items-end">
          <h1 className="text-[2rem] text-marieth mt-[80px] p-4 font-bold">
            Notificações
          </h1>
          {/* Botão de apagar todas, só aparece se houver notificações */}
          {notificacoes.length > 0 && (
            <button
              className="bg-vermelho text-white rounded-[5px] h-fit px-2 py-1 mb-5 ml-auto flex items-center gap-2 cursor-pointer"
              onClick={handleApagarTodas}
            >
              <FaTrash /> Apagar todas
            </button>
          )}
        </div>

        
        <div className="flex border-b">
          <div
            className={`p-4 cursor-pointer font-bold border-b-2 ${
              abaSelecionada === "todas"
                ? "border-marieth text-marieth"
                : "border-transparent"
            }`}
            onClick={() => setAbaSelecionada("todas")}
          >
            Todas
          </div>
          <div
            className={`p-4 cursor-pointer font-bold border-b-2 ${
              abaSelecionada === "nao-lidas"
                ? "border-marieth text-marieth"
                : "border-transparent"
            }`}
            onClick={() => setAbaSelecionada("nao-lidas")}
          >
            Não lidas
          </div>
        </div>

        {/* Lista de notificações */}
        <div className="py-0 px-4 my-8">
          {notificacoesFiltradas.map((n) => (
            <div
              key={n.id_notificacoes}
              className={`flex flex-col items-start shadow-custom p-2 mb-4 gap-2 rounded-[5px] transition-opacity duration-300 ease-in-out ${
                n.is_lida ? "" : "bg-gray-100 border-l-4 border-marieth"
              }`}
            >
              <h3
                className={`mb-2 text-[1.1rem] ${
                  n.is_lida ? "text-gray-800" : "text-marieth font-bold"
                }`}
              >
                {n.titulo || "Nova mensagem"}
              </h3>
              <p className="text-cortexto">{n.mensagem}</p>
              <p className="text-sm text-cortime">{n.data_legivel}</p>

              <div className="flex">
                {!n.is_lida && (
                  <button
                    className="flex bg-marieth text-white m-2 rounded-[5px] items-center gap-2 cursor-pointer py-2 px-4"
                    onClick={() => handleMarcarComoLida(n.id_notificacoes)}
                  >
                    <IoCheckmark className="text-2xl" /> Marcar como lida
                  </button>
                )}
                <button
                  className="flex bg-vermelho text-white border-none m-2 rounded-[5px] items-center gap-2 cursor-pointer py-2 px-4"
                  onClick={() => handleApagar(n.id_notificacoes)}
                >
                  <FaTrash /> Apagar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
