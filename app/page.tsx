"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, Phone, MessageCircle, Clock, User } from "lucide-react"
import { createClient } from "@/lib/supabase"

interface Mensagem {
  hora: string
  conteudo: string
}

interface Atendimento {
  id: string
  nome: string
  telefone: string
  respondeu: boolean
  status: string
  data_inicio: string
  data_fim: string
  mensagens: Mensagem[]
  mensagem_limpa: string
  criado_em: string
}

export default function AtendimentosPage() {
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const fetchAtendimentos = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.from("atendimentos").select("*").order("criado_em", { ascending: false })

      if (error) {
        throw error
      }

      setAtendimentos(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar atendimentos")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAtendimentos()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "finalizado":
        return "bg-green-100 text-green-800"
      case "abandonado":
        return "bg-red-100 text-red-800"
      case "em andamento":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-lg">Carregando atendimentos...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sistema de Atendimento</h1>
            <p className="text-gray-600 mt-2">Visualize todos os atendimentos recebidos via webhook</p>
          </div>
          <Button onClick={fetchAtendimentos} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </Button>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-800">Erro: {error}</p>
            </CardContent>
          </Card>
        )}

        {atendimentos.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum atendimento encontrado</h3>
              <p className="text-gray-600">Os atendimentos aparecerão aqui quando forem recebidos via webhook.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {atendimentos.map((atendimento) => (
              <Card key={atendimento.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-blue-600" />
                      <div>
                        <CardTitle className="text-xl">{atendimento.nome}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">{atendimento.telefone}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(atendimento.status)}>{atendimento.status}</Badge>
                      {atendimento.respondeu && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          Respondeu
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Informações do Atendimento
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Início:</span>{" "}
                          <span className="font-medium">{formatDate(atendimento.data_inicio)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Fim:</span>{" "}
                          <span className="font-medium">{formatDate(atendimento.data_fim)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Criado em:</span>{" "}
                          <span className="font-medium">{formatDate(atendimento.criado_em)}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        Mensagem Principal
                      </h4>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {atendimento.mensagem_limpa || "Nenhuma mensagem"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {atendimento.mensagens && atendimento.mensagens.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-medium text-gray-900 mb-3">Histórico de Mensagens</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {atendimento.mensagens.map((msg, index) => (
                          <div key={index} className="bg-white border rounded-lg p-3">
                            <div className="flex justify-between items-start mb-1">
                              <span className="text-xs text-gray-500">{msg.hora}</span>
                            </div>
                            <p className="text-sm text-gray-700">{msg.conteudo}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
