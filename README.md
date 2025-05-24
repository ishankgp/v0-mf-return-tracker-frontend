# Mutual Fund Returns Tracker Frontend

A modern frontend for tracking mutual fund returns built with Next.js and Tailwind CSS.

## Features

- Display mutual fund NAV and returns across different time periods
- Sort funds by any column
- Color-coded returns (green for positive, red for negative)
- Export data to CSV
- Notes section for personal observations
- Responsive design for all devices

## Development

### Running the app

\`\`\`bash
npm install
npm run dev
\`\`\`

### Connecting to the Python Backend

The app is currently using mock data for development and preview. To connect it to your Python backend:

1. Open `services/api.ts`
2. Update the `API_BASE_URL` constant with your Python backend URL
3. Uncomment the API fetch code and comment out the mock data code

\`\`\`javascript
// Change this to your Python backend URL
const API_BASE_URL = "https://your-python-backend-url.com"

export async function fetchMutualFundData() {
  // Comment out the mock data code
  /*
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ funds: mockFunds })
    }, 1000)
  })
  */

  // Uncomment the API fetch code
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
}
\`\`\`

### Python Backend API Requirements

Your Python backend should provide these endpoints:

- `GET /api/funds` - Returns the mutual fund data
- `POST /api/refresh` - Triggers a refresh of the data

The response from `/api/funds` should have this structure:

\`\`\`json
{
  "funds": [
    {
      "id": "1",
      "name": "Fund Name",
      "nav": 45.23,
      "returns1d": 0.5,
      "returns1w": 1.2,
      "returns1m": 3.4,
      "returns3m": 8.2,
      "returns6m": 12.5,
      "returns1y": 18.3,
      "returns3y": 14.2,
      "returns5y": 16.8
    },
    // More funds...
  ]
}
\`\`\`

## Deployment

This app can be deployed to Vercel or any other Next.js hosting platform.
