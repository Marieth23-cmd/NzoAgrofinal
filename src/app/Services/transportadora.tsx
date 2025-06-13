import axios from "axios";

console.log('API URL:', process.env.NEXT_PUBLIC_API_URL)
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://backend-nzoagro.onrender.com"
console.log('API URL:', API_URL)

// Interface para cadastro de transportadora
interface CadastroTransportadora {
    nome: string;
    nif: string;
    telefone: string;
    email: string;
    senha: string;
    provincia_base?: string;
}

// Interface para cadastro de filial
interface CadastroFilial {
    provincia: string;
    bairro?: string;
    descricao?: string;
}

// Interface para aceitar entrega
interface AceitarEntrega {
    pedidos_id: number;
    endereco: string;
    contacto_cliente: string;
    filial_retirada_id: number;
}

// Função para cadastrar transportadora
export const cadastrarTransportadora = async (dados: CadastroTransportadora): Promise<any> => {
    try {
        const response = await axios.post(
            `${API_URL}/transportadoras/cadastrar`,
            dados,
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("✅ Transportadora cadastrada:", response.data);
        return response.data;

    } catch (error: any) {
        console.log("❌ Erro ao cadastrar transportadora:", error.response?.data || error.message);

        if (error.response && error.response.data) {
            throw error.response.data;
        } else {
            throw { mensagem: "Erro desconhecido ao cadastrar transportadora" };
        }
    }
};

// Função para cadastrar filial
export const cadastrarFilial = async (dados: CadastroFilial): Promise<any> => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
            `${API_URL}/transportadoras/cadastrar-filial`,
            dados,
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            }
        );

        console.log("✅ Filial cadastrada:", response.data);
        return response.data;

    } catch (error: any) {
        console.log("❌ Erro ao cadastrar filial:", error.response?.data || error.message);

        if (error.response && error.response.data) {
            throw error.response.data;
        } else {
            throw { mensagem: "Erro desconhecido ao cadastrar filial" };
        }
    }
};

// Função para aceitar entrega
export const aceitarEntrega = async (dados: AceitarEntrega): Promise<any> => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
            `${API_URL}/transportadoras/aceitar-entrega`,
            dados,
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            }
        );

        console.log("✅ Entrega aceita:", response.data);
        return response.data;

    } catch (error: any) {
        console.log("❌ Erro ao aceitar entrega:", error.response?.data || error.message);

        if (error.response && error.response.data) {
            throw error.response.data;
        } else {
            throw { mensagem: "Erro desconhecido ao aceitar entrega" };
        }
    }
};

// Função para listar minhas entregas
export const listarMinhasEntregas = async (): Promise<any> => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
            `${API_URL}/transportadoras/minhas-entregas`,
            {
                withCredentials: true,
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            }
        );

        console.log("✅ Entregas listadas:", response.data);
        return response.data;

    } catch (error: any) {
        console.log("❌ Erro ao listar entregas:", error.response?.data || error.message);

        if (error.response && error.response.data) {
            throw error.response.data;
        } else {
            throw { mensagem: "Erro desconhecido ao listar entregas" };
        }
    }
};

// Função para listar entregas pendentes
export const listarEntregasPendentes = async (): Promise<any> => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
            `${API_URL}/transportadoras/entregas-pendentes`,
            {
                withCredentials: true,
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            }
        );

        console.log("✅ Entregas pendentes listadas:", response.data);
        return response.data;

    } catch (error: any) {
        console.log("❌ Erro ao listar entregas pendentes:", error.response?.data || error.message);

        if (error.response && error.response.data) {
            throw error.response.data;
        } else {
            throw { mensagem: "Erro desconhecido ao listar entregas pendentes" };
        }
    }
};

// Função para listar minhas filiais
export const listarMinhasFiliais = async (): Promise<any> => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
            `${API_URL}/transportadoras/minhas-filiais`,
            {
                withCredentials: true,
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            }
        );

        console.log("✅ Filiais listadas:", response.data);
        return response.data;

    } catch (error: any) {
        console.log("❌ Erro ao listar filiais:", error.response?.data || error.message);

        if (error.response && error.response.data) {
            throw error.response.data;
        } else {
            throw { mensagem: "Erro desconhecido ao listar filiais" };
        }
    }
};

// Função para atualizar status da entrega
export const atualizarStatusEntrega = async (id_entrega: number, estado_entrega: string): Promise<any> => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(
            `${API_URL}/transportadoras/entrega/${id_entrega}/status`,
            { estado_entrega },
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            }
        );

        console.log("✅ Status da entrega atualizado:", response.data);
        return response.data;

    } catch (error: any) {
        console.log("❌ Erro ao atualizar status da entrega:", error.response?.data || error.message);

        if (error.response && error.response.data) {
            throw error.response.data;
        } else {
            throw { mensagem: "Erro desconhecido ao atualizar status da entrega" };
        }
    }
};

// Função para listar filiais por ID da transportadora
export const listarFilialsPorTransportadora = async (id_transportadora: number): Promise<any> => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
            `${API_URL}/transportadoras/filiais/${id_transportadora}`,
            {
                withCredentials: true,
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            }
        );

        console.log("✅ Filiais por transportadora listadas:", response.data);
        return response.data;

    } catch (error: any) {
        console.log("❌ Erro ao listar filiais por transportadora:", error.response?.data || error.message);

        if (error.response && error.response.data) {
            throw error.response.data;
        } else {
            throw { mensagem: "Erro desconhecido ao listar filiais por transportadora" };
        }
    }
};


// função para listar transportadoras
export const getTransportadoras = async (): Promise<any> => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
            `${API_URL}/transportadoras`,
            {
                withCredentials: true,
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            }
        );

        console.log("✅ Transportadoras listadas:", response.data);
        return response.data;

    } catch (error: any) {
        console.log("❌ Erro ao listar transportadoras:", error.response?.data || error.message);

        if (error.response && error.response.data) {
            throw error.response.data;
        } else {
            throw { mensagem: "Erro desconhecido ao listar transportadoras" };
        }
    }
}