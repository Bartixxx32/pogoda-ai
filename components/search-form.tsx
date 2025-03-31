"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SearchForm({ initialLocation = "" }: { initialLocation?: string }) {
  const [location, setLocation] = useState(initialLocation)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (location.trim()) {
      router.push(`/?location=${encodeURIComponent(location.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-2">
      <Input
        type="text"
        placeholder="Wpisz nazwę miasta..."
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="flex-1 frosted-glass border-0 focus-visible:ring-blue-500"
      />
      <Button
        type="submit"
        variant="default"
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-600 dark:to-indigo-600 dark:hover:from-blue-500 dark:hover:to-indigo-500 transition-all duration-300"
      >
        <Search className="h-4 w-4 mr-2" />
        Szukaj
      </Button>
    </form>
  )
}

