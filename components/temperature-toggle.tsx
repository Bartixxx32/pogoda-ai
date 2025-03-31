"use client"
import { Button } from "@/components/ui/button"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

export function TemperatureToggle() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const unit = searchParams.get("unit") || "c"

  const toggleUnit = () => {
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
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleUnit}
      className="text-xs frosted-glass border-0 hover:bg-white/50 dark:hover:bg-slate-700/50"
    >
      °{unit.toUpperCase()} → °{unit === "c" ? "F" : "C"}
    </Button>
  )
}

