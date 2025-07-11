#!/bin/bash

# Script para testar o webhook localmente
echo "🚀 Testando webhook do sistema de atendimento..."

# URL do seu endpoint de webhook (substitua pela sua URL de deploy ou localhost)
WEBHOOK_URL="http://localhost:3000/api/webhook" # Altere para sua URL de deploy Vercel se estiver testando o deploy

# Caminho para o arquivo JSON de exemplo
JSON_FILE="scripts/webhook-test-example.json"

# Verifica se o arquivo JSON existe
if [ ! -f "$JSON_FILE" ]; then
  echo "Erro: Arquivo JSON de exemplo não encontrado em $JSON_FILE"
  exit 1
fi

echo "Enviando requisição POST para: $WEBHOOK_URL"
echo "Usando dados do arquivo: $JSON_FILE"

# Envia a requisição POST usando curl
curl -X POST \
     -H "Content-Type: application/json" \
     -d "@$JSON_FILE" \
     "$WEBHOOK_URL"

echo "" # Nova linha para melhor formatação da saída
echo "Requisição enviada. Verifique os logs do seu servidor/Vercel para a resposta."

echo -e "\n\n"

# Teste 1: Atendimento finalizado
echo "📞 Teste 1: Atendimento finalizado"
curl -X POST $WEBHOOK_URL \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Santos",
    "telefone": "+5511987654321",
    "respondeu": true,
    "status": "finalizado",
    "data_inicio": "2024-01-15T14:30:00.000Z",
    "data_fim": "2024-01-15T14:45:00.000Z",
    "mensagens": [
      {
        "hora": "14:30:15",
        "conteudo": "Olá, preciso cancelar meu pedido"
      },
      {
        "hora": "14:32:20",
        "conteudo": "Claro! Qual é o número do seu pedido?"
      },
      {
        "hora": "14:33:45",
        "conteudo": "É o pedido #67890"
      },
      {
        "hora": "14:35:10",
        "conteudo": "Pedido cancelado com sucesso. O reembolso será processado em até 5 dias úteis."
      }
    ],
    "mensagem": "<div><p>Cliente <strong>Maria Santos</strong> solicitou cancelamento do pedido #67890.</p><br/><p>Motivo: <em>Mudança de endereço</em></p><p>Status: <span style=\"color: green;\">Cancelado e reembolso processado</span></p></div>"
  }'

echo -e "\n\n"

# Teste 2: Atendimento abandonado
echo "📞 Teste 2: Atendimento abandonado"
curl -X POST $WEBHOOK_URL \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "telefone": "+5511999888777",
    "respondeu": false,
    "status": "abandonado",
    "data_inicio": "2024-01-15T16:00:00.000Z",
    "data_fim": "2024-01-15T16:02:00.000Z",
    "mensagens": [
      {
        "hora": "16:00:15",
        "conteudo": "Oi, tudo bem?"
      }
    ],
    "mensagem": "<p>Cliente iniciou conversa mas não respondeu às perguntas do atendente.</p><p>Tempo de espera: <strong>2 minutos</strong></p>"
  }'

echo -e "\n\n"

# Teste 3: Atendimento em andamento
echo "📞 Teste 3: Atendimento em andamento"
curl -X POST $WEBHOOK_URL \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Ana Costa",
    "telefone": "+5511555444333",
    "respondeu": true,
    "status": "em andamento",
    "data_inicio": "2024-01-15T17:15:00.000Z",
    "data_fim": "2024-01-15T17:15:00.000Z",
    "mensagens": [
      {
        "hora": "17:15:30",
        "conteudo": "Preciso de ajuda com a instalação do produto"
      },
      {
        "hora": "17:16:45",
        "conteudo": "Claro! Vou te ajudar. Qual produto você comprou?"
      },
      {
        "hora": "17:17:20",
        "conteudo": "Comprei o roteador WiFi modelo XYZ-123"
      }
    ],
    "mensagem": "<div><h3>Suporte Técnico</h3><p>Cliente <strong>Ana Costa</strong> precisa de ajuda com instalação.</p><p>Produto: <em>Roteador WiFi XYZ-123</em></p><p>Status: <span style=\"color: orange;\">Aguardando resposta do técnico</span></p></div>"
  }'

echo -e "\n\n✅ Testes concluídos! Verifique o frontend em http://localhost:3000"
