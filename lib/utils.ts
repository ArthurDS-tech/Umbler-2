import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Limpa tags HTML e códigos especiais de uma string
 * @param htmlString - String que pode conter HTML
 * @returns String limpa apenas com texto
 */
export function cleanHtmlMessage(htmlString: string): string {
  if (!htmlString) return ""

  // Remove tags HTML
  let cleaned = htmlString.replace(/<[^>]*>/g, "")

  // Decodifica entidades HTML comuns
  const htmlEntities: { [key: string]: string } = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&nbsp;": " ",
    "&apos;": "'",
    "&cent;": "¢",
    "&pound;": "£",
    "&yen;": "¥",
    "&euro;": "€",
    "&copy;": "©",
    "&reg;": "®",
  }

  // Substitui entidades HTML
  Object.keys(htmlEntities).forEach((entity) => {
    const regex = new RegExp(entity, "g")
    cleaned = cleaned.replace(regex, htmlEntities[entity])
  })

  // Remove quebras de linha excessivas e espaços extras
  cleaned = cleaned
    .replace(/\n\s*\n/g, "\n") // Remove quebras de linha duplas
    .replace(/\s+/g, " ") // Remove espaços extras
    .trim() // Remove espaços no início e fim

  return cleaned
}
