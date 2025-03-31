"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function GeolocationButton() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const useDefaultLocation = useCallback(() => {
    toast({
      title: "Używam domyślnej lokalizacji",
      description: "Geolokalizacja jest niedostępna w tym środowisku. Wyświetlam pogodę dla Warszawy.",
    })
    router.push(`/?location=Warszawa`)
    setIsLoading(false)
  }, [router, toast, setIsLoading])

  const handleGetLocation = () => {
    setIsLoading(true)

    // In preview environments, geolocation might be blocked
    // So we'll provide a fallback to a default location

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      useDefaultLocation()
      return
    }

    // Try to get the user's location with a short timeout
    try {
      const timeoutId = setTimeout(() => {
        // If geolocation takes too long, it's probably blocked
        useDefaultLocation()
      }, 3000)

      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timeoutId)
          const { latitude, longitude } = position.coords
          router.push(`/?location=${latitude},${longitude}`)
          setIsLoading(false)
        },
        (error) => {
          clearTimeout(timeoutId)
          console.error("Geolocation error:", error)
          useDefaultLocation()
        },
        { timeout: 5000, maximumAge: 0 },
      )
    } catch (error) {
      console.error("Geolocation error:", error)
      useDefaultLocation()
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleGetLocation}
      disabled={isLoading}
      className="frosted-glass border-0 hover:bg-white/50 dark:hover:bg-slate-700/50 transition-all duration-300"
      title="Użyj mojej lokalizacji"
    >
      <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
      <span className="sr-only">Użyj mojej lokalizacji</span>
    </Button>
  )
}

