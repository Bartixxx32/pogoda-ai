import type { WeatherData } from "./types"

export async function getCurrentWeather(location: string): Promise<WeatherData | null> {
  const apiKey = "638d52247c61567870b866ae07e83235"

  try {
    // First, get coordinates from location name
    let lat, lon
    let cityName = location

    // Check if location is already in lat,lon format
    if (location.includes(",")) {
      const [latitude, longitude] = location.split(",")
      lat = Number.parseFloat(latitude.trim())
      lon = Number.parseFloat(longitude.trim())

      // Reverse geocode to get location name
      try {
        const reverseGeoResponse = await fetch(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`,
          { next: { revalidate: 86400 } }, // Cache for 24 hours
        )

        if (reverseGeoResponse.ok) {
          const reverseGeoData = await reverseGeoResponse.json()
          if (reverseGeoData && reverseGeoData.length > 0) {
            cityName = reverseGeoData[0].local_names?.pl || reverseGeoData[0].name
            if (reverseGeoData[0].country) {
              // Get country name in Polish if available
              cityName += `, ${getCountryNameInPolish(reverseGeoData[0].country)}`
            }
          }
        }
      } catch (error) {
        console.error("Error in reverse geocoding:", error)
        // Continue with coordinates if reverse geocoding fails
      }
    } else {
      // Geocode the location name to get coordinates
      try {
        const geoResponse = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${apiKey}`,
          { next: { revalidate: 86400 } }, // Cache for 24 hours
        )

        if (!geoResponse.ok) {
          console.error(`Geocoding API error: ${geoResponse.status} ${geoResponse.statusText}`)
          return null
        }

        const geoData = await geoResponse.json()
        if (!geoData || geoData.length === 0) {
          console.error("Location not found")
          return null
        }

        lat = geoData[0].lat
        lon = geoData[0].lon

        // Update city name with more accurate data, preferring Polish names if available
        cityName = geoData[0].local_names?.pl || geoData[0].name
        if (geoData[0].country) {
          cityName += `, ${getCountryNameInPolish(geoData[0].country)}`
        }
      } catch (error) {
        console.error("Error in geocoding:", error)
        return null
      }
    }

    // Now get weather data using coordinates
    try {
      // Use OpenWeatherMap's current weather API and 5-day forecast API with Polish language
      const [currentResponse, forecastResponse] = await Promise.all([
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=pl&appid=${apiKey}`,
          { next: { revalidate: 1800 } }, // Cache for 30 minutes
        ),
        fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=pl&appid=${apiKey}`,
          { next: { revalidate: 1800 } }, // Cache for 30 minutes
        ),
      ])

      if (!currentResponse.ok || !forecastResponse.ok) {
        console.error(`Weather API error: Current: ${currentResponse.status}, Forecast: ${forecastResponse.status}`)
        return null
      }

      const currentData = await currentResponse.json()
      const forecastData = await forecastResponse.json()

      // Transform OpenWeatherMap data to our app's format
      return transformOpenWeatherData(currentData, forecastData, cityName, lat, lon)
    } catch (error) {
      console.error("Error fetching weather data:", error)
      return null
    }
  } catch (error) {
    console.error("Error in weather data retrieval:", error)
    return null
  }
}

