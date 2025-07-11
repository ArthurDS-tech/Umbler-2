-- Tabela para armazenar dados dos visitantes do site WordPress
CREATE TABLE public.visitantes_site (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    url_origem text,
    ip_visitante text,
    user_agent text,
    pagina_visitada text,
    tempo_permanencia integer DEFAULT 0,
    origem_trafego text,
    campanha text,
    meio text,
    termo text,
    dispositivo text,
    navegador text,
    localizacao text,
    converteu boolean DEFAULT false,
    acao_realizada text,
    timestamp_visita timestamp with time zone,
    criado_em timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT visitantes_site_pkey PRIMARY KEY (id)
);

-- Atualizar tabela de atendimentos para incluir tags
ALTER TABLE public.atendimentos ADD COLUMN IF NOT EXISTS tags jsonb;
