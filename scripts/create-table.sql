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
