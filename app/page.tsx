import { Suspense } from "react"
import { SearchForm } from "@/components/search-form"
import { WeatherDisplay } from "@/components/weather-display"
import { HourlyForecast } from "@/components/hourly-forecast"
import { WeatherStats } from "@/components/weather-stats"
import { GeolocationButton } from "@/components/geolocation-button"
import { ForecastDays } from "@/components/forecast-days"
import { OfflineDetector } from "@/components/offline-detector"
import { InstallPrompt } from "@/components/install-prompt"
import { ThemeToggle } from "@/components/theme-toggle"
import { getWeatherData } from "@/lib/actions"

export default async function WeatherApp({
  searchParams,
}: {
  searchParams: { location?: string; unit?: string }
}) {
  const location = searchParams.location || "Warszawa"
  const unit = searchParams.unit || "c"

  // Use the server action to fetch weather data
  const weatherData = await getWeatherData(location)

  return (
    <main className="min-h-screen flex flex-col items-center p-4 md:p-8">
      <OfflineDetector />
      <InstallPrompt />

      <div className="w-full max-w-5xl space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center md:text-left bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent dark:from-sky-400 dark:to-indigo-400 animated-fade">
            Prognoza Pogody
          </h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center animated-fade" style={{ animationDelay: "0.1s" }}>
          <SearchForm initialLocation={location} />
          <GeolocationButton />
        </div>

        <Suspense fallback={<WeatherSkeleton />}>
          {weatherData ? (
            <div className="space-y-6">
              <WeatherDisplay weather={weatherData} unit={unit} />
              <HourlyForecast forecast={weatherData.forecast.forecastday[0].hour} />
              <WeatherStats weather={weatherData} />
              <ForecastDays forecast={weatherData.forecast.forecastday} unit={unit} />
            </div>
          ) : (
            <div className="p-6 text-center rounded-2xl glass animated-card">
              <p className="text-red-500">Nie można pobrać danych pogodowych. Spróbuj wpisać inną lokalizację.</p>
            </div>
          )}
        </Suspense>
      </div>
    </main>
  )
}

function WeatherSkeleton() {
  return (
    <div className="space-y-6 w-full">
      <div className="p-6 rounded-2xl glass animate-pulse">
        <div className="flex justify-between">
          <div className="space-y-3 w-2/3">
            <div className="h-8 bg-white/20 dark:bg-slate-700/30 rounded-md w-1/2"></div>
            <div className="h-4 bg-white/20 dark:bg-slate-700/30 rounded-md w-1/3"></div>
          </div>
          <div className="h-16 w-16 bg-white/20 dark:bg-slate-700/30 rounded-full"></div>
        </div>
        <div className="mt-6 flex justify-between">
          <div className="h-16 bg-white/20 dark:bg-slate-700/30 rounded-md w-1/4"></div>
          <div className="grid grid-cols-2 gap-2 w-1/2">
            <div className="h-6 bg-white/20 dark:bg-slate-700/30 rounded-md"></div>
            <div className="h-6 bg-white/20 dark:bg-slate-700/30 rounded-md"></div>
            <div className="h-6 bg-white/20 dark:bg-slate-700/30 rounded-md"></div>
            <div className="h-6 bg-white/20 dark:bg-slate-700/30 rounded-md"></div>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl glass animate-pulse">
        <div className="h-6 bg-white/20 dark:bg-slate-700/30 rounded-md w-1/4 mb-4"></div>
        <div className="flex space-x-4 overflow-x-auto py-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-16 space-y-2">
              <div className="h-4 bg-white/20 dark:bg-slate-700/30 rounded-md"></div>
              <div className="h-10 w-10 bg-white/20 dark:bg-slate-700/30 rounded-full mx-auto"></div>
              <div className="h-5 bg-white/20 dark:bg-slate-700/30 rounded-md"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="p-6 rounded-2xl glass animate-pulse">
            <div className="h-6 bg-white/20 dark:bg-slate-700/30 rounded-md w-1/3 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-white/20 dark:bg-slate-700/30 rounded-md"></div>
              <div className="h-4 bg-white/20 dark:bg-slate-700/30 rounded-md"></div>
              <div className="h-4 bg-white/20 dark:bg-slate-700/30 rounded-md"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-6 rounded-2xl glass animate-pulse">
            <div className="h-5 bg-white/20 dark:bg-slate-700/30 rounded-md w-1/2 mb-4"></div>
            <div className="flex justify-between mb-3">
              <div className="h-8 bg-white/20 dark:bg-slate-700/30 rounded-md w-1/3"></div>
              <div className="h-10 w-10 bg-white/20 dark:bg-slate-700/30 rounded-full"></div>
            </div>
            <div className="h-4 bg-white/20 dark:bg-slate-700/30 rounded-md w-3/4 mb-3"></div>
            <div className="grid grid-cols-2 gap-2">
              <div className="h-3 bg-white/20 dark:bg-slate-700/30 rounded-md"></div>
              <div className="h-3 bg-white/20 dark:bg-slate-700/30 rounded-md"></div>
              <div className="h-3 bg-white/20 dark:bg-slate-700/30 rounded-md"></div>
              <div className="h-3 bg-white/20 dark:bg-slate-700/30 rounded-md"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

