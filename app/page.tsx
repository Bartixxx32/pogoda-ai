import { Suspense } from "react"
import { SearchForm } from "@/components/search-form"
import { WeatherDisplay } from "@/components/weather-display"
import { getCurrentWeather } from "@/lib/weather"
import { HourlyForecast } from "@/components/hourly-forecast"
import { WeatherStats } from "@/components/weather-stats"
import { GeolocationButton } from "@/components/geolocation-button"
import { ForecastDays } from "@/components/forecast-days"
import { OfflineDetector } from "@/components/offline-detector"
import { InstallPrompt } from "@/components/install-prompt"

export default async function WeatherApp({
  searchParams,
}: {
  searchParams: { location?: string; unit?: string }
}) {
  const location = searchParams.location || "Warszawa"
  const unit = searchParams.unit || "c"
  const weatherData = await getCurrentWeather(location)

  return (
    <main className="min-h-screen flex flex-col items-center p-4 md:p-8">
      <OfflineDetector />
      <InstallPrompt />
      <div className="w-full max-w-4xl space-y-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
          Prognoza Pogody
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
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
            <div className="p-6 text-center rounded-xl frosted-glass">
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
    <div className="p-6 rounded-xl frosted-glass animate-pulse">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md mb-4 w-1/2"></div>
      <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-md mb-4"></div>
      <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-md mb-4"></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
        ))}
      </div>
    </div>
  )
}

