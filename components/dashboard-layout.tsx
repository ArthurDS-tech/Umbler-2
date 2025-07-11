"use client"

import type * as React from "react"
import Link from "next/link"
import { Moon, Sun, MessageCircle } from "lucide-react"
import { useTheme } from "next-themes"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50 dark:bg-gray-950">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b bg-white px-4 dark:border-gray-800 dark:bg-gray-900 md:px-6">
        <Link href="#" className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-50">
          <MessageCircle className="h-6 w-6" />
          <span>Atendimento</span>
        </Link>
        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="dark-mode-toggle"
              checked={theme === "dark"}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              aria-label="Toggle dark mode"
            />
            <Label htmlFor="dark-mode-toggle" className="sr-only">
              {theme === "dark" ? "Desativar Modo Escuro" : "Ativar Modo Escuro"}
            </Label>
            {theme === "dark" ? <Moon className="h-5 w-5 text-gray-400" /> : <Sun className="h-5 w-5 text-gray-600" />}
          </div>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">{children}</main>
    </div>
  )
}
