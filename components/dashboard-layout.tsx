"use client"

import type React from "react"
import { useTheme } from "next-themes"
import { Search, Sun, Moon, MessageCircle } from "lucide-react" // Adicionar MessageCircle para o logo

import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label" // Manter Label para acessibilidade

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 dark:bg-gray-950">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-4 sm:px-6 dark:bg-gray-900 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <span className="text-lg font-semibold text-gray-900 dark:text-gray-50">Atendimento</span>
        </div>
        <div className="relative flex-1 md:grow-0 ml-auto">
          {" "}
          {/* ml-auto para empurrar para a direita */}
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar atendimentos..."
            className="w-full rounded-lg bg-gray-100 pl-8 md:w-[200px] lg:w-[336px] dark:bg-gray-800 dark:text-gray-50 dark:placeholder:text-gray-400"
          />
        </div>
        <div className="flex items-center gap-2 ml-4">
          {" "}
          {/* Adicionar margem à esquerda */}
          {theme === "dark" ? (
            <Moon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          ) : (
            <Sun className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          )}
          <Label htmlFor="dark-mode-toggle" className="sr-only">
            Alternar modo escuro
          </Label>
          <Switch
            id="dark-mode-toggle"
            checked={theme === "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            aria-label="Alternar modo escuro"
          />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-950 overflow-auto">{children}</main>
    </div>
  )
}
