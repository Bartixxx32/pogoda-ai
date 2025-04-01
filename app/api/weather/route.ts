import { type NextRequest, NextResponse } from "next/server"
import { getWeatherData } from "@/lib/actions"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const location = searchParams.get("location")

  if (!location) {
    return NextResponse.json({ error: "Parametr lokalizacji jest wymagany" }, { status: 400 })
  }

  try {
    const weatherData = await getWeatherData(location)

    if (!weatherData) {
      return NextResponse.json({ error: "Nie można pobrać danych pogodowych dla podanej lokalizacji" }, { status: 404 })
    }

    return NextResponse.json(weatherData)
  } catch (error) {
    console.error("Błąd podczas pobierania danych pogodowych:", error)
    return NextResponse.json({ error: "Nie udało się pobrać danych pogodowych" }, { status: 500 })
  }
}

