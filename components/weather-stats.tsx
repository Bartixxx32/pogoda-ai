import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { WeatherData } from "@/lib/types"
import { Sunrise, Sunset, Droplets, Wind, Gauge, CloudRain } from "lucide-react"
import { formatTime, formatDecimal, formatPressure } from "@/lib/utils"

export function WeatherStats({ weather }: { weather: WeatherData }) {
  const today = weather.forecast.forecastday[0]

  // Convert sunrise and sunset times to 24-hour format
  const sunriseTime = formatTime(today.astro.sunrise)
  const sunsetTime = formatTime(today.astro.sunset)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="frosted-glass rounded-xl floating-card-delayed-more">
        <CardHeader className="pb-2 px-6 pt-6">
          <CardTitle className="text-lg font-semibold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
            Wschód i zachód słońca
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="flex justify-between items-center">
            <div className="flex flex-col items-center">
              <Sunrise className="h-8 w-8 text-amber-500 mb-2" />
              <span className="text-sm text-muted-foreground">Wschód</span>
              <span className="text-lg font-medium">{sunriseTime}</span>
            </div>
            <div className="h-0.5 flex-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-4 opacity-30"></div>
            <div className="flex flex-col items-center">
              <Sunset className="h-8 w-8 text-orange-500 mb-2" />
              <span className="text-sm text-muted-foreground">Zachód</span>
              <span className="text-lg font-medium">{sunsetTime}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="frosted-glass rounded-xl floating-card">
        <CardHeader className="pb-2 px-6 pt-6">
          <CardTitle className="text-lg font-semibold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
            Szczegóły pogodowe
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="grid grid-cols-2 gap-y-3">
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Ciśnienie:</span>
              <span className="text-sm font-medium">{formatPressure(weather.current.pressure_mb)} hPa</span>
            </div>
            <div className="flex items-center gap-2">
              <CloudRain className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Opady:</span>
              <span className="text-sm font-medium">{formatDecimal(weather.current.precip_mm)} mm</span>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Kierunek:</span>
              <span className="text-sm font-medium">{weather.current.wind_dir}</span>
            </div>
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Punkt rosy:</span>
              <span className="text-sm font-medium">{formatDecimal(weather.current.dewpoint_c)}°C</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