// Function to get country name in Polish
function getCountryNameInPolish(countryCode: string): string {
  const countryNames: Record<string, string> = {
    AF: "Afganistan",
    AX: "Wyspy Alandzkie",
    AL: "Albania",
    DZ: "Algieria",
    AS: "Samoa Amerykańskie",
    AD: "Andora",
    AO: "Angola",
    AI: "Anguilla",
    AQ: "Antarktyda",
    AG: "Antigua i Barbuda",
    AR: "Argentyna",
    AM: "Armenia",
    AW: "Aruba",
    AU: "Australia",
    AT: "Austria",
    AZ: "Azerbejdżan",
    BS: "Bahamy",
    BH: "Bahrajn",
    BD: "Bangladesz",
    BB: "Barbados",
    BY: "Białoruś",
    BE: "Belgia",
    BZ: "Belize",
    BJ: "Benin",
    BM: "Bermudy",
    BT: "Bhutan",
    BO: "Boliwia",
    BQ: "Bonaire, Sint Eustatius i Saba",
    BA: "Bośnia i Hercegowina",
    BW: "Botswana",
    BV: "Wyspa Bouveta",
    BR: "Brazylia",
    IO: "Brytyjskie Terytorium Oceanu Indyjskiego",
    BN: "Brunei",
    BG: "Bułgaria",
    BF: "Burkina Faso",
    BI: "Burundi",
    CV: "Republika Zielonego Przylądka",
    KH: "Kambodża",
    CM: "Kamerun",
    CA: "Kanada",
    KY: "Kajmany",
    CF: "Republika Środkowoafrykańska",
    TD: "Czad",
    CL: "Chile",
    CN: "Chiny",
    CX: "Wyspa Bożego Narodzenia",
    CC: "Wyspy Kokosowe",
    CO: "Kolumbia",
    KM: "Komory",
    CG: "Kongo",
    CD: "Demokratyczna Republika Konga",
    CK: "Wyspy Cooka",
    CR: "Kostaryka",
    CI: "Wybrzeże Kości Słoniowej",
    HR: "Chorwacja",
    CU: "Kuba",
    CW: "Curaçao",
    CY: "Cypr",
    CZ: "Czechy",
    DK: "Dania",
    DJ: "Dżibuti",
    DM: "Dominika",
    DO: "Dominikana",
    EC: "Ekwador",
    EG: "Egipt",
    SV: "Salwador",
    GQ: "Gwinea Równikowa",
    ER: "Erytrea",
    EE: "Estonia",
    ET: "Etiopia",
    FK: "Falklandy",
    FO: "Wyspy Owcze",
    FJ: "Fidżi",
    FI: "Finlandia",
    FR: "Francja",
    GF: "Gujana Francuska",
    PF: "Polinezja Francuska",
    TF: "Francuskie Terytoria Południowe i Antarktyczne",
    GA: "Gabon",
    GM: "Gambia",
    GE: "Gruzja",
    DE: "Niemcy",
    GH: "Ghana",
    GI: "Gibraltar",
    GR: "Grecja",
    GL: "Grenlandia",
    GD: "Grenada",
    GP: "Gwadelupa",
    GU: "Guam",
    GT: "Gwatemala",
    GG: "Guernsey",
    GN: "Gwinea",
    GW: "Gwinea Bissau",
    GY: "Gujana",
    HT: "Haiti",
    HM: "Wyspy Heard i McDonalda",
    VA: "Watykan",
    HN: "Honduras",
    HK: "Hongkong",
    HU: "Węgry",
    IS: "Islandia",
    IN: "Indie",
    ID: "Indonezja",
    IR: "Iran",
    IQ: "Irak",
    IE: "Irlandia",
    IM: "Wyspa Man",
    IL: "Izrael",
    IT: "Włochy",
    JM: "Jamajka",
    JP: "Japonia",
    JE: "Jersey",
    JO: "Jordania",
    KZ: "Kazachstan",
    KE: "Kenia",
    KI: "Kiribati",
    KP: "Korea Północna",
    KR: "Korea Południowa",
    KW: "Kuwejt",
    KG: "Kirgistan",
    LA: "Laos",
    LV: "Łotwa",
    LB: "Liban",
    LS: "Lesotho",
    LR: "Liberia",
    LY: "Libia",
    LI: "Liechtenstein",
    LT: "Litwa",
    LU: "Luksemburg",
    MO: "Makau",
    MK: "Macedonia Północna",
    MG: "Madagaskar",
    MW: "Malawi",
    MY: "Malezja",
    MV: "Malediwy",
    ML: "Mali",
    MT: "Malta",
    MH: "Wyspy Marshalla",
    MQ: "Martynika",
    MR: "Mauretania",
    MU: "Mauritius",
    YT: "Majotta",
    MX: "Meksyk",
    FM: "Mikronezja",
    MD: "Mołdawia",
    MC: "Monako",
    MN: "Mongolia",
    ME: "Czarnogóra",
    MS: "Montserrat",
    MA: "Maroko",
    MZ: "Mozambik",
    MM: "Mjanma",
    NA: "Namibia",
    NR: "Nauru",
    NP: "Nepal",
    NL: "Holandia",
    NC: "Nowa Kaledonia",
    NZ: "Nowa Zelandia",
    NI: "Nikaragua",
    NE: "Niger",
    NG: "Nigeria",
    NU: "Niue",
    NF: "Norfolk",
    MP: "Mariany Północne",
    NO: "Norwegia",
    OM: "Oman",
    PK: "Pakistan",
    PW: "Palau",
    PS: "Palestyna",
    PA: "Panama",
    PG: "Papua-Nowa Gwinea",
    PY: "Paragwaj",
    PE: "Peru",
    PH: "Filipiny",
    PN: "Pitcairn",
    PL: "Polska",
    PT: "Portugalia",
    PR: "Portoryko",
    QA: "Katar",
    RE: "Reunion",
    RO: "Rumunia",
    RU: "Rosja",
    RW: "Rwanda",
    BL: "Saint-Barthélemy",
    SH: "Święta Helena, Wyspa Wniebowstąpienia i Tristan da Cunha",
    KN: "Saint Kitts i Nevis",
    LC: "Saint Lucia",
    MF: "Saint-Martin",
    PM: "Saint-Pierre i Miquelon",
    VC: "Saint Vincent i Grenadyny",
    WS: "Samoa",
    SM: "San Marino",
    ST: "Wyspy Świętego Tomasza i Książęca",
    SA: "Arabia Saudyjska",
    SN: "Senegal",
    RS: "Serbia",
    SC: "Seszele",
    SL: "Sierra Leone",
    SG: "Singapur",
    SX: "Sint Maarten",
    SK: "Słowacja",
    SI: "Słowenia",
    SB: "Wyspy Salomona",
    SO: "Somalia",
    ZA: "Republika Południowej Afryki",
    GS: "Georgia Południowa i Sandwich Południowy",
    SS: "Sudan Południowy",
    ES: "Hiszpania",
    LK: "Sri Lanka",
    SD: "Sudan",
    SR: "Surinam",
    SJ: "Svalbard i Jan Mayen",
    SZ: "Eswatini",
    SE: "Szwecja",
    CH: "Szwajcaria",
    SY: "Syria",
    TW: "Tajwan",
    TJ: "Tadżykistan",
    TZ: "Tanzania",
    TH: "Tajlandia",
    TL: "Timor Wschodni",
    TG: "Togo",
    TK: "Tokelau",
    TO: "Tonga",
    TT: "Trynidad i Tobago",
    TN: "Tunezja",
    TR: "Turcja",
    TM: "Turkmenistan",
    TC: "Turks i Caicos",
    TV: "Tuvalu",
    UG: "Uganda",
    UA: "Ukraina",
    AE: "Zjednoczone Emiraty Arabskie",
    GB: "Wielka Brytania",
    US: "Stany Zjednoczone",
    UM: "Dalekie Wyspy Mniejsze Stanów Zjednoczonych",
    UY: "Urugwaj",
    UZ: "Uzbekistan",
    VU: "Vanuatu",
    VE: "Wenezuela",
    VN: "Wietnam",
    VG: "Brytyjskie Wyspy Dziewicze",
    VI: "Wyspy Dziewicze Stanów Zjednoczonych",
    WF: "Wallis i Futuna",
    EH: "Sahara Zachodnia",
    YE: "Jemen",
    ZM: "Zambia",
    ZW: "Zimbabwe",
  }

  return countryNames[countryCode] || countryCode
}

