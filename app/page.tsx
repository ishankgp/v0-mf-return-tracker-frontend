"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpDown, TrendingUp, TrendingDown, Search, RefreshCw, Download } from "lucide-react"
import { cn } from "@/lib/utils"

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
}

// Mock data - in real app, this would come from your API
const mockFunds: MutualFund[] = [
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
    category: "Mid Cap",
    risk: "High",
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
    category: "Liquid",
    risk: "Low",
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
    category: "Small Cap",
    risk: "High",
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
    category: "Debt",
    risk: "Low",
  },
]

type SortKey = keyof MutualFund
type SortOrder = "asc" | "desc"

export default function MutualFundTracker() {
  const [funds, setFunds] = useState<MutualFund[]>(mockFunds)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("name")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedRisk, setSelectedRisk] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(false)

  const categories = ["all", "Large Cap", "Mid Cap", "Small Cap", "Liquid", "Debt"]
  const riskLevels = ["all", "Low", "Medium", "High"]

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortOrder("asc")
    }
  }

  const filteredAndSortedFunds = funds
    .filter((fund) => {
      const matchesSearch = fund.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || fund.category === selectedCategory
      const matchesRisk = selectedRisk === "all" || fund.risk === selectedRisk
      return matchesSearch && matchesCategory && matchesRisk
    })
    .sort((a, b) => {
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

  const handleRefresh = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const getReturnColor = (value: number) => {
    if (value > 0) return "text-green-600"
    if (value < 0) return "text-red-600"
    return "text-gray-600"
  }

  const getReturnIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="w-4 h-4 inline ml-1" />
    if (value < 0) return <TrendingDown className="w-4 h-4 inline ml-1" />
    return null
  }

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case "Low":
        return "secondary"
      case "Medium":
        return "default"
      case "High":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Mutual Fund Returns Tracker</h1>
          <p className="text-gray-600">Track and analyze mutual fund performance across multiple timeframes</p>
        </div>

        <div className="grid gap-6 mb-8 md:grid-cols-4">
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
              <div className="text-2xl font-bold text-green-600">+28.6%</div>
              <p className="text-xs text-gray-500 mt-1">SBI Small Cap Fund</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Average Returns (1Y)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+15.7%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Last Updated</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Today</div>
              <p className="text-xs text-gray-500 mt-1">3:30 PM IST</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle>Fund Performance</CardTitle>
              <div className="flex flex-col md:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search funds..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full md:w-64"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedRisk} onValueChange={setSelectedRisk}>
                  <SelectTrigger className="w-full md:w-32">
                    <SelectValue placeholder="Risk" />
                  </SelectTrigger>
                  <SelectContent>
                    {riskLevels.map((risk) => (
                      <SelectItem key={risk} value={risk}>
                        {risk === "all" ? "All Risk" : risk}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
                  <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
                </Button>
                <Button variant="outline" size="icon">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All Periods</TabsTrigger>
                <TabsTrigger value="short">Short Term</TabsTrigger>
                <TabsTrigger value="medium">Medium Term</TabsTrigger>
                <TabsTrigger value="long">Long Term</TabsTrigger>
                <TabsTrigger value="custom">Custom</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-6">
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[250px]">
                          <Button variant="ghost" onClick={() => handleSort("name")} className="h-auto p-0 font-medium">
                            Fund Name
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Risk</TableHead>
                        <TableHead className="text-right">
                          <Button variant="ghost" onClick={() => handleSort("nav")} className="h-auto p-0 font-medium">
                            NAV
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-right">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("returns1d")}
                            className="h-auto p-0 font-medium"
                          >
                            1D
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-right">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("returns1w")}
                            className="h-auto p-0 font-medium"
                          >
                            1W
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-right">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("returns1m")}
                            className="h-auto p-0 font-medium"
                          >
                            1M
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-right">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("returns3m")}
                            className="h-auto p-0 font-medium"
                          >
                            3M
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-right">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("returns6m")}
                            className="h-auto p-0 font-medium"
                          >
                            6M
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-right">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("returns1y")}
                            className="h-auto p-0 font-medium"
                          >
                            1Y
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-right">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("returns3y")}
                            className="h-auto p-0 font-medium"
                          >
                            3Y
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-right">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("returns5y")}
                            className="h-auto p-0 font-medium"
                          >
                            5Y
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAndSortedFunds.map((fund) => (
                        <TableRow key={fund.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">{fund.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{fund.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getRiskBadgeVariant(fund.risk)}>{fund.risk}</Badge>
                          </TableCell>
                          <TableCell className="text-right">₹{fund.nav.toFixed(2)}</TableCell>
                          <TableCell className={cn("text-right", getReturnColor(fund.returns1d))}>
                            {fund.returns1d > 0 ? "+" : ""}
                            {fund.returns1d.toFixed(2)}%{getReturnIcon(fund.returns1d)}
                          </TableCell>
                          <TableCell className={cn("text-right", getReturnColor(fund.returns1w))}>
                            {fund.returns1w > 0 ? "+" : ""}
                            {fund.returns1w.toFixed(2)}%{getReturnIcon(fund.returns1w)}
                          </TableCell>
                          <TableCell className={cn("text-right", getReturnColor(fund.returns1m))}>
                            {fund.returns1m > 0 ? "+" : ""}
                            {fund.returns1m.toFixed(2)}%{getReturnIcon(fund.returns1m)}
                          </TableCell>
                          <TableCell className={cn("text-right", getReturnColor(fund.returns3m))}>
                            {fund.returns3m > 0 ? "+" : ""}
                            {fund.returns3m.toFixed(2)}%{getReturnIcon(fund.returns3m)}
                          </TableCell>
                          <TableCell className={cn("text-right", getReturnColor(fund.returns6m))}>
                            {fund.returns6m > 0 ? "+" : ""}
                            {fund.returns6m.toFixed(2)}%{getReturnIcon(fund.returns6m)}
                          </TableCell>
                          <TableCell className={cn("text-right", getReturnColor(fund.returns1y))}>
                            {fund.returns1y > 0 ? "+" : ""}
                            {fund.returns1y.toFixed(2)}%{getReturnIcon(fund.returns1y)}
                          </TableCell>
                          <TableCell className={cn("text-right", getReturnColor(fund.returns3y))}>
                            {fund.returns3y > 0 ? "+" : ""}
                            {fund.returns3y.toFixed(2)}%{getReturnIcon(fund.returns3y)}
                          </TableCell>
                          <TableCell className={cn("text-right", getReturnColor(fund.returns5y))}>
                            {fund.returns5y > 0 ? "+" : ""}
                            {fund.returns5y.toFixed(2)}%{getReturnIcon(fund.returns5y)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              <TabsContent value="short" className="mt-6">
                <p className="text-gray-600">Short term returns view (1D - 3M)</p>
              </TabsContent>
              <TabsContent value="medium" className="mt-6">
                <p className="text-gray-600">Medium term returns view (6M - 1Y)</p>
              </TabsContent>
              <TabsContent value="long" className="mt-6">
                <p className="text-gray-600">Long term returns view (3Y - 5Y)</p>
              </TabsContent>
              <TabsContent value="custom" className="mt-6">
                <p className="text-gray-600">Custom date range selection coming soon...</p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
