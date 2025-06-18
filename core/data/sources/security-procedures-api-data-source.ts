export class SecurityProceduresApiDataSource {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_PROCEDURES_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || ""

    if (!this.baseUrl) {
      console.error("No API base URL configured for security procedures")
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    try {
      const url = `${this.baseUrl}${endpoint}`
      console.log("Security Procedures API Request:", url)

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Security Procedures API Response:", data)
      return data
    } catch (error) {
      console.error("Security Procedures API Error:", error)
      throw error
    }
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    try {
      const url = `${this.baseUrl}${endpoint}`

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Security Procedures API Error:", error)
      throw error
    }
  }
}
