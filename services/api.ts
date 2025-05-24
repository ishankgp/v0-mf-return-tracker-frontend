/**
 * API service for fetching mutual fund data
 */

// Mock data that will be used in preview and as fallback
export const mockFunds = [
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
  },
  {
    id: "2",
    name: "HDFC Mid-Cap Opportunities",
    nav: 89.45,
    returns1d: -0.3,
    returns1w: 2.1,
    returns1m: 4.8,
    returns3m: 11.2,
    returns6m: 15.8,
    returns1y: 22.4,
    returns3y: 18.6,
    returns5y: 19.2,
  },
  {
    id: "3",
    name: "ICICI Prudential Liquid Fund",
    nav: 312.67,
    returns1d: 0.02,
    returns1w: 0.12,
    returns1m: 0.48,
    returns3m: 1.45,
    returns6m: 2.89,
    returns1y: 5.8,
    returns3y: 6.2,
    returns5y: 6.5,
  },
  {
    id: "4",
    name: "SBI Small Cap Fund",
    nav: 124.89,
    returns1d: 1.2,
    returns1w: 3.4,
    returns1m: 6.2,
    returns3m: 14.5,
    returns6m: 19.8,
    returns1y: 28.6,
    returns3y: 22.4,
    returns5y: 24.8,
  },
  {
    id: "5",
    name: "Kotak Corporate Bond Fund",
    nav: 2945.12,
    returns1d: 0.01,
    returns1w: 0.08,
    returns1m: 0.32,
    returns3m: 0.98,
    returns6m: 1.95,
    returns1y: 3.92,
    returns3y: 5.8,
    returns5y: 6.2,
  },
]

// For production, replace with your actual Python backend URL
const API_BASE_URL = "http://localhost:5000"

/**
 * Fetch mutual fund data
 * In preview/development: returns mock data
 * In production: fetches from API with fallback to mock data
 */
export async function fetchMutualFundData() {
  // Always use mock data for now to prevent errors
  // This can be changed when connecting to a real backend
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ funds: mockFunds })
    }, 1000) // Simulate network delay
  })

  // The code below is commented out to prevent errors in preview
  // Uncomment and modify when connecting to a real backend
  /*
  try {
    const response = await fetch(`${API_BASE_URL}/api/funds`)
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching mutual fund data:", error)
    return { funds: mockFunds }
  }
  */
}

/**
 * Refresh mutual fund data
 * In preview/development: simulates a refresh
 * In production: calls API to refresh data
 */
export async function refreshMutualFundData() {
  // Always simulate refresh for now
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: "Data refreshed" })
    }, 1500) // Simulate network delay
  })

  // The code below is commented out to prevent errors in preview
  // Uncomment and modify when connecting to a real backend
  /*
  try {
    const response = await fetch(`${API_BASE_URL}/api/refresh`, {
      method: "POST",
    })
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error refreshing mutual fund data:", error)
    throw error
  }
  */
}
