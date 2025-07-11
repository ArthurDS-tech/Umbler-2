"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { Sun, Moon } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useTheme } from "next-themes"
import type * as React from "react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme()

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex min-h-screen w-full flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6 dark:bg-gray-900 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-50">Atendimento</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="dark-mode-toggle"
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                aria-label="Toggle dark mode"
                className="data-[state=checked]:bg-gray-700 data-[state=unchecked]:bg-gray-300"
              />
              <Label htmlFor="dark-mode-toggle" className="sr-only">
                {theme === "dark" ? (
                  <Moon className="h-5 w-5 text-gray-50" />
                ) : (
                  <Sun className="h-5 w-5 text-gray-900" />
                )}
              </Label>
            </div>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">{children}</main>
      </div>
    </ThemeProvider>
  )
}
