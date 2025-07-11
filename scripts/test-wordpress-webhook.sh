#!/bin/bash

echo "🌐 Testando webhook do WordPress..."

# URL do webhook do WordPress
WORDPRESS_WEBHOOK_URL="https://v0-next-js-backend-setup-kappa.vercel.app/api/wordpress-webhook"

echo "Enviando dados de visitante do WordPress para: $WORDPRESS_WEBHOOK_URL"

# Teste 1: Visitante que converteu
echo "📊 Teste 1: Visitante que converteu"
curl -X POST $WORDPRESS_WEBHOOK_URL \
  -H "Content-Type: application/json" \
  -d '{
    "id": "visitor_001",
    "url": "https://blog.grandeflorianopolis.autofacilpagamentos.com.br/",
    "page_title": "Página Inicial - Auto Fácil Pagamentos",
    "visitor_ip": "192.168.1.100",
    "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "time_spent": 180,
    "traffic_source": "google",
    "utm_campaign": "campanha_janeiro_2024",
    "utm_medium": "cpc",
    "utm_term": "pagamentos automaticos",
    "device_type": "desktop",
    "browser": "Chrome",
    "city": "Florianópolis",
    "converted": true,
    "event": "contact_form_submit",
    "timestamp": "2024-01-15T14:30:00.000Z"
  }'

echo -e "\n\n"

# Teste 2: Visitante mobile que não converteu
echo "📱 Teste 2: Visitante mobile que não converteu"
curl -X POST $WORDPRESS_WEBHOOK_URL \
  -H "Content-Type: application/json" \
  -d '{
    "id": "visitor_002",
    "page_url": "https://blog.grandeflorianopolis.autofacilpagamentos.com.br/servicos/",
    "title": "Nossos Serviços",
    "ip": "10.0.0.50",
    "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)",
    "duration": 45,
    "source": "facebook",
    "campaign": "social_media_ads",
    "medium": "social",
    "device": "mobile",
    "browser": "Safari",
    "location": "São José",
    "converted": false,
    "action": "page_view"
  }'

echo -e "\n\n"

# Teste 3: Visitante tablet
echo "📱 Teste 3: Visitante tablet"
curl -X POST $WORDPRESS_WEBHOOK_URL \
  -H "Content-Type: application/json" \
  -d '{
    "visitor_ip": "172.16.0.25",
    "page": "Blog - Dicas de Pagamento",
    "time_spent": 120,
    "traffic_source": "direct",
    "device_type": "tablet",
    "browser": "Safari",
    "city": "Palhoça",
    "converted": false,
    "event": "scroll_75_percent"
  }'

echo -e "\n\n✅ Testes do WordPress concluídos!"
