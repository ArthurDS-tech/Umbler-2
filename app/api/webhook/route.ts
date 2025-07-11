import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

// Adicionar os cabeçalhos CORS e lidar com requisições OPTIONS

// Antes da função POST, adicione uma função OPTIONS
export async function OPTIONS() {
  const headers = {
    "Access-Control-Allow-Origin": "*", // Ou 'https://blog.grandeflorianopolis.autofacilpagamentos.com.br' para restringir
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  }
  return new NextResponse(null, { status: 200, headers })
}

// Webhook para receber dados do WordPress/Elementor
export async function POST(request: Request) {
  const supabase = createClient()
  const headers = {
    "Access-Control-Allow-Origin": "*", // Ou 'https://blog.grandeflorianopolis.autofacilpagamentos.com.br'
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  }

  try {
    const rawBody = await request.json()
    console.log("📊 Dados recebidos do WordPress:", JSON.stringify(rawBody, null, 2))

    // Normalizar dados do WordPress
    const wordpressData = {
      id: rawBody.id || crypto.randomUUID(),
      url_origem: rawBody.url || rawBody.page_url || "https://blog.grandeflorianopolis.autofacilpagamentos.com.br/",
      ip_visitante: rawBody.ip || rawBody.visitor_ip || "N/A",
      user_agent: rawBody.user_agent || rawBody.userAgent || "N/A",
      pagina_visitada: rawBody.page || rawBody.page_title || rawBody.title || "Página inicial",
      tempo_permanencia: rawBody.time_spent || rawBody.duration || 0,
      origem_trafego: rawBody.source || rawBody.traffic_source || rawBody.utm_source || "direto",
      campanha: rawBody.campaign || rawBody.utm_campaign || null,
      meio: rawBody.medium || rawBody.utm_medium || null,
      termo: rawBody.term || rawBody.utm_term || null,
      dispositivo: rawBody.device || rawBody.device_type || "desktop",
      navegador: rawBody.browser || "N/A",
      localizacao: rawBody.location || rawBody.city || "N/A",
      converteu: rawBody.converted || false,
      acao_realizada: rawBody.action || rawBody.event || "visualizacao",
      timestamp_visita: rawBody.timestamp || new Date().toISOString(),
      criado_em: new Date().toISOString(),
    }

    console.log("🔄 Dados WordPress normalizados:", JSON.stringify(wordpressData, null, 2))

    const { data, error } = await supabase.from("visitantes_site").insert([wordpressData])

    if (error) {
      console.error("❌ Erro ao inserir dados do WordPress:", error)
      return NextResponse.json({ error: error.message }, { status: 500, headers })
    }

    console.log("✅ Dados do WordPress inseridos com sucesso:", data)
    return NextResponse.json(
      {
        message: "Dados do WordPress recebidos e processados com sucesso!",
        data,
      },
      { status: 200, headers },
    )
  } catch (error) {
    console.error("🚨 Erro no processamento do webhook WordPress:", error)
    return NextResponse.json(
      {
        error: "Erro interno do servidor ao processar webhook do WordPress.",
      },
      { status: 500, headers },
    )
  }
}
