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
      : {
          weekday: "long",
          day: "numeric",
          month: "long",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false, // Use 24-hour format
        }

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
    hour12: false, // Use 24-hour format
  })
}

export function formatHourlyTime(timeString: string): string {
  const date = new Date(timeString)
  return date.toLocaleTimeString("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // Ensure 24-hour format
  })
}

// Function to convert 12-hour time format (like "08:00 AM") to 24-hour format (like "08:00")
export function convertTo24HourFormat(timeString: string): string {
  // If the timeString is already in 24-hour format or doesn't contain AM/PM, return it as is
  if (!timeString.includes("AM") && !timeString.includes("PM")) {
    return timeString
  }

  // Parse the time string
  const [timePart, meridiem] = timeString.split(" ")
  let [hours, minutes] = timePart.split(":").map(Number)

  // Convert to 24-hour format
  if (meridiem === "PM" && hours < 12) {
    hours += 12
  } else if (meridiem === "AM" && hours === 12) {
    hours = 0
  }

  // Format the time
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
}

export function formatTime(timeString: string): string {
  return convertTo24HourFormat(timeString)
}

// Format temperature with no decimal places
export function formatTemperature(temp: number): string {
  return Math.round(temp).toString()
}

// Format decimal values to 2 decimal places
export function formatDecimal(value: number): string {
  return value.toFixed(2).replace(".", ",")
}

// Format wind speed to 1 decimal place
export function formatWindSpeed(speed: number): string {
  return speed.toFixed(1).replace(".", ",")
}

// Format percentage values with no decimal places
export function formatPercentage(value: number): string {
  return Math.round(value).toString()
}

// Format pressure values with no decimal places
export function formatPressure(value: number): string {
  return Math.round(value).toString()
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

