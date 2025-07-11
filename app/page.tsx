"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  RefreshCw,
  MessageCircle,
  Users,
  TrendingUp,
  TrendingDown,
  Download,
  CalendarDays,
  Eye,
  Target,
  Tag,
  Globe,
  Smartphone,
} from "lucide-react"
import { createClient } from "@/lib/supabase"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

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
  tags: string[]
  mensagem_limpa: string
  criado_em: string
}

interface VisitanteSite {
  id: string
  url_origem: string
  pagina_visitada: string
  tempo_permanencia: number
  origem_trafego: string
  dispositivo: string
  converteu: boolean
  acao_realizada: string
  timestamp_visita: string
  criado_em: string
}

const ITEMS_PER_PAGE_DEFAULT = 10

export default function AtendimentosPage() {
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([])
  const [visitantes, setVisitantes] = useState<VisitanteSite[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Métricas de atendimentos
  const [totalAtendimentos, setTotalAtendimentos] = useState<number>(0)
  const [atendimentosEmAndamento, setAtendimentosEmAndamento] = useState<number>(0)
  const [atendimentosFinalizados, setAtendimentosFinalizados] = useState<number>(0)
  const [atendimentosAbandonados, setAtendimentosAbandonados] = useState<number>(0)
  const [totalClientesUnicos, setTotalClientesUnicos] = useState<number>(0)

  // Métricas do site
  const [totalVisitantes, setTotalVisitantes] = useState<number>(0)
  const [visitantesMobile, setVisitantesMobile] = useState<number>(0)
  const [visitantesDesktop, setVisitantesDesktop] = useState<number>(0)
  const [taxaConversao, setTaxaConversao] = useState<number>(0)

  // Métricas de tags
  const [tagsStats, setTagsStats] = useState<{ [key: string]: number }>({})

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_DEFAULT)

  const supabase = useMemo(() => createClient(), [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Buscar atendimentos
      const { data: atendimentosData, error: atendimentosError } = await supabase
        .from("atendimentos")
        .select("*")
        .order("criado_em", { ascending: false })

      if (atendimentosError) {
        throw atendimentosError
      }

      // Buscar visitantes do site
      const { data: visitantesData, error: visitantesError } = await supabase
        .from("visitantes_site")
        .select("*")
        .order("criado_em", { ascending: false })

      if (visitantesError) {
        console.warn("Tabela visitantes_site não encontrada, criando dados de exemplo...")
        setVisitantes([])
      } else {
        setVisitantes(visitantesData || [])
      }

      setAtendimentos(atendimentosData || [])

      // Calcular métricas de atendimentos
      const total = atendimentosData?.length || 0
      const emAndamento = atendimentosData?.filter((a) => a.status.toLowerCase() === "em andamento").length || 0
      const finalizados = atendimentosData?.filter((a) => a.status.toLowerCase() === "finalizado").length || 0
      const abandonados = atendimentosData?.filter((a) => a.status.toLowerCase() === "abandonado").length || 0
      const uniquePhones = new Set(atendimentosData?.map((a) => a.telefone)).size || 0

      setTotalAtendimentos(total)
      setAtendimentosEmAndamento(emAndamento)
      setAtendimentosFinalizados(finalizados)
      setAtendimentosAbandonados(abandonados)
      setTotalClientesUnicos(uniquePhones)

      // Calcular métricas do site
      const totalVisitas = visitantesData?.length || 0
      const mobile =
        visitantesData?.filter(
          (v) => v.dispositivo?.toLowerCase().includes("mobile") || v.dispositivo?.toLowerCase().includes("tablet"),
        ).length || 0
      const desktop = totalVisitas - mobile
      const conversao = totalVisitas > 0 ? (total / totalVisitas) * 100 : 0

      setTotalVisitantes(totalVisitas)
      setVisitantesMobile(mobile)
      setVisitantesDesktop(desktop)
      setTaxaConversao(conversao)

      // Calcular estatísticas de tags
      const tagsCount: { [key: string]: number } = {}
      atendimentosData?.forEach((atendimento) => {
        if (atendimento.tags && Array.isArray(atendimento.tags)) {
          atendimento.tags.forEach((tag: string) => {
            tagsCount[tag] = (tagsCount[tag] || 0) + 1
          })
        }
      })
      setTagsStats(tagsCount)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar dados")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "finalizado":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "abandonado":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "em andamento":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  const getTagColor = (tag: string) => {
    const colors = [
      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
      "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
    ]
    const index = tag.length % colors.length
    return colors[index]
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    try {
      return new Date(dateString).toLocaleString("pt-BR")
    } catch {
      return "Data inválida"
    }
  }

  const safeAtendimentos = atendimentos || []
  const totalPages = Math.ceil(safeAtendimentos.length / itemsPerPage)
  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    return safeAtendimentos.slice(indexOfFirstItem, indexOfLastItem)
  }, [safeAtendimentos, currentPage, itemsPerPage])

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const handleShowAll = () => {
    setItemsPerPage(safeAtendimentos.length)
    setCurrentPage(1)
  }

  const handleShowPaginated = () => {
    setItemsPerPage(ITEMS_PER_PAGE_DEFAULT)
    setCurrentPage(1)
  }

  const exportToCsv = (data: Atendimento[], filename: string) => {
    if (data.length === 0) {
      alert("Não há dados para exportar no período selecionado.")
      return
    }

    const headers = [
      "ID",
      "Nome",
      "Telefone",
      "Respondeu",
      "Status",
      "Tags",
      "Data Início",
      "Data Fim",
      "Mensagem Limpa",
      "Criado Em",
      "Histórico de Mensagens",
    ]
    const rows = data.map((item) => [
      item.id,
      item.nome,
      item.telefone,
      item.respondeu ? "Sim" : "Não",
      item.status,
      Array.isArray(item.tags) ? item.tags.join(", ") : "",
      formatDate(item.data_inicio),
      formatDate(item.data_fim),
      `"${item.mensagem_limpa.replace(/"/g, '""')}"`,
      formatDate(item.criado_em),
      `"${JSON.stringify(item.mensagens).replace(/"/g, '""')}"`,
    ])

    const csvContent = [headers.join(","), ...rows.map((e) => e.join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", filename)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleExport = (timeframe: string) => {
    let filteredData = safeAtendimentos
    const now = new Date()

    if (timeframe !== "all") {
      const startDate = new Date()
      switch (timeframe) {
        case "1day":
          startDate.setDate(now.getDate() - 1)
          break
        case "1week":
          startDate.setDate(now.getDate() - 7)
          break
        case "1month":
          startDate.setMonth(now.getMonth() - 1)
          break
        case "3months":
          startDate.setMonth(now.getMonth() - 3)
          break
        case "6months":
          startDate.setMonth(now.getMonth() - 6)
          break
        case "12months":
          startDate.setFullYear(now.getFullYear() - 1)
          break
      }
      filteredData = safeAtendimentos.filter((a) => new Date(a.criado_em) >= startDate)
    }

    const filename = `atendimentos_${timeframe}_${now.toISOString().split("T")[0]}.csv`
    exportToCsv(filteredData, filename)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <RefreshCw className="h-12 w-12 animate-spin text-blue-600 dark:text-blue-400" />
          <span className="mt-4 text-xl text-gray-700 dark:text-gray-300">Carregando dados...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Dashboard Integrado</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">WordPress + Umbler - Análise completa de conversão</p>
          </div>
          <div className="flex gap-4">
            <Button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 text-sm">
              <RefreshCw className="h-4 w-4" />
              Atualizar Dados
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 px-4 py-2 text-sm bg-transparent">
                  <Download className="h-4 w-4" />
                  Exportar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Exportar por Período</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleExport("1day")}>
                  <CalendarDays className="mr-2 h-4 w-4" /> 1 Dia
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("1week")}>
                  <CalendarDays className="mr-2 h-4 w-4" /> 1 Semana
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("1month")}>
                  <CalendarDays className="mr-2 h-4 w-4" /> 1 Mês
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("all")}>
                  <CalendarDays className="mr-2 h-4 w-4" /> Todo o Tempo
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {error && (
          <Card className="mb-6 border-red-300 bg-red-100 shadow-sm dark:bg-red-950 dark:border-red-700">
            <CardContent className="p-4 text-red-800 font-medium dark:text-red-200">
              Erro ao carregar dados: {error}
            </CardContent>
          </Card>
        )}

        {/* Métricas do Site WordPress */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-4">Métricas do Site</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Total de Visitantes
              </CardTitle>
              <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{totalVisitantes}</div>
              <p className="text-xs text-muted-foreground mt-1">Visitantes únicos do site</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Dispositivo Mobile</CardTitle>
              <Smartphone className="h-4 w-4 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">{visitantesMobile}</div>
              <p className="text-xs text-muted-foreground mt-1">Acessos via mobile/tablet</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Dispositivo Desktop
              </CardTitle>
              <Globe className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{visitantesDesktop}</div>
              <p className="text-xs text-muted-foreground mt-1">Acessos via desktop</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Taxa de Conversão</CardTitle>
              <Target className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">{taxaConversao.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground mt-1">Site → Atendimento</p>
            </CardContent>
          </Card>
        </div>

        {/* Métricas de Atendimentos */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-4">Métricas de Atendimentos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Total de Atendimentos
              </CardTitle>
              <MessageCircle className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAtendimentos}</div>
              <p className="text-xs text-muted-foreground mt-1">Todos os atendimentos</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Em Andamento</CardTitle>
              <TrendingUp className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{atendimentosEmAndamento}</div>
              <p className="text-xs text-muted-foreground mt-1">Atualmente ativos</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Finalizados</CardTitle>
              <TrendingDown className="h-4 w-4 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">{atendimentosFinalizados}</div>
              <p className="text-xs text-muted-foreground mt-1">Concluídos com sucesso</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Clientes Únicos</CardTitle>
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClientesUnicos}</div>
              <p className="text-xs text-muted-foreground mt-1">Número de clientes distintos</p>
            </CardContent>
          </Card>
        </div>

        {/* Métricas de Tags */}
        {Object.keys(tagsStats).length > 0 && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-4">Tags dos Atendimentos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {Object.entries(tagsStats)
                .slice(0, 8)
                .map(([tag, count]) => (
                  <Card key={tag} className="bg-white shadow-sm dark:bg-gray-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                        {tag}
                      </CardTitle>
                      <Tag className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">{count}</div>
                      <p className="text-xs text-muted-foreground mt-1">Atendimentos com esta tag</p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </>
        )}

        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-6">Detalhes dos Atendimentos</h2>
        {safeAtendimentos.length === 0 ? (
          <Card className="bg-white shadow-sm dark:bg-gray-800">
            <CardContent className="p-8 text-center">
              <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-gray-50 mb-2">
                Nenhum atendimento encontrado
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Os atendimentos aparecerão aqui quando forem recebidos via webhook.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="overflow-x-auto rounded-md border dark:border-gray-700">
              <Table className="w-full">
                <TableHeader className="bg-gray-100 dark:bg-gray-800">
                  <TableRow>
                    <TableHead className="w-[80px] text-gray-700 dark:text-gray-300">ID</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Nome</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Telefone</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Tags</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Mensagem</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Início</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Histórico</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white dark:bg-gray-900">
                  {currentItems.map((atendimento) => (
                    <TableRow key={atendimento.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <TableCell className="font-medium text-gray-900 dark:text-gray-50">
                        {atendimento.id.substring(0, 4)}...
                      </TableCell>
                      <TableCell className="text-gray-800 dark:text-gray-200">{atendimento.nome || "N/A"}</TableCell>
                      <TableCell className="text-gray-800 dark:text-gray-200">
                        {atendimento.telefone || "N/A"}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(atendimento.status)}>{atendimento.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {atendimento.tags && Array.isArray(atendimento.tags) ? (
                            atendimento.tags.slice(0, 2).map((tag, idx) => (
                              <Badge key={idx} className={getTagColor(tag)} variant="outline">
                                {tag}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400 text-xs">Sem tags</span>
                          )}
                          {atendimento.tags && atendimento.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{atendimento.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-800 dark:text-gray-200 max-w-[200px] truncate">
                        {atendimento.mensagem_limpa || "N/A"}
                      </TableCell>
                      <TableCell className="text-gray-800 dark:text-gray-200">
                        {formatDate(atendimento.data_inicio)}
                      </TableCell>
                      <TableCell>
                        {atendimento.mensagens && atendimento.mensagens.length > 0 ? (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" size="sm">
                                Ver ({atendimento.mensagens.length})
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-4">
                              <h4 className="font-semibold text-gray-900 mb-2 dark:text-gray-50">
                                Histórico de Mensagens
                              </h4>
                              <ScrollArea className="h-48 pr-4">
                                <div className="space-y-2">
                                  {atendimento.mensagens.map((msg, idx) => (
                                    <div key={idx} className="border-b pb-2 last:border-b-0">
                                      <p className="text-xs text-gray-500 dark:text-gray-400">{msg.hora}</p>
                                      <p className="text-sm text-gray-700 dark:text-gray-300">{msg.conteudo}</p>
                                    </div>
                                  ))}
                                </div>
                              </ScrollArea>
                            </PopoverContent>
                          </Popover>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400">N/A</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-8 flex justify-center items-center gap-4">
              {itemsPerPage === safeAtendimentos.length ? (
                <Button onClick={handleShowPaginated} variant="outline">
                  Mostrar Paginação
                </Button>
              ) : (
                <Button onClick={handleShowAll} variant="outline">
                  Mostrar Todos ({safeAtendimentos.length})
                </Button>
              )}

              {itemsPerPage !== safeAtendimentos.length && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (currentPage > 1) paginate(currentPage - 1)
                        }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          isActive={page === currentPage}
                          onClick={(e) => {
                            e.preventDefault()
                            paginate(page)
                          }}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (currentPage < totalPages) paginate(currentPage + 1)
                        }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
