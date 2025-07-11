import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
import { cleanHtmlMessage } from "@/lib/utils"

interface WebhookData {
  nome: string
  telefone: string
  respondeu: boolean
  status: string
  data_inicio: string
  data_fim: string
  mensagens: Array<{
    hora: string
    conteudo: string
  }>
  mensagem: string
}

export async function POST(request: NextRequest) {
  try {
    // Parse do body da requisição
    const body: WebhookData = await request.json()

    // Validação básica dos dados obrigatórios
    if (!body.nome || !body.telefone || !body.status) {
      return NextResponse.json({ error: "Campos obrigatórios: nome, telefone, status" }, { status: 400 })
    }

    // Limpar a mensagem HTML
    const mensagemLimpa = cleanHtmlMessage(body.mensagem || "")

    // Criar cliente Supabase
    const supabase = createClient()

    // Inserir dados na tabela atendimentos
    const { data, error } = await supabase
      .from("atendimentos")
      .insert({
        nome: body.nome,
        telefone: body.telefone,
        respondeu: body.respondeu || false,
        status: body.status,
        data_inicio: body.data_inicio,
        data_fim: body.data_fim,
        mensagens: body.mensagens || [],
        mensagem_limpa: mensagemLimpa,
      })
      .select()

    if (error) {
      console.error("Erro ao inserir no Supabase:", error)
      return NextResponse.json({ error: "Erro interno do servidor", details: error.message }, { status: 500 })
    }

    return NextResponse.json(
      {
        success: true,
        message: "Atendimento salvo com sucesso",
        data: data?.[0],
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Erro no webhook:", error)

    return NextResponse.json(
      {
        error: "Erro ao processar webhook",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}

// Método GET para testar se a rota está funcionando
export async function GET() {
  return NextResponse.json({
    message: "Webhook endpoint está funcionando",
    timestamp: new Date().toISOString(),
  })
}
