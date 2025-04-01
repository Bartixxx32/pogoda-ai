import Image from "next/image"
import { formatDate, formatTemperature, formatWindSpeed, formatPercentage, isSunnyCondition } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import type { WeatherData } from "@/lib/types"
import { Droplets, Thermometer, Wind, Sun } from "lucide-react"
import { TemperatureToggle } from "./temperature-toggle"

export function WeatherDisplay({ weather, unit = "c" }: { weather: WeatherData; unit?: string }) {
  // Use the correct temperature based on the unit
  const currentTemp = unit === "c" ? weather.current.temp_c : weather.current.temp_f
  const feelsLikeTemp = unit === "c" ? weather.current.feelslike_c : weather.current.feelslike_f

  // Determine if current condition is sunny
  const isSunny = isSunnyCondition(weather.current.condition.code, weather.current.condition.text)

  // Determine if it's daytime
  const isDay = weather.current.is_day === 1

  return (
    <Card className="glass-card overflow-hidden animated-card">
      <CardContent className="p-0">
        <div className="relative">
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 to-indigo-500/10 dark:from-sky-500/20 dark:to-indigo-500/20 z-0"></div>

          {/* Header section */}
          <div className="p-6 relative z-10">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent dark:from-sky-400 dark:to-indigo-400">
                  {weather.location.name}
                </h2>
                <p className="text-slate-600 dark:text-slate-300">
                  {weather.location.region && `${weather.location.region}, `}
                  {weather.location.country}
                </p>
                <p className="text-sm text-muted-foreground">{formatDate(weather.location.localtime, false, true)}</p>
              </div>

              <div className="flex items-center">
                <div className="relative">
                  <Image
                    src={weather.current.condition.icon || "/placeholder.svg"}
                    alt={weather.current.condition.text}
                    width={80}
                    height={80}
                    className="drop-shadow-md"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-500/0 to-indigo-500/0 rounded-full filter blur-xl opacity-30"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Main content section */}
          <div className="p-6 pt-0 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end gap-6 justify-between">
              <div className="flex items-end gap-6">
                <div>
                  <p className="text-7xl font-bold bg-gradient-to-br from-sky-500 to-indigo-500 bg-clip-text text-transparent dark:from-sky-400 dark:to-indigo-400 tracking-tight">
                    {formatTemperature(currentTemp)}°
                  </p>
                  <p className="text-lg mt-2 text-slate-700 dark:text-slate-300">{weather.current.condition.text}</p>
                </div>
                <TemperatureToggle />
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                <div className="flex items-center gap-2 group transition-all duration-300">
                  <div className="p-1.5 rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-500 dark:text-sky-400 group-hover:bg-sky-200 dark:group-hover:bg-sky-800/30 transition-colors duration-300">
                    <Thermometer className="h-4 w-4" />
                  </div>
                  <span className="text-muted-foreground">Odczuwalna:</span>
                  <span className="font-medium">
                    {formatTemperature(feelsLikeTemp)}°{unit.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-2 group transition-all duration-300">
                  <div className="p-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-500 dark:text-indigo-400 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/30 transition-colors duration-300">
                    <Wind className="h-4 w-4" />
                  </div>
                  <span className="text-muted-foreground">Wiatr:</span>
                  <span className="font-medium">{formatWindSpeed(weather.current.wind_kph)} km/h</span>
                </div>

                <div className="flex items-center gap-2 group transition-all duration-300">
                  <div className="p-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/30 transition-colors duration-300">
                    <Droplets className="h-4 w-4" />
                  </div>
                  <span className="text-muted-foreground">Wilgotność:</span>
                  <span className="font-medium">{formatPercentage(weather.current.humidity)}%</span>
                </div>

                <div className="flex items-center gap-2 group transition-all duration-300">
                  <div
                    className={`p-1.5 rounded-full ${
                      isDay && isSunny
                        ? "bg-amber-100 dark:bg-amber-900/30 text-amber-500 dark:text-amber-400 group-hover:bg-amber-200 dark:group-hover:bg-amber-800/30"
                        : "bg-gray-100 dark:bg-gray-800/30 text-gray-500 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-700/30"
                    } transition-colors duration-300`}
                  >
                    <Sun className="h-4 w-4" />
                  </div>
                  <span className="text-muted-foreground">Indeks UV:</span>
                  <span className="font-medium">{weather.current.uv}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

