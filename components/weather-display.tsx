import Image from "next/image"
import { formatDate, formatTemperature } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { WeatherData } from "@/lib/types"
import { Droplets, Thermometer, Wind, Sun } from "lucide-react"
import { TemperatureToggle } from "./temperature-toggle"

export function WeatherDisplay({ weather, unit = "c" }: { weather: WeatherData; unit?: string }) {
  // Use the correct temperature based on the unit
  const currentTemp = unit === "c" ? weather.current.temp_c : weather.current.temp_f
  const feelsLikeTemp = unit === "c" ? weather.current.feelslike_c : weather.current.feelslike_f

  return (
    <Card className="overflow-hidden frosted-glass rounded-xl floating-card">
      <CardHeader className="pb-2 relative overflow-hidden px-6 pt-6">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20 z-0"></div>
        <div className="flex justify-between items-start relative z-10">
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
              {weather.location.name}
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300">
              {weather.location.region && `${weather.location.region}, `}
              {weather.location.country}
            </CardDescription>
            <p className="text-sm text-muted-foreground mt-1">{formatDate(weather.location.localtime, false, true)}</p>
          </div>
          <div className="flex items-center">
            <Image
              src={`https:${weather.current.condition.icon}`}
              alt={weather.current.condition.text}
              width={80}
              height={80}
              className="drop-shadow-md"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="flex flex-col md:flex-row md:items-end gap-6 justify-between">
          <div className="flex items-end gap-6">
            <div>
              <p className="text-6xl font-bold bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
                {formatTemperature(currentTemp)}°
              </p>
              <p className="text-lg mt-2 text-slate-700 dark:text-slate-300">{weather.current.condition.text}</p>
            </div>
            <TemperatureToggle />
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-blue-500" />
              <span className="text-muted-foreground">Odczuwalna:</span>
              <span className="font-medium">
                {formatTemperature(feelsLikeTemp)}°{unit.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="h-4 w-4 text-blue-500" />
              <span className="text-muted-foreground">Wiatr:</span>
              <span className="font-medium">{weather.current.wind_kph} km/h</span>
            </div>
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-blue-500" />
              <span className="text-muted-foreground">Wilgotność:</span>
              <span className="font-medium">{weather.current.humidity}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-blue-500" />
              <span className="text-muted-foreground">Indeks UV:</span>
              <span className="font-medium">{weather.current.uv}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

