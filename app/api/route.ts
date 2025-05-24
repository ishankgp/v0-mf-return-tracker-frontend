import { NextResponse } from "next/server"

// This is a mock API route that would connect to your Python backend
// In production, this would fetch data from your Flask API

export async function GET() {
  // Mock data - replace with actual API call to your Python backend
  const funds = [
    {
      id: "1",
      name: "Axis Bluechip Fund",
      nav: 45.23,
      returns1d: 0.5,
      returns1w: 1.2,
      returns1m: 3.4,
      returns3m: 8.2,
      returns6m: 12.5,
      returns1y: 18.3,
      returns3y: 14.2,
      returns5y: 16.8,
      category: "Large Cap",
      risk: "Medium",
    },
    // Add more funds here
  ]

  return NextResponse.json({ funds })
}

export async function POST(request: Request) {
  const body = await request.json()

  // Here you would call your Python backend to fetch updated data
  // For example: const response = await fetch('http://your-python-backend/api/fetch-returns')

  return NextResponse.json({ success: true, message: "Data refreshed" })
}
