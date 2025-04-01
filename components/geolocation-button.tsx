"use client"

import { useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function GeolocationButton() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const defaultLocationUsed = useRef(false)
  const [isGeolocationAvailable, setIsGeolocationAvailable] = useState(
    typeof navigator !== "undefined" && "geolocation" in navigator,
  )

  const useDefaultLocation = useCallback(() => {
    if (!defaultLocationUsed.current) {
      toast({
        title: "Używam domyślnej lokalizacji",
        description: "Geolokalizacja jest niedostępna w tym środowisku. Wyświetlam pogodę dla Warszawy.",
        variant: "default",
      })
      router.push(`/?location=Warszawa`)
      setIsLoading(false)
      defaultLocationUsed.current = true
    }
  }, [router, toast, setIsLoading])

  const handleGetLocation = () => {
    setIsLoading(true)
    defaultLocationUsed.current = false

    // In preview environments, geolocation might be blocked
    // So we'll provide a fallback to a default location

    // Check if geolocation is supported
    if (!isGeolocationAvailable) {
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
      className="glass-button h-11 w-11 rounded-full flex items-center justify-center"
      title="Użyj mojej lokalizacji"
    >
      {isLoading ? (
        <div className="h-5 w-5 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <MapPin className="h-5 w-5 text-sky-500 dark:text-sky-400" />
      )}
      <span className="sr-only">Użyj mojej lokalizacji</span>
    </Button>
  )
}

