"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Download, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { NotesSection } from "@/components/notes-section"
import { fetchMutualFundData, refreshMutualFundData } from "@/services/api"

interface MutualFundResponse {
  funds: MutualFund[]
}

interface MutualFund {
  id: string
  name: string
  nav: number
  returns1d: number
  returns1w: number
  returns1m: number
  returns3m: number
  returns6m: number
  returns1y: number
  returns3y: number
  returns5y: number
  category: string
  risk: "Low" | "Medium" | "High"
  dates?: Record<string, string>
  current_date?: string
}

type SortKey = keyof MutualFund
type SortOrder = "asc" | "desc"

// Helper to parse DD-MM-YYYY date strings
function parseDMY(dateStr?: string) {
  if (!dateStr || typeof dateStr !== "string") return undefined;
  const [day, month, year] = dateStr.split("-");
  if (!day || !month || !year) return undefined;
  return new Date(Number(year), Number(month) - 1, Number(day));
}

export default function Home() {
  const [funds, setFunds] = useState<MutualFund[]>([])
  const [sortKey, setSortKey] = useState<SortKey>("name")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  // Fetch data on component mount
  useEffect(() => {
    async function fetchFunds() {
      setIsLoading(true)
      try {
        const res = await fetch("http://127.0.0.1:5000/api/funds")
        const data = (await res.json()) as MutualFundResponse
        setFunds(data.funds)
        setLastUpdated(new Date().toISOString())
      } catch (err) {
        console.error("Failed to fetch fund data:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchFunds()
  }, [])

  // Function to load fund data
  const loadFundData = async () => {
    setIsLoading(true)
    try {
      const data = await fetchMutualFundData() as MutualFundResponse
      setFunds(data.funds || [])
      setLastUpdated(new Date().toISOString())
    } catch (err) {
      console.error("Failed to fetch fund data:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Function to refresh fund data
  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      await refreshMutualFundData()
      const data = await fetchMutualFundData()
      setFunds(data.funds || [])
      setLastUpdated(new Date().toISOString())
    } catch (err) {
      console.error("Failed to refresh fund data:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSort = (key: keyof MutualFund) => {
    setSortKey(key)
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  const getReturnColor = (value: number) => {
    if (value > 0) {
      return "text-green-500"
    } else if (value < 0) {
      return "text-red-500"
    } else {
      return "text-gray-500"
    }
  }

  const formatDate = (date: Date) => {
    if (!date) return "Never"
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date)
  }

  // Handle CSV export
  const handleExport = () => {
    // Create CSV content
    const headers = ["Fund Name", "NAV", "1D", "1W", "1M", "3M", "6M", "1Y", "3Y", "5Y"]
    const csvContent = [
      headers.join(","),
      ...funds.map((fund) =>
        [
          `"${fund.name}"`,
          fund.nav,
          fund.returns1d,
          fund.returns1w,
          fund.returns1m,
          fund.returns3m,
          fund.returns6m,
          fund.returns1y,
          fund.returns3y,
          fund.returns5y,
        ].join(","),
      ),
    ].join("\n")

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `mutual-fund-data-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredAndSortedFunds = [...funds].sort((a, b) => {
    const aValue = a[sortKey]
    const bValue = b[sortKey]

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue
    }

    return 0
  })

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Fund Performance</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
                <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
              </Button>
              <Button variant="outline" size="icon" onClick={handleExport} disabled={isLoading || funds.length === 0}>
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px] sticky left-0 bg-white">
                    <Button variant="ghost" onClick={() => handleSort("name")} className="h-auto p-0 font-medium">
                      Fund Name
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <div className="flex flex-col items-center">
                      <Button variant="ghost" onClick={() => handleSort("nav")} className="h-auto p-0 font-medium">
                        Current NAV
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                      <span className="text-xs text-muted-foreground mt-1">
                        {parseDMY(funds[0]?.dates?.current || funds[0]?.current_date)?.toLocaleDateString('en-GB') || ""}
                      </span>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex flex-col items-center">
                      <Button variant="ghost" onClick={() => handleSort("returns1d")} className="h-auto p-0 font-medium">
                        1 Day
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                      <span className="text-xs text-muted-foreground mt-1">
                        {parseDMY(funds[0]?.dates?.["1day"])?.toLocaleDateString('en-GB') || ""}
                      </span>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex flex-col items-center">
                      <Button variant="ghost" onClick={() => handleSort("returns1w")} className="h-auto p-0 font-medium">
                        1 Week
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                      <span className="text-xs text-muted-foreground mt-1">
                        {parseDMY(funds[0]?.dates?.["1week"])?.toLocaleDateString('en-GB') || ""}
                      </span>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex flex-col items-center">
                      <Button variant="ghost" onClick={() => handleSort("returns1m")} className="h-auto p-0 font-medium">
                        1 Month
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                      <span className="text-xs text-muted-foreground mt-1">
                        {parseDMY(funds[0]?.dates?.["1month"])?.toLocaleDateString('en-GB') || ""}
                      </span>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex flex-col items-center">
                      <Button variant="ghost" onClick={() => handleSort("returns3m")} className="h-auto p-0 font-medium">
                        3 Months
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                      <span className="text-xs text-muted-foreground mt-1">
                        {parseDMY(funds[0]?.dates?.["3month"])?.toLocaleDateString('en-GB') || ""}
                      </span>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex flex-col items-center">
                      <Button variant="ghost" onClick={() => handleSort("returns6m")} className="h-auto p-0 font-medium">
                        6 Months
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                      <span className="text-xs text-muted-foreground mt-1">
                        {parseDMY(funds[0]?.dates?.["6month"])?.toLocaleDateString('en-GB') || ""}
                      </span>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex flex-col items-center">
                      <Button variant="ghost" onClick={() => handleSort("returns1y")} className="h-auto p-0 font-medium">
                        1 Year
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                      <span className="text-xs text-muted-foreground mt-1">
                        {parseDMY(funds[0]?.dates?.["1year"])?.toLocaleDateString('en-GB') || ""}
                      </span>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex flex-col items-center">
                      <Button variant="ghost" onClick={() => handleSort("returns3y")} className="h-auto p-0 font-medium">
                        3 Years
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                      <span className="text-xs text-muted-foreground mt-1">
                        {parseDMY(funds[0]?.dates?.["3year"])?.toLocaleDateString('en-GB') || ""}
                      </span>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex flex-col items-center">
                      <Button variant="ghost" onClick={() => handleSort("returns5y")} className="h-auto p-0 font-medium">
                        5 Years
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                      <span className="text-xs text-muted-foreground mt-1">
                        {parseDMY(funds[0]?.dates?.["5year"])?.toLocaleDateString('en-GB') || ""}
                      </span>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center">
                      <div className="flex justify-center items-center">
                        <RefreshCw className="h-6 w-6 animate-spin text-gray-400 mr-2" />
                        <span>Loading fund data...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredAndSortedFunds.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center">
                      No mutual fund data available
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedFunds.map((fund) => (
                    <TableRow key={fund.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{fund.name}</TableCell>
                      <TableCell className="text-right">₹{fund.nav.toFixed(2)}</TableCell>
                      <TableCell className={cn("text-right", getReturnColor(fund.returns1d))}>
                        {fund.returns1d > 0 ? "+" : ""}
                        {fund.returns1d.toFixed(2)}%
                      </TableCell>
                      <TableCell className={cn("text-right", getReturnColor(fund.returns1w))}>
                        {fund.returns1w > 0 ? "+" : ""}
                        {fund.returns1w.toFixed(2)}%
                      </TableCell>
                      <TableCell className={cn("text-right", getReturnColor(fund.returns1m))}>
                        {fund.returns1m > 0 ? "+" : ""}
                        {fund.returns1m.toFixed(2)}%
                      </TableCell>
                      <TableCell className={cn("text-right", getReturnColor(fund.returns3m))}>
                        {fund.returns3m > 0 ? "+" : ""}
                        {fund.returns3m.toFixed(2)}%
                      </TableCell>
                      <TableCell className={cn("text-right", getReturnColor(fund.returns6m))}>
                        {fund.returns6m > 0 ? "+" : ""}
                        {fund.returns6m.toFixed(2)}%
                      </TableCell>
                      <TableCell className={cn("text-right", getReturnColor(fund.returns1y))}>
                        {fund.returns1y > 0 ? "+" : ""}
                        {fund.returns1y.toFixed(2)}%
                      </TableCell>
                      <TableCell className={cn("text-right", getReturnColor(fund.returns3y))}>
                        {fund.returns3y > 0 ? "+" : ""}
                        {fund.returns3y.toFixed(2)}%
                      </TableCell>
                      <TableCell className={cn("text-right", getReturnColor(fund.returns5y))}>
                        {fund.returns5y > 0 ? "+" : ""}
                        {fund.returns5y.toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Move summary cards here */}
      <div className="grid gap-6 mt-8 mb-8 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Funds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{funds.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Best Performer (1Y)</CardTitle>
          </CardHeader>
          <CardContent>
            {funds.length > 0 ? (
              <>
                <div className="text-2xl font-bold text-green-600">
                  +{Math.max(...funds.map((fund) => fund.returns1y || 0)).toFixed(2)}%
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {
                    funds.reduce(
                      (best, fund) => ((fund.returns1y || 0) > (best.returns1y || 0) ? fund : best),
                      funds[0],
                    ).name
                  }
                </p>
              </>
            ) : (
              <div className="text-2xl font-bold">-</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Average Returns (1Y)</CardTitle>
          </CardHeader>
          <CardContent>
            {funds.length > 0 ? (
              <div className="text-2xl font-bold">
                {(funds.reduce((sum, fund) => sum + (fund.returns1y || 0), 0) / funds.length).toFixed(2)}%
              </div>
            ) : (
              <div className="text-2xl font-bold">-</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Last Updated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lastUpdated ? formatDate(new Date(lastUpdated)).split(",")[0] : "Never"}</div>
            <p className="text-xs text-gray-500 mt-1">{lastUpdated ? formatDate(new Date(lastUpdated)).split(",")[1] : ""}</p>
          </CardContent>
        </Card>
      </div>

      {/* Notes Section at the bottom of the page */}
      <div className="mt-8">
        <NotesSection />
      </div>
    </div>
  )
}
