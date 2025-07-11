-- Criar a tabela atendimentos no Supabase
CREATE TABLE IF NOT EXISTS atendimentos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome TEXT NOT NULL,
    telefone TEXT NOT NULL,
    respondeu BOOLEAN DEFAULT FALSE,
    status TEXT NOT NULL,
    data_inicio TIMESTAMP WITH TIME ZONE,
    data_fim TIMESTAMP WITH TIME ZONE,
    mensagens JSONB DEFAULT '[]'::jsonb,
    mensagem_limpa TEXT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_atendimentos_status ON atendimentos(status);
CREATE INDEX IF NOT EXISTS idx_atendimentos_criado_em ON atendimentos(criado_em DESC);
CREATE INDEX IF NOT EXISTS idx_atendimentos_telefone ON atendimentos(telefone);

-- Comentários para documentação
COMMENT ON TABLE atendimentos IS 'Tabela para armazenar dados de atendimentos recebidos via webhook';
COMMENT ON COLUMN atendimentos.id IS 'Identificador único do atendimento';
COMMENT ON COLUMN atendimentos.nome IS 'Nome do cliente';
COMMENT ON COLUMN atendimentos.telefone IS 'Telefone do cliente';
COMMENT ON COLUMN atendimentos.respondeu IS 'Se o cliente respondeu durante o atendimento';
COMMENT ON COLUMN atendimentos.status IS 'Status do atendimento (finalizado, abandonado, em andamento)';
COMMENT ON COLUMN atendimentos.data_inicio IS 'Data e hora de início do atendimento';
COMMENT ON COLUMN atendimentos.data_fim IS 'Data e hora de fim do atendimento';
COMMENT ON COLUMN atendimentos.mensagens IS 'Array JSON com histórico de mensagens';
COMMENT ON COLUMN atendimentos.mensagem_limpa IS 'Mensagem principal limpa (sem HTML)';
COMMENT ON COLUMN atendimentos.criado_em IS 'Data e hora de criação do registro';
