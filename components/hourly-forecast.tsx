"use client"

import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatHourlyTime, formatTemperature } from "@/lib/utils"
import type { HourForecast } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function HourlyForecast({ forecast }: { forecast: HourForecast[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const currentHour = new Date().getHours()

  // Filter to show only future hours
  const futureHours = forecast.filter((hour) => {
    const hourTime = new Date(hour.time).getHours()
    return hourTime >= currentHour
  })

  // Check if we can scroll in either direction
  const checkScrollability = () => {
    const el = scrollRef.current
    if (!el) return

    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5)
  }

  // Set up scroll event listener
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    el.addEventListener("scroll", checkScrollability)
    // Initial check
    checkScrollability()

    return () => {
      el.removeEventListener("scroll", checkScrollability)
    }
  }, [])

  // Handle scroll button clicks
  const handleScroll = (direction: "left" | "right") => {
    const el = scrollRef.current
    if (!el) return

    const scrollAmount = 300 // pixels to scroll
    const newPosition = direction === "left" ? el.scrollLeft - scrollAmount : el.scrollLeft + scrollAmount

    el.scrollTo({
      left: newPosition,
      behavior: "smooth",
    })
  }

  return (
    <Card className="frosted-glass rounded-xl floating-card-delayed">
      <CardHeader className="pb-2 px-6 pt-6">
        <CardTitle className="text-xl font-semibold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
          Prognoza godzinowa
        </CardTitle>
      </CardHeader>
      <CardContent className="relative px-6 pb-6">
        {/* Left scroll button */}
        <Button
          variant="outline"
          size="icon"
          className="rounded-full frosted-glass absolute left-2 top-1/2 -translate-y-1/2 z-10"
          onClick={() => handleScroll("left")}
          disabled={!canScrollLeft}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Przewiń w lewo</span>
        </Button>

        {/* Right scroll button */}
        <Button
          variant="outline"
          size="icon"
          className="rounded-full frosted-glass absolute right-2 top-1/2 -translate-y-1/2 z-10"
          onClick={() => handleScroll("right")}
          disabled={!canScrollRight}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Przewiń w prawo</span>
        </Button>

        {/* Scrollable container */}
        <div
          ref={scrollRef}
          className="overflow-x-auto py-2 -mx-2 px-4"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <div className="flex space-x-6 min-w-max">
            {futureHours.map((hour, index) => (
              <div key={index} className="flex flex-col items-center space-y-2 w-[80px]">
                <span className="text-sm font-medium">{formatHourlyTime(hour.time)}</span>
                <Image
                  src={`https:${hour.condition.icon}`}
                  alt={hour.condition.text}
                  width={40}
                  height={40}
                  className="drop-shadow-md"
                />
                <span className="text-lg font-bold">{formatTemperature(hour.temp_c)}°</span>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span>{hour.chance_of_rain}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hide scrollbar */}
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </CardContent>
    </Card>
  )
}

