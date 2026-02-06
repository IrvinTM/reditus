"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { SalesHistoryData } from "@/types/types"
import { useNavigate } from "react-router"

interface SalesHistoryProps {
  data: SalesHistoryData
  onPageChange?: (page: number) => void
}

export function SalesHistory({ data, onPageChange }: SalesHistoryProps) {

  
  const { content: sales, customPage } = data
  const navigate = useNavigate()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount / 100) // Assuming amounts are in cents
  }

  const handlePreviousPage = () => {
    if (customPage.number > 0) {
      onPageChange?.(customPage.number - 1)
    }
  }

  const handleNextPage = () => {
    if (customPage.number < customPage.totalPages - 1) {
      onPageChange?.(customPage.number + 1)
    }
  }

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle>Sales History</CardTitle>
        <CardDescription>
          {customPage.totalElements} total sales across {customPage.totalPages} pages
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">ID</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead className="text-right">Items</TableHead>
                <TableHead className="text-right">Discount</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-center">Register</TableHead>
                <TableHead className="text-center">Customer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.length === 0 ? (
                <TableRow >
                  <TableCell colSpan={7} className="h-24 text-center">
                    No sales found.
                  </TableCell>
                </TableRow>
              ) : (
                sales.map((sale) => (
                  <TableRow  onClick={()=> navigate(`/ventas/${sale.id}`)} key={sale.id}>
                    <TableCell className="font-mono text-sm">#{sale.id}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(sale.date.toString())}</TableCell>
                    <TableCell className="text-right">
                      {sale.items.length > 0 ? (
                        <Badge variant="secondary">
                          {sale.items.reduce((sum, item) => sum + item.quantity, 0)} items
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {sale.discount > 0 ? (
                        <span className="text-green-600 dark:text-green-400">{formatCurrency(sale.discount)}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-semibold">{formatCurrency(sale.total)}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="font-mono text-xs">
                        R{sale.cashRegisterID}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center">
                          <span className="font-medium">{sale.customerName}</span>
                          <span className="text-xs text-muted-foreground">ID: {sale.customerID}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-muted-foreground">
            Page {customPage.number + 1} of {customPage.totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={customPage.number === 0}>
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={customPage.number >= customPage.totalPages - 1}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
    </>
  )
}
