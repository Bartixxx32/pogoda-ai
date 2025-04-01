"use server"

import { transformOpenWeatherData } from "@/lib/weather"
import type { WeatherData } from "@/lib/types"

// Server action to fetch weather data
export async function getWeatherData(location: string): Promise<WeatherData | null> {
  // Use the server-side environment variable (without NEXT_PUBLIC_ prefix)
  const API_KEY = process.env.WEATHER_API_KEY

  if (!API_KEY) {
    console.error("Missing WEATHER_API_KEY environment variable")
    return null
  }

  try {
    // Check if the location is coordinates
    const isCoordinates = location.includes(",")
    let lat, lon
    if (isCoordinates) {
      ;[lat, lon] = location.split(",")
      if (!lat || !lon) {
        throw new Error("Invalid coordinates format")
      }
    }

    // Build the API URL based on whether we have coordinates or a city name
    let apiUrl
    if (isCoordinates) {
      apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pl`
    } else {
      apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric&lang=pl`
    }

    // Fetch current weather data
    const currentResponse = await fetch(apiUrl, { next: { revalidate: 600 } }) // Revalidate every 10 minutes
    if (!currentResponse.ok) {
      console.error(`Error fetching current weather data: ${currentResponse.status} ${currentResponse.statusText}`)
      return null
    }
    const currentData = await currentResponse.json()

    // Extract city name and coordinates
    const cityName = currentData.name + (currentData.sys.country ? `, ${currentData.sys.country}` : "")
    lat = currentData.coord.lat
    lon = currentData.coord.lon

    // Fetch forecast data
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pl`
    const forecastResponse = await fetch(forecastUrl, { next: { revalidate: 3600 } }) // Revalidate every hour
    if (!forecastResponse.ok) {
      console.error(`Error fetching forecast data: ${forecastResponse.status} ${forecastResponse.statusText}`)
      return null
    }
    const forecastData = await forecastResponse.json()

    // Transform and return the combined data
    return transformOpenWeatherData(currentData, forecastData, cityName, lat, lon)
  } catch (error) {
    console.error("Error fetching weather data:", error)
    return null
  }
}

