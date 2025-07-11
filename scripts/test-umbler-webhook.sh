#!/bin/bash

echo "💬 Testando webhook da Umbler com tags..."

# URL do webhook da Umbler
UMBLER_WEBHOOK_URL="https://v0-next-js-backend-setup-kappa.vercel.app/api/webhook"

echo "Enviando dados da Umbler para: $UMBLER_WEBHOOK_URL"

# Teste 1: Atendimento com tags
echo "🏷️ Teste 1: Atendimento com tags"
curl -X POST $UMBLER_WEBHOOK_URL \
  -H "Content-Type: application/json" \
  -d '{
    "id": "chat_12345",
    "contact": {
      "name": "Maria Silva",
      "phoneNumber": "+5548999887766"
    },
    "status": "finalizado",
    "tags": ["vip", "pagamento", "resolvido", "satisfeito"],
    "createdAt": "2024-01-15T14:30:00Z",
    "endedAt": "2024-01-15T14:45:00Z",
    "lastMessage": {
      "content": "Obrigada pelo atendimento! Problema resolvido."
    },
    "messages": [
      {
        "createdAt": "2024-01-15T14:30:00Z",
        "content": "Olá, preciso de ajuda com meu pagamento"
      },
      {
        "createdAt": "2024-01-15T14:35:00Z",
        "content": "Claro! Vou verificar sua conta"
      },
      {
        "createdAt": "2024-01-15T14:40:00Z",
        "content": "Encontrei o problema, já foi corrigido"
      },
      {
        "createdAt": "2024-01-15T14:45:00Z",
        "content": "Obrigada pelo atendimento! Problema resolvido."
      }
    ]
  }'

echo -e "\n\n"

# Teste 2: Atendimento em andamento com tags
echo "⏳ Teste 2: Atendimento em andamento"
curl -X POST $UMBLER_WEBHOOK_URL \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": "chat_67890",
    "contact": {
      "name": "João Santos",
      "phoneNumber": "+5548888777666"
    },
    "status": "em andamento",
    "tags": ["novo_cliente", "duvida", "urgente"],
    "createdAt": "2024-01-15T16:00:00Z",
    "lastMessage": {
      "content": "Aguardando resposta do suporte técnico..."
    },
    "messages": [
      {
        "createdAt": "2024-01-15T16:00:00Z",
        "content": "Preciso de ajuda urgente com minha conta"
      },
      {
        "createdAt": "2024-01-15T16:05:00Z",
        "content": "Entendi, vou encaminhar para o suporte técnico"
      }
    ]
  }'

echo -e "\n\n"

# Teste 3: Atendimento abandonado
echo "❌ Teste 3: Atendimento abandonado"
curl -X POST $UMBLER_WEBHOOK_URL \
  -H "Content-Type: application/json" \
  -d '{
    "conversation": {
      "contact": {
        "name": "Ana Costa",
        "phoneNumber": "+5548777666555"
      },
      "status": "abandonado",
      "tags": ["sem_resposta", "timeout"],
      "createdAt": "2024-01-15T18:00:00Z",
      "endedAt": "2024-01-15T18:05:00Z",
      "messages": [
        {
          "createdAt": "2024-01-15T18:00:00Z",
          "content": "Oi, alguém pode me ajudar?"
        }
      ]
    }
  }'

echo -e "\n\n✅ Testes da Umbler concluídos!"
