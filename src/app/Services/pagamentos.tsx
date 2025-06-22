import axios, { AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://backend-nzoagro.onrender.com"

// ========================================
// LISTAR SOLICITAÇÕES DE REEMBOLSO DO USUÁRIO
// ========================================
export const listarMeusReembolsos = async () => {
    try {
        const response = await axios.get(
            `${API_URL}/pagamentos/meus-reembolsos`,
            {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
            }
        );
        return response.data;
    } catch (error: any) {
        const axiosError = error as AxiosError;
        console.log("Erro ao buscar solicitações de reembolso:", axiosError.response?.data || axiosError.message);
        throw axiosError.response?.data || { erro: "Erro desconhecido ao buscar solicitações de reembolso" };
    }
};

// ========================================


// PROCESSAR REEMBOLSO (ADMIN/MODERADOR)
// ========================================
export const processarReembolso = async (
    idSolicitacao: string | number,
    acao: 'aprovar' | 'rejeitar',
    observacoesAdmin?: string
) => {
    try {
        const response = await axios.post(
            `${API_URL}/pagamentos/processar-reembolso/${idSolicitacao}`,
            { 
                acao, 
                observacoes_admin: observacoesAdmin 
            },
            {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
            }
        );
        return response.data;
    } catch (error: any) {
        const axiosError = error as AxiosError;
        console.log("Erro ao processar reembolso:", axiosError.response?.data || axiosError.message);
        throw axiosError.response?.data || { erro: "Erro desconhecido ao processar reembolso" };
    }
};

// ========================================
// DASHBOARD DE REEMBOLSOS (ADMIN)
// ========================================
export const obterDashboardReembolsos = async () => {
    try {
        const response = await axios.get(
            `${API_URL}/pagamentos/dashboard-reembolsos`,
            {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
            }
        );
        return response.data;
    } catch (error: any) {
        const axiosError = error as AxiosError;
        console.log("Erro ao carregar dashboard de reembolsos:", axiosError.response?.data || axiosError.message);
        throw axiosError.response?.data || { erro: "Erro desconhecido ao carregar dashboard de reembolsos" };
    }
};

// ========================================
// RELATÓRIO FINANCEIRO DETALHADO (ADMIN)
// ========================================
export const obterRelatorioFinanceiro = async (
    dataInicio?: string,
    dataFim?: string,
    tipoRelatorio: string = 'geral'
) => {
    try {
        const params = new URLSearchParams();
        
        if (dataInicio) params.append('data_inicio', dataInicio);
        if (dataFim) params.append('data_fim', dataFim);
        params.append('tipo_relatorio', tipoRelatorio);

        const response = await axios.get(
            `${API_URL}/pagamentos/relatorio-financeiro?${params.toString()}`,
            {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
            }
        );
        return response.data;
    } catch (error: any) {
        const axiosError = error as AxiosError;
        console.log("Erro ao gerar relatório financeiro:", axiosError.response?.data || axiosError.message);
        throw axiosError.response?.data || { erro: "Erro desconhecido ao gerar relatório financeiro" };
    }
};

// // ========================================
// // CONFIRMAR ENTREGA E DISTRIBUIR VALORES
// // ========================================
// export const confirmarEntrega = async (
//     transacaoId: string,
//     confirmadoPor: number,
//     metodoConfirmacao: string = 'manual',
//     idTransportadora?: number
// ) => {
//     try {
//         const response = await axios.post(
//             `${API_URL}/pagamentos/confirmar-entrega/${transacaoId}`,
//             {
//                 confirmado_por: confirmadoPor,
//                 metodo_confirmacao: metodoConfirmacao,
//                 id_transportadora: idTransportadora
//             },
//             {
//                 withCredentials: true,
//                 headers: { "Content-Type": "application/json" },
//             }
//         );
//         return response.data;
//     } catch (error: any) {
//         const axiosError = error as AxiosError;
//         console.log("Erro ao confirmar entrega:", axiosError.response?.data || axiosError.message);
//         throw axiosError.response?.data || { erro: "Erro desconhecido ao confirmar entrega" };
//     }
// };

// ========================================
// SOLICITAR REEMBOLSO
// ========================================
export const solicitarReembolso = async (
    transacaoId: string,
    motivoReembolso: string,
    tipoReembolso: string = 'total'
) => {
    try {
        const response = await axios.post(
            `${API_URL}/pagamentos/solicitar-reembolso/${transacaoId}`,
            {
                motivo_reembolso: motivoReembolso,
                tipo_reembolso: tipoReembolso
            },
            {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
            }
        );
        return response.data;
    } catch (error: any) {
        const axiosError = error as AxiosError;
        console.log("Erro ao solicitar reembolso:", axiosError.response?.data || axiosError.message);
        throw axiosError.response?.data || { erro: "Erro desconhecido ao solicitar reembolso" };
    }
};

// ========================================
// TIPOS DE DADOS PARA TYPESCRIPT
// ========================================
export interface ConfirmarEntregaResponse {
    mensagem: string;
    confirmacao: {
        transacao_id: string;
        confirmado_por: string;
        data_liberacao: string;
        metodo: string;
        total_distribuido: number;
        entrega_atualizada: string;
    };
    participantes_beneficiados: {
        comprador: string;
        vendedor: string;
        transportadora: string;
        plataforma: string;
    };
    distribuicoes_realizadas: Array<{
        destinatario: string;
        tipo: string;
        valor: number;
        descricao: string;
        metodo_transferencia: string;
    }>;
    entrega_info: {
        id_entrega: number;
        estado_anterior: string;
        estado_atual: string;
        transportadora: string;
        data_confirmacao: string;
    } | null;
    resumo_financeiro: {
        valor_original_pago: number;
        valor_distribuido_vendedor: number;
        valor_distribuido_frete: number;
        comissao_plataforma_total: number;
        taxa_provedor_deduzida: number;
        peso_processado: string;
        tipo_usuario: string;
    };
}

export interface SolicitarReembolsoResponse {
    mensagem: string;
    solicitacao: {
        id: number;
        transacao_id: string;
        status: string;
        data_solicitacao: string;
        prazo_analise: string;
    };
    valores: {
        valor_original: number;
        valor_solicitado: number;
        taxa_reembolso: number;
        valor_liquido_reembolso: number;
        explicacao_taxa: string;
    };
    motivo: {
        informado: string;
        prazo_original: string;
        dias_passados: number;
        prazo_vencido: boolean;
        situacao: string;
    };
    proximos_passos: string[];
    importante: {
        seguranca: string;
        protecao: string;
        contato: string;
    };
}

export interface SolicitacaoReembolso {
    id: number;
    transacao_id: string;
    vendedor: string;
    valor_solicitado: number;
    valor_liquido: number;
    motivo: string;
    status: string;
    data_solicitacao: string;
    prazo_vencido: boolean;
    dias_atraso: number;
}

export interface ReembolsoResponse {
    total_solicitacoes: number;
    solicitacoes: SolicitacaoReembolso[];
}

export interface ProcessarReembolsoResponse {
    mensagem: string;
    solicitacao: {
        id: string | number;
        transacao_id: string;
        status_final: 'aprovada' | 'rejeitada';
        valor_processado: number;
        processado_por: string;
        data_processamento: string;
    };
}

export interface DashboardReembolsos {
    estatisticas: {
        total_solicitacoes: number;
        pendentes: number;
        aprovadas: number;
        rejeitadas: number;
        total_reembolsado: number;
        valor_pendente: number;
    };
    solicitacoes_pendentes: Array<{
        id: number;
        transacao_id: string;
        nome_comprador: string;
        nome_vendedor: string;
        valor_bruto: number;
        valor_liquido_reembolso: number;
        motivo_reembolso: string;
        data_solicitacao: string;
        dias_pendente: number;
    }>;
    alertas: {
        critico: number;
        atencao: number;
    };
}

export interface RelatorioFinanceiro {
    periodo_analise: {
        inicio: string;
        fim: string;
        tipo_relatorio: string;
    };
    resumo_executivo: {
        total_transacoes: number;
        receita_bruta_movimentada: number;
        receita_plataforma_bruta: number;
        receita_plataforma_liquida: number;
        peso_total_processado: string;
        ticket_medio: number;
        percentual_usuarios_premium: string;
    };
    status_transacoes: {
        concluidas: number;
        aguardando_entrega: number;
        canceladas: number;
        reembolsadas: number;
        taxa_sucesso: string;
    };
    distribuicao_financeira: {
        vendedores_receberam: number;
        transportadoras_receberam: number;
        comissao_vendas_nzoagro: number;
        comissao_frete_nzoagro: number;
        taxas_provedores: number;
    };
    provedores_pagamento: Array<{
        provedor: string;
        transacoes: number;
        volume_total: number;
        receita_comissao: number;
        ticket_medio: number;
        participacao_mercado: string;
    }>;
    top_vendedores: Array<{
        nome: string;
        tipo: string;
        vendas_realizadas: number;
        valor_recebido: number;
        comissao_gerada_nzoagro: number;
        ticket_medio: number;
    }>;
    conta_plataforma_consolidada: {
        saldo_comissoes_acumulado: number;
        volume_processado_periodo: number;
        ultima_atualizacao: string;
    };
    metricas_operacionais: {
        comissao_media_por_transacao: number;
        volume_medio_diario: number;
        eficiencia_cobranca: string;
        peso_medio_por_pedido: string;
    };
    configuracoes_aplicadas: {
        comissao_padrao: string;
        comissao_premium: string;
        frete_dinamico: string;
        tipos_pagamento_ativos: number;
    };
}


// Função para gerar referência de pagamento
export const gerarReferenciaPagamento = async (dadosPagamento: {
    tipo_pagamento: string;
    valor_total: number;
    carrinho_id?: string;
    id_vendedor?: string;
}) => {
    try {
        const response = await axios.post(
            `${API_URL}/pagamentos/gerar-referencia`,
            dadosPagamento,
            {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
            }
        );
        return response.data;
    } catch (error: any) {
        const axiosError = error as AxiosError;
        console.log("Erro ao gerar referência de pagamento:", axiosError.response?.data || axiosError.message);
        throw axiosError.response?.data || { erro: "Erro desconhecido ao gerar referência de pagamento" };
    }
};

// Função para simular pagamento
export const simularPagamento = async (referencia: string , metodo_pagamento:string) => {
    try {
        const response = await axios.post(
            `${API_URL}/pagamentos/simular-pagamento`,
            { referencia, metodo_pagamento },
            {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
            }
        );
        return response.data;
    } catch (error: any) {
        const axiosError = error as AxiosError;
        console.log("Erro ao simular pagamento:", axiosError.response?.data || axiosError.message);
        throw axiosError.response?.data || { erro: "Erro desconhecido ao simular pagamento" };
    }
};

// Função para webhook de confirmação de pagamento (caso precise chamar externamente)
export const confirmarPagamentoWebhook = async (dadosConfirmacao: {
    referencia: string;
    valor_pago: number;
    status: string;
    transacao_id_provedor: string;
    timestamp: string;
}) => {
    try {
        const response = await axios.post(
            `${API_URL}/pagamentos/webhook/pagamento-confirmado`,
            dadosConfirmacao,
            {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
            }
        );
        return response.data;
    } catch (error: any) {
        const axiosError = error as AxiosError;
        console.log("Erro ao confirmar pagamento via webhook:", axiosError.response?.data || axiosError.message);
        throw axiosError.response?.data || { erro: "Erro desconhecido ao confirmar pagamento" };
    }
};



export const confirmarEntrega = async (pedidoId: number) => {
    try {
        const response = await axios.post(
            `${API_URL}/pagamentos/confirmar-entrega/${pedidoId}`,
            {}, 
            {   
                withCredentials: true,
                headers: { 
                    "Content-Type": "application/json"
                }
            }
        );
        return response.data;
    } catch (error: any) {
        const axiosError = error as AxiosError;
        console.log("Erro ao confirmar entrega:", axiosError.response?.data || axiosError.message);
        throw axiosError.response?.data || { erro: "Erro desconhecido ao confirmar entrega" };
    }
};