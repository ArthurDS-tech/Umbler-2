# Sistema de Atendimento Integrado

Dashboard completo que integra dados do WordPress/Elementor com atendimentos da Umbler, fornecendo análise de conversão e métricas detalhadas.

## 🚀 Funcionalidades

### WordPress Integration
- **Tracking de Visitantes:** Monitora visitantes do site WordPress
- **Análise de Dispositivos:** Separa acessos mobile, tablet e desktop
- **Origem de Tráfego:** Rastreia UTM parameters e fontes de tráfego
- **Taxa de Conversão:** Calcula conversão de visitantes para atendimentos

### Umbler Integration
- **Atendimentos Completos:** Recebe todos os dados de atendimentos
- **Sistema de Tags:** Organiza atendimentos por tags da Umbler
- **Histórico de Mensagens:** Armazena conversas completas
- **Status Tracking:** Acompanha status (iniciado, em andamento, finalizado, abandonado)

### Dashboard Analytics
- **Métricas do Site:** Visitantes, dispositivos, conversão
- **Métricas de Atendimento:** Total, status, clientes únicos
- **Análise de Tags:** Estatísticas por tags da Umbler
- **Exportação de Dados:** CSV por períodos personalizados

## 🔗 URLs dos Webhooks

### Webhook da Umbler
\`\`\`
https://v0-next-js-backend-setup-kappa.vercel.app/api/webhook
\`\`\`

### Webhook do WordPress
\`\`\`
https://v0-next-js-backend-setup-kappa.vercel.app/api/wordpress-webhook
\`\`\`

## 📊 Configuração

### 1. Variáveis de Ambiente
Configure no Vercel:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Banco de Dados
Execute os scripts SQL:
\`\`\`bash
# Tabela principal de atendimentos
scripts/create-table.sql

# Tabela de visitantes do WordPress
scripts/create-wordpress-table.sql
\`\`\`

### 3. Configuração da Umbler
Configure o webhook na Umbler para enviar dados para:
`https://v0-next-js-backend-setup-kappa.vercel.app/api/webhook`

Certifique-se de incluir as tags nos dados enviados.

### 4. Configuração do WordPress
Adicione código JavaScript no seu site WordPress para enviar dados de visitantes:

\`\`\`javascript
// Adicione este código no footer do seu tema WordPress
function trackVisitor() {
    const data = {
        url: window.location.href,
        page_title: document.title,
        user_agent: navigator.userAgent,
        device_type: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop',
        timestamp: new Date().toISOString(),
        // Adicione mais campos conforme necessário
    };

    fetch('https://v0-next-js-backend-setup-kappa.vercel.app/api/wordpress-webhook', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }).catch(console.error);
}

// Chama a função quando a página carrega
document.addEventListener('DOMContentLoaded', trackVisitor);
\`\`\`

## 🧪 Testes

### Testar Webhook da Umbler
\`\`\`bash
chmod +x scripts/test-umbler-webhook.sh
./scripts/test-umbler-webhook.sh
\`\`\`

### Testar Webhook do WordPress
\`\`\`bash
chmod +x scripts/test-wordpress-webhook.sh
./scripts/test-wordpress-webhook.sh
\`\`\`

## 📈 Métricas Disponíveis

### Site WordPress
- Total de visitantes únicos
- Acessos por dispositivo (mobile/desktop)
- Taxa de conversão (visitantes → atendimentos)
- Origem de tráfego

### Atendimentos Umbler
- Total de atendimentos
- Status (em andamento, finalizado, abandonado)
- Clientes únicos
- Distribuição por tags

### Tags da Umbler
- Contagem por tag
- Análise de performance
- Categorização automática

## 🔧 Solução de Problemas

### Webhook não funciona
1. Verifique as variáveis de ambiente no Vercel
2. Confirme se as tabelas existem no Supabase
3. Verifique os logs no Vercel Functions
4. Teste manualmente com os scripts fornecidos

### Dados não aparecem
1. Execute os scripts de teste
2. Verifique se os webhooks estão configurados corretamente
3. Confirme se o Supabase está acessível
4. Verifique se as URLs dos webhooks estão corretas

## 📱 Responsividade

O dashboard é totalmente responsivo e funciona em:
- Desktop
- Tablet
- Mobile

## 🎨 Temas

Suporte completo a modo claro e escuro com alternância automática.
