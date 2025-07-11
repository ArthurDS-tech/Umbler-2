"use client"

import * as React from "react"

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768) // Tailwind's 'md' breakpoint is 768px
    }

    checkIsMobile() // Check on initial render

    window.addEventListener("resize", checkIsMobile) // Add event listener for resize

    return () => {
      window.removeEventListener("resize", checkIsMobile) // Clean up on unmount
    }
  }, [])

  return isMobile
}
