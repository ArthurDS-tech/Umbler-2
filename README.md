# Sistema de Atendimento

Este é um dashboard para gerenciar atendimentos recebidos via webhook, com foco em integração com plataformas como a Umbler.

## Funcionalidades

- **Dashboard de Métricas:** Visão geral de atendimentos totais, em andamento, finalizados e clientes únicos.
- **Tabela de Atendimentos:** Detalhes dos atendimentos recentes com paginação e histórico de mensagens.
- **Exportação de Dados:** Exporte dados de atendimentos para CSV por diferentes períodos.
- **Modo Escuro:** Suporte a tema claro e escuro.
- **Webhook Integrado:** Recebe e processa dados de webhooks (ex: Umbler) e os salva no Supabase.

## Tecnologias Utilizadas

- Next.js (App Router)
- React
- Tailwind CSS
- shadcn/ui
- Supabase (para banco de dados)

## Configuração

### 1. Variáveis de Ambiente

Certifique-se de ter as seguintes variáveis de ambiente configuradas no seu projeto Vercel ou arquivo `.env.local`:

- `SUPABASE_URL`: URL do seu projeto Supabase.
- `SUPABASE_ANON_KEY`: Chave `anon` pública do seu projeto Supabase.
- `SUPABASE_SERVICE_ROLE_KEY`: Chave `service_role` do seu projeto Supabase (usada em Server Actions/API Routes).

### 2. Configuração do Banco de Dados (Supabase)

Execute o script SQL em `scripts/create-table.sql` no seu banco de dados Supabase para criar a tabela `atendimentos`.

\`\`\`sql
CREATE TABLE public.atendimentos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nome text,
    telefone text,
    respondeu boolean DEFAULT true,
    status text,
    data_inicio timestamp with time zone,
    data_fim timestamp with time zone,
    mensagens jsonb,
    mensagem_limpa text,
    criado_em timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT atendimentos_pkey PRIMARY KEY (id)
);
\`\`\`

### 3. Configuração do Webhook

Configure o webhook na sua plataforma (ex: Umbler) para enviar requisições `POST` para o endpoint:

`[SUA_URL_DE_DEPLOY]/api/webhook`

Substitua `[SUA_URL_DE_DEPLOY]` pela URL do seu deploy no Vercel (ex: `https://seu-projeto.vercel.app`).

### 4. Executando Localmente

1. Clone o repositório.
2. Instale as dependências: `npm install` ou `yarn install`
3. Inicie o servidor de desenvolvimento: `npm run dev` ou `yarn dev`

## Deploy

Este projeto é otimizado para deploy na Vercel. Basta conectar seu repositório GitHub à Vercel, e ele será automaticamente deployado.

## Solução de Problemas

Se você não estiver vendo os dados na tabela, verifique os logs do seu deploy no Vercel para o endpoint `/api/webhook`. Eles fornecerão informações detalhadas sobre os dados recebidos e quaisquer erros de inserção no Supabase.
