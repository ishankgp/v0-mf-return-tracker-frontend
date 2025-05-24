"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"

interface Investment {
  id: string
  fundName: string
  amount: number
  units: number
  purchaseNav: number
  currentNav: number
  returns: number
  category: string
}

export function PortfolioTracker() {
  const [investments, setInvestments] = useState<Investment[]>([
    {
      id: "1",
      fundName: "Axis Bluechip Fund",
      amount: 50000,
      units: 1104.97,
      purchaseNav: 45.23,
      currentNav: 48.56,
      returns: 7.36,
      category: "Large Cap",
    },
  ])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const totalInvestment = investments.reduce((sum, inv) => sum + inv.amount, 0)
  const currentValue = investments.reduce((sum, inv) => sum + inv.units * inv.currentNav, 0)
  const totalReturns = ((currentValue - totalInvestment) / totalInvestment) * 100

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>My Portfolio</CardTitle>
            <CardDescription>Track your mutual fund investments</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Investment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Investment</DialogTitle>
                <DialogDescription>Enter details of your mutual fund investment</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="fund">Fund Name</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a fund" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="axis-bluechip">Axis Bluechip Fund</SelectItem>
                      <SelectItem value="hdfc-midcap">HDFC Mid-Cap Opportunities</SelectItem>
                      <SelectItem value="sbi-smallcap">SBI Small Cap Fund</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="amount">Investment Amount (₹)</Label>
                  <Input id="amount" type="number" placeholder="50000" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="nav">Purchase NAV</Label>
                  <Input id="nav" type="number" placeholder="45.23" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date">Purchase Date</Label>
                  <Input id="date" type="date" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddDialogOpen(false)}>Add Investment</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 mb-6 md:grid-cols-3">
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Total Investment</p>
            <p className="text-2xl font-bold">₹{totalInvestment.toLocaleString()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Current Value</p>
            <p className="text-2xl font-bold">₹{currentValue.toLocaleString()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Total Returns</p>
            <p className={`text-2xl font-bold ${totalReturns > 0 ? "text-green-600" : "text-red-600"}`}>
              {totalReturns > 0 ? "+" : ""}
              {totalReturns.toFixed(2)}%
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {investments.map((investment) => (
            <div key={investment.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <p className="font-medium">{investment.fundName}</p>
                <div className="flex gap-2 text-sm text-gray-600">
                  <span>Units: {investment.units}</span>
                  <span>•</span>
                  <span>NAV: ₹{investment.currentNav}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">₹{(investment.units * investment.currentNav).toLocaleString()}</p>
                <p className={`text-sm ${investment.returns > 0 ? "text-green-600" : "text-red-600"}`}>
                  {investment.returns > 0 ? "+" : ""}
                  {investment.returns.toFixed(2)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
