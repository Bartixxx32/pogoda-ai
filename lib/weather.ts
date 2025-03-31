import type { WeatherData } from "./types"

export async function getCurrentWeather(location: string): Promise<WeatherData | null> {
  const apiKey = process.env.WEATHER_API_KEY

  if (!apiKey) {
    console.error("Weather API key is not defined")
    return null
  }

  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(
        location,
      )}&days=3&aqi=yes&alerts=no&lang=pl`,
      { next: { revalidate: 1800 } }, // Cache for 30 minutes
    )

    if (!response.ok) {
      console.error(`Weather API error: ${response.status} ${response.statusText}`)
      return null
    }

    const data = await response.json()
    return data as WeatherData
  } catch (error) {
    console.error("Error fetching weather data:", error)
    return null
  }
}

