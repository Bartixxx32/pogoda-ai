import Image from "next/image"
import { formatDate, formatTemperature, formatWindSpeed, formatPercentage } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ForecastDay } from "@/lib/types"
import { Droplets, Wind, Sun, CloudRain } from "lucide-react"

export function ForecastDays({ forecast, unit = "c" }: { forecast: ForecastDay[]; unit?: string }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-3 bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
        Prognoza 3-dniowa
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {forecast.map((day) => {
          // Use the correct temperature based on the unit
          const avgTemp = unit === "c" ? day.day.avgtemp_c : day.day.avgtemp_f
          const maxTemp = unit === "c" ? day.day.maxtemp_c : day.day.maxtemp_f
          const minTemp = unit === "c" ? day.day.mintemp_c : day.day.mintemp_f

          return (
            <Card key={day.date} className="overflow-hidden frosted-glass rounded-xl frosted-glass-hover">
              <CardHeader className="pb-2 relative px-6 pt-6">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 dark:from-blue-500/10 dark:to-indigo-500/10 z-0"></div>
                <CardTitle className="text-lg relative z-10">{formatDate(day.date, true, true)}</CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
                      {formatTemperature(avgTemp)}°
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Max: {formatTemperature(maxTemp)}° Min: {formatTemperature(minTemp)}°
                    </p>
                  </div>
                  <Image
                    src={day.day.condition.icon || "/placeholder.svg"}
                    alt={day.day.condition.text}
                    width={48}
                    height={48}
                    className="drop-shadow-md"
                  />
                </div>
                <p className="text-sm mt-1 text-slate-700 dark:text-slate-300">{day.day.condition.text}</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-3 text-xs">
                  <div className="flex items-center gap-1">
                    <CloudRain className="h-3 w-3 text-blue-500" />
                    <span className="text-muted-foreground">Deszcz:</span>
                    <span>{formatPercentage(day.day.daily_chance_of_rain)}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Droplets className="h-3 w-3 text-blue-500" />
                    <span className="text-muted-foreground">Wilgotność:</span>
                    <span>{formatPercentage(day.day.avghumidity)}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Wind className="h-3 w-3 text-blue-500" />
                    <span className="text-muted-foreground">Wiatr:</span>
                    <span>{formatWindSpeed(day.day.maxwind_kph)} km/h</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Sun className="h-3 w-3 text-blue-500" />
                    <span className="text-muted-foreground">UV:</span>
                    <span>{day.day.uv}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

