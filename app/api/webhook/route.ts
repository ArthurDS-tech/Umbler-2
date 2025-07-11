import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
import { cleanHtmlMessage } from "@/lib/utils"

// Helper function to normalize incoming webhook data from Umbler
function normalizeUmblerData(rawBody: any) {
  let nome = "Cliente não identificado"
  let telefone = "Não informado"
  let mensagem = "Mensagem não disponível"
  let status = "desconhecido"
  let data_inicio = new Date().toISOString()
  let data_fim = null
  let mensagens: { hora: string; conteudo: string }[] = []
  let tags: string[] = []
  const id = rawBody.id || rawBody.chatId || rawBody.conversationId || crypto.randomUUID()

  // Extract name
  if (rawBody.name) nome = rawBody.name
  else if (rawBody.customer_name) nome = rawBody.customer_name
  else if (rawBody.contact && rawBody.contact.name) nome = rawBody.contact.name
  else if (rawBody.chat && rawBody.chat.contact && rawBody.chat.contact.name) nome = rawBody.chat.contact.name
  else if (rawBody.conversation && rawBody.conversation.contact && rawBody.conversation.contact.name)
    nome = rawBody.conversation.contact.name

  // Extract phone
  if (rawBody.phone) telefone = rawBody.phone
  else if (rawBody.customer_phone) telefone = rawBody.customer_phone
  else if (rawBody.contact && rawBody.contact.phoneNumber) telefone = rawBody.contact.phoneNumber
  else if (rawBody.chat && rawBody.chat.contact && rawBody.chat.contact.phoneNumber)
    telefone = rawBody.chat.contact.phoneNumber
  else if (rawBody.conversation && rawBody.conversation.contact && rawBody.conversation.contact.phoneNumber)
    telefone = rawBody.conversation.contact.phoneNumber

  // Extract message
  if (rawBody.message) mensagem = rawBody.message
  else if (rawBody.description) mensagem = rawBody.description
  else if (rawBody.chat && rawBody.chat.lastMessage && rawBody.chat.lastMessage.content)
    mensagem = rawBody.chat.lastMessage.content
  else if (rawBody.conversation && rawBody.conversation.lastMessage && rawBody.conversation.lastMessage.content)
    mensagem = rawBody.conversation.lastMessage.content
  else if (rawBody.messages && rawBody.messages.length > 0) {
    const lastMessage = rawBody.messages[rawBody.messages.length - 1]
    if (lastMessage.content) mensagem = lastMessage.content
  }

  // Extract status
  if (rawBody.status) status = rawBody.status
  else if (rawBody.chat && rawBody.chat.status) status = rawBody.chat.status
  else if (rawBody.conversation && rawBody.conversation.status) status = rawBody.conversation.status

  // Extract tags from Umbler
  if (rawBody.tags && Array.isArray(rawBody.tags)) {
    tags = rawBody.tags
  } else if (rawBody.chat && rawBody.chat.tags && Array.isArray(rawBody.chat.tags)) {
    tags = rawBody.chat.tags
  } else if (rawBody.conversation && rawBody.conversation.tags && Array.isArray(rawBody.conversation.tags)) {
    tags = rawBody.conversation.tags
  } else if (rawBody.labels && Array.isArray(rawBody.labels)) {
    tags = rawBody.labels
  }

  // Extract timestamps
  if (rawBody.createdAt) data_inicio = new Date(rawBody.createdAt).toISOString()
  else if (rawBody.chat && rawBody.chat.createdAt) data_inicio = new Date(rawBody.chat.createdAt).toISOString()
  else if (rawBody.conversation && rawBody.conversation.createdAt)
    data_inicio = new Date(rawBody.conversation.createdAt).toISOString()

  if (rawBody.endedAt) data_fim = new Date(rawBody.endedAt).toISOString()
  else if (rawBody.chat && rawBody.chat.endedAt) data_fim = new Date(rawBody.chat.endedAt).toISOString()
  else if (rawBody.conversation && rawBody.conversation.endedAt)
    data_fim = new Date(rawBody.conversation.endedAt).toISOString()

  // Extract messages history
  if (rawBody.messages && Array.isArray(rawBody.messages)) {
    mensagens = rawBody.messages.map((msg: any) => ({
      hora: msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString("pt-BR") : "N/A",
      conteudo: msg.content || "Mensagem vazia",
    }))
  } else if (rawBody.chat && rawBody.chat.messages && Array.isArray(rawBody.chat.messages)) {
    mensagens = rawBody.chat.messages.map((msg: any) => ({
      hora: msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString("pt-BR") : "N/A",
      conteudo: msg.content || "Mensagem vazia",
    }))
  } else if (rawBody.conversation && rawBody.conversation.messages && Array.isArray(rawBody.conversation.messages)) {
    mensagens = rawBody.conversation.messages.map((msg: any) => ({
      hora: msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString("pt-BR") : "N/A",
      conteudo: msg.content || "Mensagem vazia",
    }))
  } else {
    mensagens = [{ hora: new Date().toLocaleTimeString("pt-BR"), conteudo: mensagem }]
  }

  return {
    id,
    nome,
    telefone,
    status,
    data_inicio,
    data_fim,
    mensagens,
    tags,
    mensagem_limpa: cleanHtmlMessage(mensagem),
    criado_em: new Date().toISOString(),
  }
}

export async function POST(request: Request) {
  const supabase = createClient()

  try {
    const rawBody = await request.json()
    console.log("📥 Dados recebidos da Umbler:", JSON.stringify(rawBody, null, 2))

    const normalizedData = normalizeUmblerData(rawBody)
    console.log("🔄 Dados normalizados:", JSON.stringify(normalizedData, null, 2))

    const { data, error } = await supabase.from("atendimentos").insert([normalizedData])

    if (error) {
      console.error("❌ Erro ao inserir no Supabase:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("✅ Dados inseridos com sucesso no Supabase:", data)
    return NextResponse.json(
      {
        message: "Webhook da Umbler recebido e processado com sucesso!",
        data,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("🚨 Erro no processamento do webhook da Umbler:", error)
    return NextResponse.json(
      {
        error: "Erro interno do servidor ao processar webhook da Umbler.",
      },
      { status: 500 },
    )
  }
}
