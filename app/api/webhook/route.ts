import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
import { cleanHtmlMessage } from "@/lib/utils"

// Interface para dados do Umbler (formato mais flexível)
interface UmblerWebhookData {
  // Campos obrigatórios
  nome?: string
  name?: string
  customer_name?: string
  telefone?: string
  phone?: string
  customer_phone?: string
  status?: string
  state?: string

  // Campos opcionais
  respondeu?: boolean
  answered?: boolean
  data_inicio?: string
  start_time?: string
  created_at?: string
  data_fim?: string
  end_time?: string
  finished_at?: string
  mensagens?: Array<{
    hora?: string
    time?: string
    timestamp?: string
    conteudo?: string
    content?: string
    message?: string
    text?: string
  }>
  messages?: Array<any>
  mensagem?: string
  message?: string
  description?: string

  // Campos extras que o Umbler pode enviar
  id?: string
  ticket_id?: string
  agent_name?: string
  department?: string
  priority?: string
  tags?: string[]

  // Para debug - capturar dados brutos
  [key: string]: any
}

function normalizeUmblerData(data: UmblerWebhookData) {
  // Normalizar nome
  const nome = data.nome || data.name || data.customer_name || "Cliente não identificado"

  // Normalizar telefone
  const telefone = data.telefone || data.phone || data.customer_phone || "Não informado"

  // Normalizar status
  let status = data.status || data.state || "desconhecido"
  status = status.toLowerCase()

  // Mapear possíveis status do Umbler para nossos status
  const statusMap: { [key: string]: string } = {
    open: "em andamento",
    opened: "em andamento",
    pending: "em andamento",
    in_progress: "em andamento",
    closed: "finalizado",
    resolved: "finalizado",
    finished: "finalizado",
    completed: "finalizado",
    abandoned: "abandonado",
    timeout: "abandonado",
    cancelled: "abandonado",
  }

  const normalizedStatus = statusMap[status] || status

  // Normalizar respondeu
  const respondeu = data.respondeu ?? data.answered ?? true

  // Normalizar datas
  const data_inicio = data.data_inicio || data.start_time || data.created_at || new Date().toISOString()
  const data_fim = data.data_fim || data.end_time || data.finished_at || new Date().toISOString()

  // Normalizar mensagens
  let mensagens: Array<{ hora: string; conteudo: string }> = []

  if (data.mensagens && Array.isArray(data.mensagens)) {
    mensagens = data.mensagens.map((msg) => ({
      hora: msg.hora || msg.time || msg.timestamp || new Date().toLocaleTimeString(),
      conteudo: msg.conteudo || msg.content || msg.message || msg.text || "",
    }))
  } else if (data.messages && Array.isArray(data.messages)) {
    mensagens = data.messages.map((msg: any) => ({
      hora: msg.hora || msg.time || msg.timestamp || new Date().toLocaleTimeString(),
      conteudo: msg.conteudo || msg.content || msg.message || msg.text || JSON.stringify(msg),
    }))
  }

  // Normalizar mensagem principal
  const mensagem = data.mensagem || data.message || data.description || ""

  return {
    nome,
    telefone,
    respondeu,
    status: normalizedStatus,
    data_inicio,
    data_fim,
    mensagens,
    mensagem,
    // Dados extras para debug
    dados_originais: data,
  }
}

export async function POST(request: NextRequest) {
  console.log("--- INÍCIO DO PROCESSAMENTO DO WEBHOOK ---")
  try {
    // Logar cabeçalhos da requisição para debug
    console.log("HEADERS RECEBIDOS:", JSON.stringify(Object.fromEntries(request.headers.entries()), null, 2))

    // Parse do body da requisição
    const rawBody: UmblerWebhookData = await request.json()

    console.log("📥 Dados recebidos do Umbler:", JSON.stringify(rawBody, null, 2))

    // Normalizar os dados
    const normalizedData = normalizeUmblerData(rawBody)

    console.log("🔄 Dados normalizados:", JSON.stringify(normalizedData, null, 2))

    // Validação básica dos dados obrigatórios
    if (!normalizedData.nome || !normalizedData.telefone) {
      console.error("❌ ERRO: Campos obrigatórios ausentes:", {
        nome: normalizedData.nome,
        telefone: normalizedData.telefone,
      })
      return NextResponse.json(
        {
          error: "Campos obrigatórios: nome e telefone",
          received_data: rawBody,
        },
        { status: 400 },
      )
    }

    // Limpar a mensagem HTML
    const mensagemLimpa = cleanHtmlMessage(normalizedData.mensagem)
    console.log("🧹 Mensagem HTML limpa:", mensagemLimpa)

    // Criar cliente Supabase
    const supabase = createClient()
    console.log("🔗 Cliente Supabase criado.")

    // Inserir dados na tabela atendimentos
    console.log("💾 Tentando inserir dados no Supabase...")
    const { data, error } = await supabase
      .from("atendimentos")
      .insert({
        nome: normalizedData.nome,
        telefone: normalizedData.telefone,
        respondeu: normalizedData.respondeu,
        status: normalizedData.status,
        data_inicio: normalizedData.data_inicio,
        data_fim: normalizedData.data_fim,
        mensagens: normalizedData.mensagens,
        mensagem_limpa: mensagemLimpa,
      })
      .select()

    if (error) {
      console.error("❌ ERRO AO INSERIR NO SUPABASE:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      })
      return NextResponse.json(
        {
          error: "Erro interno do servidor ao salvar atendimento",
          details: error.message,
          received_data: rawBody,
        },
        { status: 500 },
      )
    }

    console.log("✅ Atendimento salvo com sucesso:", data?.[0])

    return NextResponse.json(
      {
        success: true,
        message: "Atendimento salvo com sucesso",
        data: data?.[0],
        normalized_data: normalizedData,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("💥 ERRO GERAL NO WEBHOOK:", error instanceof Error ? error.message : JSON.stringify(error))
    console.error("STACK TRACE:", error instanceof Error ? error.stack : "N/A")

    return NextResponse.json(
      {
        error: "Erro ao processar webhook",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  } finally {
    console.log("--- FIM DO PROCESSAMENTO DO WEBHOOK ---")
  }
}

// Método GET para testar se a rota está funcionando
export async function GET() {
  console.log("--- REQUISIÇÃO GET NO WEBHOOK ---")
  return NextResponse.json({
    message: "Webhook endpoint está funcionando",
    timestamp: new Date().toISOString(),
    url: "https://v0-next-js-backend-setup-kappa.vercel.app/api/webhook", // Verifique se esta URL está correta no seu deploy
    methods: ["POST", "GET"],
    expected_fields: {
      required: ["nome/name/customer_name", "telefone/phone/customer_phone"],
      optional: [
        "status",
        "respondeu/answered",
        "data_inicio/start_time",
        "data_fim/end_time",
        "mensagens/messages",
        "mensagem/message",
      ],
    },
  })
}
