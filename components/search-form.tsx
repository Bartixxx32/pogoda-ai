"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SearchForm({ initialLocation = "" }: { initialLocation?: string }) {
  const [location, setLocation] = useState(initialLocation)
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (location.trim()) {
      setIsSearching(true)
      router.push(`/?location=${encodeURIComponent(location.trim())}`)
      // Reset searching state after a short delay to show loading state
      setTimeout(() => setIsSearching(false), 1000)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-2 animated-fade">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Wpisz nazwę miasta..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="glass-input pl-10 h-11 text-base"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      </div>
      <Button
        type="submit"
        disabled={isSearching}
        className="bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 dark:from-sky-600 dark:to-indigo-600 dark:hover:from-sky-500 dark:hover:to-indigo-500 transition-all duration-300 h-11 px-5"
      >
        {isSearching ? (
          <>
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Szukam...
          </>
        ) : (
          "Szukaj"
        )}
      </Button>
    </form>
  )
}

