import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function cleanHtmlMessage(htmlString: string): string {
  if (!htmlString) return ""

  // Create a new DOMParser
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlString, "text/html")

  // Get the text content, which strips HTML tags
  let textContent = doc.body.textContent || ""

  // Replace common HTML entities
  textContent = textContent.replace(/&amp;/g, "&")
  textContent = textContent.replace(/&lt;/g, "<")
  textContent = textContent.replace(/&gt;/g, ">")
  textContent = textContent.replace(/&quot;/g, '"')
  textContent = textContent.replace(/&#039;/g, "'")
  textContent = textContent.replace(/&nbsp;/g, " ")

  // Trim whitespace
  return textContent.trim()
}
