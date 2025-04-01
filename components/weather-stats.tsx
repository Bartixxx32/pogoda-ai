import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { WeatherData } from "@/lib/types"
import { Sunrise, Sunset, Droplets, Wind, Gauge, CloudRain } from "lucide-react"
import { formatTime, formatDecimal, formatPressure } from "@/lib/utils"

export function WeatherStats({ weather }: { weather: WeatherData }) {
  const today = weather.forecast.forecastday[0]

  // Convert sunrise and sunset times to 24-hour format
  const sunriseTime = formatTime(today.astro.sunrise)
  const sunsetTime = formatTime(today.astro.sunset)

  // Determine if it's currently day or night
  const now = Math.floor(Date.now() / 1000)
  const isSunUp = now >= today.astro.sunrise && now < today.astro.sunset

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="glass-card animated-card floating-delayed-more" style={{ animationDelay: "0.2s" }}>
        <CardHeader className="pb-2 px-6 pt-6">
          <CardTitle className="text-xl font-semibold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent dark:from-amber-400 dark:to-orange-400">
            Wschód i zachód słońca
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="flex justify-between items-center">
            <div className="flex flex-col items-center group">
              <div
                className={`p-3 rounded-full ${
                  isSunUp
                    ? "bg-amber-100/50 dark:bg-amber-900/20 text-amber-400 dark:text-amber-300"
                    : "bg-amber-100 dark:bg-amber-900/30 text-amber-500 dark:text-amber-400"
                } mb-2 group-hover:bg-amber-200 dark:group-hover:bg-amber-800/30 transition-colors duration-300`}
              >
                <Sunrise className="h-6 w-6" />
              </div>
              <span className="text-sm text-muted-foreground">Wschód</span>
              <span className="text-lg font-medium">{sunriseTime}</span>
            </div>

            <div className="h-0.5 flex-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-4 opacity-20"></div>

            <div className="flex flex-col items-center group">
              <div
                className={`p-3 rounded-full ${
                  !isSunUp
                    ? "bg-orange-100 dark:bg-orange-900/30 text-orange-500 dark:text-orange-400"
                    : "bg-orange-100/50 dark:bg-orange-900/20 text-orange-400 dark:text-orange-300"
                } mb-2 group-hover:bg-orange-200 dark:group-hover:bg-orange-800/30 transition-colors duration-300`}
              >
                <Sunset className="h-6 w-6" />
              </div>
              <span className="text-sm text-muted-foreground">Zachód</span>
              <span className="text-lg font-medium">{sunsetTime}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card animated-card floating" style={{ animationDelay: "0.3s" }}>
        <CardHeader className="pb-2 px-6 pt-6">
          <CardTitle className="text-xl font-semibold bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent dark:from-sky-400 dark:to-indigo-400">
            Szczegóły pogodowe
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="grid grid-cols-2 gap-y-3">
            <div className="flex items-center gap-2 group transition-all duration-300">
              <div className="p-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-500 dark:text-indigo-400 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/30 transition-colors duration-300">
                <Gauge className="h-4 w-4" />
              </div>
              <span className="text-sm text-muted-foreground">Ciśnienie:</span>
              <span className="text-sm font-medium">{formatPressure(weather.current.pressure_mb)} hPa</span>
            </div>

            <div className="flex items-center gap-2 group transition-all duration-300">
              <div className="p-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/30 transition-colors duration-300">
                <CloudRain className="h-4 w-4" />
              </div>
              <span className="text-sm text-muted-foreground">Opady:</span>
              <span className="text-sm font-medium">{formatDecimal(weather.current.precip_mm)} mm</span>
            </div>

            <div className="flex items-center gap-2 group transition-all duration-300">
              <div className="p-1.5 rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-500 dark:text-sky-400 group-hover:bg-sky-200 dark:group-hover:bg-sky-800/30 transition-colors duration-300">
                <Wind className="h-4 w-4" />
              </div>
              <span className="text-sm text-muted-foreground">Kierunek:</span>
              <span className="text-sm font-medium">{weather.current.wind_dir}</span>
            </div>

            <div className="flex items-center gap-2 group transition-all duration-300">
              <div className="p-1.5 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-500 dark:text-cyan-400 group-hover:bg-cyan-200 dark:group-hover:bg-cyan-800/30 transition-colors duration-300">
                <Droplets className="h-4 w-4" />
              </div>
              <span className="text-sm text-muted-foreground">Punkt rosy:</span>
              <span className="text-sm font-medium">{formatDecimal(weather.current.dewpoint_c)}°C</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

