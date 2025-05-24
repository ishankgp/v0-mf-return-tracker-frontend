"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface FundDetailsDialogProps {
  fund: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Mock performance data
const performanceData = [
  { month: "Jan", value: 100 },
  { month: "Feb", value: 102 },
  { month: "Mar", value: 105 },
  { month: "Apr", value: 103 },
  { month: "May", value: 107 },
  { month: "Jun", value: 110 },
  { month: "Jul", value: 112 },
  { month: "Aug", value: 115 },
  { month: "Sep", value: 113 },
  { month: "Oct", value: 118 },
  { month: "Nov", value: 120 },
  { month: "Dec", value: 122 },
]

export function FundDetailsDialog({ fund, open, onOpenChange }: FundDetailsDialogProps) {
  if (!fund) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{fund.name}</DialogTitle>
          <DialogDescription>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline">{fund.category}</Badge>
              <Badge variant={fund.risk === "Low" ? "secondary" : fund.risk === "Medium" ? "default" : "destructive"}>
                {fund.risk} Risk
              </Badge>
            </div>
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="details">Fund Details</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Current NAV</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{fund.nav.toFixed(2)}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">1 Year Returns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${fund.returns1y > 0 ? "text-green-600" : "text-red-600"}`}>
                    {fund.returns1y > 0 ? "+" : ""}
                    {fund.returns1y.toFixed(2)}%
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium mb-4">Returns Overview</h3>
              <div className="space-y-2">
                {[
                  { label: "1 Day", value: fund.returns1d },
                  { label: "1 Week", value: fund.returns1w },
                  { label: "1 Month", value: fund.returns1m },
                  { label: "3 Months", value: fund.returns3m },
                  { label: "6 Months", value: fund.returns6m },
                  { label: "1 Year", value: fund.returns1y },
                  { label: "3 Years", value: fund.returns3y },
                  { label: "5 Years", value: fund.returns5y },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-gray-600">{item.label}</span>
                    <span className={`font-medium ${item.value > 0 ? "text-green-600" : "text-red-600"}`}>
                      {item.value > 0 ? "+" : ""}
                      {item.value.toFixed(2)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="mt-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="details" className="mt-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Fund Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fund House</span>
                    <span>{fund.name.split(" ")[0]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category</span>
                    <span>{fund.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Risk Level</span>
                    <span>{fund.risk}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Min Investment</span>
                    <span>₹5,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Exit Load</span>
                    <span>1% if redeemed within 1 year</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
