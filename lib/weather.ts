import type { WeatherData } from "./types"

// Remove direct access to the API key
// const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY

// Transform OpenWeatherMap data to our app's format
export function transformOpenWeatherData(
  currentData: any,
  forecastData: any,
  cityName: string,
  lat: number,
  lon: number,
): WeatherData {
  // Get current date and time
  const currentDate = new Date()
  const localTime = new Date(currentDate.getTime() + currentData.timezone * 1000)

  // Process forecast data to group by day
  const dailyForecasts = processDailyForecasts(forecastData.list, currentData.sys.sunrise, currentData.sys.sunset)

  // Create forecastday array (limit to 3 days)
  const forecastDays = Object.keys(dailyForecasts)
    .slice(0, 3)
    .map((date) => {
      const day = dailyForecasts[date]

      return {
        date: date,
        date_epoch: day.dt,
        day: {
          maxtemp_c: day.temp_max,
          maxtemp_f: celsiusToFahrenheit(day.temp_max),
          mintemp_c: day.temp_min,
          mintemp_f: celsiusToFahrenheit(day.temp_min),
          avgtemp_c: (day.temp_max + day.temp_min) / 2,
          avgtemp_f: celsiusToFahrenheit((day.temp_max + day.temp_min) / 2),
          maxwind_kph: mpsToKph(day.wind_speed),
          maxwind_mph: mpsToMph(day.wind_speed),
          totalprecip_mm: day.rain || 0,
          totalprecip_in: mmToIn(day.rain || 0),
          totalsnow_cm: (day.snow || 0) / 10, // Convert mm to cm
          avgvis_km: 10, // Default value
          avgvis_miles: 6.2, // Default value
          avghumidity: day.humidity,
          daily_will_it_rain: day.pop > 0.3 ? 1 : 0,
          daily_chance_of_rain: Math.round(day.pop * 100),
          daily_will_it_snow: day.snow && day.snow > 0 ? 1 : 0,
          daily_chance_of_snow: day.snow ? Math.round(day.pop * 100) : 0,
          condition: {
            text: day.description,
            icon: `https://openweathermap.org/img/wn/${day.icon}@2x.png`,
            code: day.id,
          },
          uv: 0, // Default value
        },
        astro: {
          sunrise: formatUnixTime(day.sunrise),
          sunset: formatUnixTime(day.sunset),
          moonrise: "00:00", // Default value
          moonset: "00:00", // Default value
          moon_phase: "Waxing Crescent", // Default value
          moon_illumination: "50", // Default value
          is_moon_up: 0, // Default value
          is_sun_up: 0, // Default value
        },
        hour: generateHourlyForecast(forecastData.list, date),
      }
    })

  return {
    location: {
      name: cityName.split(",")[0],
      region: "",
      country: cityName.includes(",") ? cityName.split(",")[1].trim() : "",
      lat: lat,
      lon: lon,
      tz_id: currentData.timezone,
      localtime_epoch: Math.floor(localTime.getTime() / 1000),
      localtime: localTime.toISOString(),
    },
    current: {
      last_updated_epoch: currentData.dt,
      last_updated: new Date(currentData.dt * 1000).toISOString(),
      temp_c: currentData.main.temp,
      temp_f: celsiusToFahrenheit(currentData.main.temp),
      is_day: isDay(currentData.dt, currentData.sys.sunrise, currentData.sys.sunset) ? 1 : 0,
      condition: {
        text: currentData.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png`,
        code: currentData.weather[0].id,
      },
      wind_mph: mpsToMph(currentData.wind.speed),
      wind_kph: mpsToKph(currentData.wind.speed),
      wind_degree: currentData.wind.deg,
      wind_dir: getWindDirection(currentData.wind.deg),
      pressure_mb: currentData.main.pressure,
      pressure_in: mbToIn(currentData.main.pressure),
      precip_mm: currentData.rain ? currentData.rain["1h"] || 0 : 0,
      precip_in: currentData.rain ? mmToIn(currentData.rain["1h"] || 0) : 0,
      humidity: currentData.main.humidity,
      cloud: currentData.clouds.all,
      feelslike_c: currentData.main.feels_like,
      feelslike_f: celsiusToFahrenheit(currentData.main.feels_like),
      vis_km: currentData.visibility / 1000,
      vis_miles: mToMiles(currentData.visibility),
      uv: 0, // Default value
      dewpoint_c: calculateDewPoint(currentData.main.temp, currentData.main.humidity),
      dewpoint_f: celsiusToFahrenheit(calculateDewPoint(currentData.main.temp, currentData.main.humidity)),
      gust_mph: currentData.wind.gust ? mpsToMph(currentData.wind.gust) : mpsToMph(currentData.wind.speed * 1.5),
      gust_kph: currentData.wind.gust ? mpsToKph(currentData.wind.gust) : mpsToKph(currentData.wind.speed * 1.5),
    },
    forecast: {
      forecastday: forecastDays,
    },
  }
}

// Process forecast data to group by day
function processDailyForecasts(
  forecastList: any[],
  currentSunrise: number,
  currentSunset: number,
): Record<string, any> {
  const dailyForecasts: Record<string, any> = {}

  forecastList.forEach((item) => {
    const date = new Date(item.dt * 1000).toISOString().split("T")[0]

    if (!dailyForecasts[date]) {
      dailyForecasts[date] = {
        dt: item.dt,
        temp_min: item.main.temp_min,
        temp_max: item.main.temp_max,
        humidity: item.main.humidity,
        wind_speed: item.wind.speed,
        pop: item.pop || 0,
        rain: item.rain ? item.rain["3h"] || 0 : 0,
        snow: item.snow ? item.snow["3h"] || 0 : 0,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        id: item.weather[0].id,
        sunrise: 0, // Will be updated later
        sunset: 0, // Will be updated later
        hourly: [],
      }
    } else {
      // Update min/max temperatures
      dailyForecasts[date].temp_min = Math.min(dailyForecasts[date].temp_min, item.main.temp_min)
      dailyForecasts[date].temp_max = Math.max(dailyForecasts[date].temp_max, item.main.temp_max)

      // Update precipitation probability
      if (item.pop > dailyForecasts[date].pop) {
        dailyForecasts[date].pop = item.pop
      }

      // Update rain/snow accumulation
      if (item.rain) {
        dailyForecasts[date].rain += item.rain["3h"] || 0
      }
      if (item.snow) {
        dailyForecasts[date].snow += item.snow["3h"] || 0
      }
    }

    // Add to hourly array
    dailyForecasts[date].hourly.push(item)
  })

  // Calculate sunrise/sunset times for each day
  // We'll use the current day's sunrise/sunset as a base and adjust for future days
  const now = new Date()
  const currentDay = now.getDate()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  // Get the current day's sunrise/sunset times
  const currentSunriseDate = new Date(currentSunrise * 1000)
  const currentSunsetDate = new Date(currentSunset * 1000)

  // Extract hours and minutes
  const sunriseHours = currentSunriseDate.getHours()
  const sunriseMinutes = currentSunriseDate.getMinutes()
  const sunsetHours = currentSunsetDate.getHours()
  const sunsetMinutes = currentSunsetDate.getMinutes()

  Object.keys(dailyForecasts).forEach((date) => {
    const dayDate = new Date(date)
    const dayDiff = Math.floor(
      (dayDate.getTime() - new Date(currentYear, currentMonth, currentDay).getTime()) / (24 * 60 * 60 * 1000),
    )

    // Create sunrise and sunset times for this day
    // For simplicity, we'll use the same hours/minutes as the current day
    // In a real app, you might want to use a more sophisticated calculation or API data
    const sunrise = new Date(dayDate)
    sunrise.setHours(sunriseHours, sunriseMinutes, 0, 0)

    const sunset = new Date(dayDate)
    sunset.setHours(sunsetHours, sunsetMinutes, 0, 0)

    // Adjust slightly for each day (sunrise gets earlier and sunset gets later in summer, opposite in winter)
    // This is a very simple approximation - in a real app you'd use actual calculations based on location and date
    const seasonalAdjustment = isWinterSeason(dayDate) ? -1 : 1

    if (dayDiff > 0) {
      sunrise.setMinutes(sunrise.getMinutes() - dayDiff * seasonalAdjustment)
      sunset.setMinutes(sunset.getMinutes() + dayDiff * seasonalAdjustment)
    }

    dailyForecasts[date].sunrise = Math.floor(sunrise.getTime() / 1000)
    dailyForecasts[date].sunset = Math.floor(sunset.getTime() / 1000)
  })

  return dailyForecasts
}

// Helper function to determine if it's winter season (very simple approximation)
function isWinterSeason(date: Date): boolean {
  const month = date.getMonth()
  // Northern hemisphere: winter is roughly October to March
  return month < 3 || month > 9
}

// Helper function to convert Celsius to Fahrenheit
function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32
}

// Helper function to convert meters per second to kilometers per hour
function mpsToKph(mps: number): number {
  return mps * 3.6
}

// Helper function to convert meters per second to miles per hour
function mpsToMph(mps: number): number {
  return mps * 2.23694
}

// Helper function to convert millimeters to inches
function mmToIn(mm: number): number {
  return mm * 0.0393701
}

// Helper function to convert meters to miles
function mToMiles(m: number): number {
  return m * 0.000621371
}

// Helper function to format Unix timestamp to HH:MM
function formatUnixTime(unixTime: number): string {
  const date = new Date(unixTime * 1000)
  const hours = date.getHours().toString().padStart(2, "0")
  const minutes = date.getMinutes().toString().padStart(2, "0")
  return `${hours}:${minutes}`
}

// Helper function to determine if it's day or night
function isDay(currentTime: number, sunriseTime: number, sunsetTime: number): boolean {
  return currentTime > sunriseTime && currentTime < sunsetTime
}

// Helper function to get wind direction from degrees
function getWindDirection(degrees: number): string {
  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ]
  const index = Math.round(degrees / 22.5) % 16
  return directions[index]
}

// Helper function to convert millibars to inches of mercury
function mbToIn(mb: number): number {
  return mb * 0.02953
}

// Helper function to calculate dew point
function calculateDewPoint(temperature: number, humidity: number): number {
  const a = 17.27
  const b = 237.7
  const tempInCelsius = temperature
  const rh = humidity / 100
  const gamma = (a * tempInCelsius) / (b + tempInCelsius) + Math.log(rh)
  return (b * gamma) / (a - gamma)
}

// Dummy function for generateHourlyForecast
function generateHourlyForecast(forecastList: any[], date: string): any[] {
  // Filter the forecastList to get the hourly forecasts for the given date
  const hourlyForecasts = forecastList.filter((item) => {
    const itemDate = new Date(item.dt * 1000).toISOString().split("T")[0]
    return itemDate === date
  })

  // Map the hourly forecasts to the desired format
  return hourlyForecasts.map((item) => ({
    time_epoch: item.dt,
    time: new Date(item.dt * 1000).toISOString(),
    temp_c: item.main.temp,
    temp_f: celsiusToFahrenheit(item.main.temp),
    is_day: isDay(item.dt, 0, 0) ? 1 : 0, // You might need to adjust sunrise/sunset times
    condition: {
      text: item.weather[0].description,
      icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
      code: item.weather[0].id,
    },
    wind_mph: mpsToMph(item.wind.speed),
    wind_kph: mpsToKph(item.wind.speed),
    wind_degree: item.wind.deg,
    wind_dir: getWindDirection(item.wind.deg),
    pressure_mb: item.main.pressure,
    pressure_in: mbToIn(item.main.pressure),
    precip_mm: item.rain ? item.rain["3h"] || 0 : 0,
    precip_in: item.rain ? mmToIn(item.rain["3h"] || 0) : 0,
    humidity: item.main.humidity,
    cloud: item.clouds.all,
    feelslike_c: item.main.feels_like,
    feelslike_f: celsiusToFahrenheit(item.main.feels_like),
    vis_km: item.visibility / 1000,
    vis_miles: mToMiles(item.visibility),
    uv: 0, // Default value
  }))
}

// Remove the getCurrentWeather function from here
// We'll move it to the API route

