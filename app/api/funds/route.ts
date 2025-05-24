import { NextResponse } from "next/server"

// Replace with your actual Python backend URL
const PYTHON_API_URL = "http://localhost:5000"

export async function GET() {
  try {
    // Fetch data from your Python backend
    const response = await fetch(`${PYTHON_API_URL}/api/funds`)

    if (!response.ok) {
      throw new Error(`Python API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching from Python backend:", error)
    return NextResponse.json({ error: "Failed to fetch mutual fund data" }, { status: 500 })
  }
}
