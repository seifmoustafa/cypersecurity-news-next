/**
 * Utility functions for data fetching and manipulation
 */

// Helper function to safely get data with type checking
export function safelyGetData<T>(data: Record<string, any>, key: string, defaultValue: T): T {
  if (key in data && data[key] !== undefined && data[key] !== null) {
    return data[key] as T
  }
  return defaultValue
}

// Helper function to safely parse JSON
export function safelyParseJSON<T>(jsonString: string, defaultValue: T): T {
  try {
    return JSON.parse(jsonString) as T
  } catch (error) {
    console.error("Error parsing JSON:", error)
    return defaultValue
  }
}

// Helper function to safely stringify JSON
export function safelyStringifyJSON(data: any, defaultValue = "{}"): string {
  try {
    return JSON.stringify(data)
  } catch (error) {
    console.error("Error stringifying JSON:", error)
    return defaultValue
  }
}

// Helper function to safely get data from localStorage
export function safelyGetFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") {
    return defaultValue
  }

  try {
    const item = localStorage.getItem(key)
    if (item === null) {
      return defaultValue
    }
    return safelyParseJSON(item, defaultValue)
  } catch (error) {
    console.error("Error getting data from localStorage:", error)
    return defaultValue
  }
}

// Helper function to safely set data to localStorage
export function safelySetToStorage(key: string, value: any): boolean {
  if (typeof window === "undefined") {
    return false
  }

  try {
    localStorage.setItem(key, safelyStringifyJSON(value))
    return true
  } catch (error) {
    console.error("Error setting data to localStorage:", error)
    return false
  }
}
