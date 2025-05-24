import { NextResponse } from "next/server"

// Replace with your actual Python backend URL
const PYTHON_API_URL = "http://localhost:5000"

export async function POST() {
  try {
    // Call your Python backend to refresh data
    const response = await fetch(`${PYTHON_API_URL}/api/refresh`, {
      method: "POST",
    })

    if (!response.ok) {
      throw new Error(`Python API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error refreshing data from Python backend:", error)
    return NextResponse.json({ error: "Failed to refresh mutual fund data" }, { status: 500 })
  }
}
