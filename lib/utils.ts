import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string, shortFormat = false, polish = true): string {
  const date = new Date(dateString)

  if (polish) {
    const options: Intl.DateTimeFormatOptions = shortFormat
      ? { weekday: "short", day: "numeric", month: "short" }
      : { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }

    return new Intl.DateTimeFormat("pl-PL", options).format(date)
  }

  if (shortFormat) {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatHourlyTime(timeString: string): string {
  const date = new Date(timeString)
  return date.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })
}

export function formatTime(timeString: string): string {
  return timeString
}

export function formatTemperature(temp: number): string {
  return Math.round(temp).toString()
}

export function getWindDirection(dir: string): string {
  const directions: Record<string, string> = {
    N: "Północny",
    NNE: "Północno-północno-wschodni",
    NE: "Północno-wschodni",
    ENE: "Wschodnio-północno-wschodni",
    E: "Wschodni",
    ESE: "Wschodnio-południowo-wschodni",
    SE: "Południowo-wschodni",
    SSE: "Południowo-południowo-wschodni",
    S: "Południowy",
    SSW: "Południowo-południowo-zachodni",
    SW: "Południowo-zachodni",
    WSW: "Zachodnio-południowo-zachodni",
    W: "Zachodni",
    WNW: "Zachodnio-północno-zachodni",
    NW: "Północno-zachodni",
    NNW: "Północno-północno-zachodni",
  }

  return directions[dir] || dir
}

