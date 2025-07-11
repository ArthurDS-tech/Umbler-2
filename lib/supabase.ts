import { createClient as createSupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Variáveis de ambiente do Supabase não configuradas")
}

export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

export type Database = {
  public: {
    Tables: {
      atendimentos: {
        Row: {
          id: string
          nome: string
          telefone: string
          respondeu: boolean
          status: string
          data_inicio: string
          data_fim: string
          mensagens: any
          mensagem_limpa: string
          criado_em: string
        }
        Insert: {
          id?: string
          nome: string
          telefone: string
          respondeu?: boolean
          status: string
          data_inicio: string
          data_fim: string
          mensagens?: any
          mensagem_limpa?: string
          criado_em?: string
        }
        Update: {
          id?: string
          nome?: string
          telefone?: string
          respondeu?: boolean
          status?: string
          data_inicio?: string
          data_fim?: string
          mensagens?: any
          mensagem_limpa?: string
          criado_em?: string
        }
      }
    }
  }
}
