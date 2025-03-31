"use client"

import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { CloudOff, Wifi } from "lucide-react"

export function OfflineDetector() {
  const [isOnline, setIsOnline] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine)

    // Define event handlers
    const handleOnline = () => {
      setIsOnline(true)
      toast({
        title: "Połączenie przywrócone",
        description: "Jesteś teraz online. Dane pogodowe zostaną zaktualizowane.",
        icon: <Wifi className="h-5 w-5 text-green-500" />,
      })
    }

    const handleOffline = () => {
      setIsOnline(false)
      toast({
        title: "Brak połączenia",
        description: "Jesteś offline. Niektóre funkcje mogą być niedostępne.",
        icon: <CloudOff className="h-5 w-5 text-orange-500" />,
        duration: 5000,
      })
    }

    // Add event listeners
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Clean up
    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [toast])

  return null // This component doesn't render anything, it just handles events
}

