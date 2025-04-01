"use client"
import { Button } from "@/components/ui/button"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useState } from "react"

export function TemperatureToggle() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const [isChanging, setIsChanging] = useState(false)

  const unit = searchParams.get("unit") || "c"

  const toggleUnit = () => {
    setIsChanging(true)

    // Create a new URLSearchParams object
    const params = new URLSearchParams(searchParams.toString())

    // Get the current location if it exists
    const location = params.get("location")

    // Clear all params and set the ones we need
    params.delete("unit")
    params.set("unit", unit === "c" ? "f" : "c")

    // Make sure we preserve the location parameter if it exists
    if (location) {
      params.set("location", location)
    }

    // Navigate to the new URL
    router.push(`${pathname}?${params.toString()}`)

    // Reset changing state after a short delay
    setTimeout(() => setIsChanging(false), 500)
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleUnit}
      disabled={isChanging}
      className="glass-button text-xs rounded-full h-8 px-3 hover:bg-white/20 dark:hover:bg-slate-800/40 group"
    >
      <span className={`transition-all duration-300 ${unit === "c" ? "opacity-100" : "opacity-50"}`}>°C</span>
      <span className="mx-1 text-muted-foreground">/</span>
      <span className={`transition-all duration-300 ${unit === "f" ? "opacity-100" : "opacity-50"}`}>°F</span>

      {/* Animated indicator */}
      <span
        className={`absolute bottom-1 h-0.5 bg-sky-500 dark:bg-sky-400 transition-all duration-300 rounded-full ${unit === "c" ? "left-2 right-[calc(50%+2px)]" : "left-[calc(50%+2px)] right-2"}`}
      ></span>
    </Button>
  )
}