// Function to transform OpenWeatherMap data to our app's format
function transformOpenWeatherData(
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
  const dailyForecasts = processDailyForecasts(forecastData.list)

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
function processDailyForecasts(forecastList: any[]): Record<string, any> {
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

  // Calculate sunrise/sunset times (use first day's values for all days as approximation)
  const now = new Date()
  const sunriseTime = new Date(now)
  sunriseTime.setHours(6, 0, 0, 0)
  const sunsetTime = new Date(now)
  sunsetTime.setHours(18, 0, 0, 0)

  Object.keys(dailyForecasts).forEach((date) => {
    const dayDate = new Date(date)
    const sunrise = new Date(dayDate)
    sunrise.setHours(6, 0, 0, 0)
    const sunset = new Date(dayDate)
    sunset.setHours(18, 0, 0, 0)

    dailyForecasts[date].sunrise = Math.floor(sunrise.getTime() / 1000)
    dailyForecasts[date].sunset = Math.floor(sunset.getTime() / 1000)
  })

  return dailyForecasts
}

// Generate hourly forecast for a specific day
function generateHourlyForecast(forecastList: any[], date: string): any[] {
  const hours = []
  const dayForecasts = forecastList.filter((item) => {
    const itemDate = new Date(item.dt * 1000).toISOString().split("T")[0]
    return itemDate === date
  })

  dayForecasts.forEach((hour) => {
    const hourTime = new Date(hour.dt * 1000)

    hours.push({
      time_epoch: hour.dt,
      time: hourTime.toISOString(),
      temp_c: hour.main.temp,
      temp_f: celsiusToFahrenheit(hour.main.temp),
      is_day: hourTime.getHours() >= 6 && hourTime.getHours() < 18 ? 1 : 0,
      condition: {
        text: hour.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`,
        code: hour.weather[0].id,
      },
      wind_mph: mpsToMph(hour.wind.speed),
      wind_kph: mpsToKph(hour.wind.speed),
      wind_degree: hour.wind.deg,
      wind_dir: getWindDirection(hour.wind.deg),
      pressure_mb: hour.main.pressure,
      pressure_in: mbToIn(hour.main.pressure),
      precip_mm: hour.rain ? hour.rain["3h"] || 0 : 0,
      precip_in: hour.rain ? mmToIn(hour.rain["3h"] || 0) : 0,
      humidity: hour.main.humidity,
      cloud: hour.clouds.all,
      feelslike_c: hour.main.feels_like,
      feelslike_f: celsiusToFahrenheit(hour.main.feels_like),
      windchill_c: hour.main.feels_like,
      windchill_f: celsiusToFahrenheit(hour.main.feels_like),
      heatindex_c: hour.main.feels_like,
      heatindex_f: celsiusToFahrenheit(hour.main.feels_like),
      dewpoint_c: calculateDewPoint(hour.main.temp, hour.main.humidity),
      dewpoint_f: celsiusToFahrenheit(calculateDewPoint(hour.main.temp, hour.main.humidity)),
      will_it_rain: hour.pop > 0.3 ? 1 : 0,
      chance_of_rain: Math.round((hour.pop || 0) * 100),
      will_it_snow: hour.snow && hour.snow["3h"] > 0 ? 1 : 0,
      chance_of_snow: hour.snow ? Math.round((hour.pop || 0) * 100) : 0,
      vis_km: hour.visibility / 1000,
      vis_miles: mToMiles(hour.visibility),
      gust_mph: hour.wind.gust ? mpsToMph(hour.wind.gust) : mpsToMph(hour.wind.speed * 1.5),
      gust_kph: hour.wind.gust ? mpsToKph(hour.wind.gust) : mpsToKph(hour.wind.speed * 1.5),
      uv: 0, // Default value
    })
  })

  return hours
}

// Helper functions for data conversion
function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32
}

function mpsToKph(mps: number): number {
  return mps * 3.6
}

function mpsToMph(mps: number): number {
  return mps * 2.237
}

function mmToIn(mm: number): number {
  return mm / 25.4
}

function mToMiles(meters: number): number {
  return meters / 1609.34
}

function mbToIn(mb: number): number {
  return mb * 0.02953
}

function formatUnixTime(unixTime: number): string {
  const date = new Date(unixTime * 1000)
  const hours = date.getHours().toString().padStart(2, "0")
  const minutes = date.getMinutes().toString().padStart(2, "0")
  return `${hours}:${minutes}`
}

function isDay(currentTime: number, sunrise: number, sunset: number): boolean {
  return currentTime >= sunrise && currentTime < sunset
}

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

function calculateDewPoint(temp: number, humidity: number): number {
  // Magnus formula
  const a = 17.27
  const b = 237.7
  const alpha = (a * temp) / (b + temp) + Math.log(humidity / 100)
  return (b * alpha) / (a - alpha)
}

