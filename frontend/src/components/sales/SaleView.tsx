import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Sale } from "@/types/types"
import { Printer } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { data, useParams } from "react-router"
import { Spinner } from "../ui/spinner"


const appUrl = import.meta.env.VITE_BACK_URL;

// Placeholder data - replace with actual data fetching
const saleData = {
  id: 2,
  items: [
    {
      id: 2,
      productId: 1,
      priceAtSale: 300,
      saleId: 0,
      quantity: 1,
    }
  ],
  date: "2025-12-25T15:40:59.390287290Z",
  discount: 0,
  total: 1620,
  cashRegisterID: 1,
  customerID: 1,
}


// Placeholder function to get product details
// Replace this with actual API call or database query
function getProductDetails(productId: number) {

  return {
    name: `Product ${productId}`,
    sku: `SKU-${productId}`,
  }
}

export default function SaleView() {
  const receiptRef = useRef<HTMLDivElement>(null)


  const { saleId } = useParams()
  const [sale, setSale] = useState<Sale>(saleData)
  const [loading, setLoading] = useState<boolean>(false)

  //
  useEffect(() => {
    setLoading(true)
    fetch(`${appUrl}/api/sales/sale/${saleId}`)
      .then(async (data) => await data.json())
      .then((data) => {
        console.log(data)
        setLoading(false)
        setSale(data)
      })
      .catch((e) => console.log(e))

  }, [])





  const handlePrint = () => {
    if (receiptRef.current) {
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        const receiptHTML = receiptRef.current.innerHTML
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Receipt - Sale #${sale.id}</title>
              <style>
                body {
                  font-family: 'Courier New', monospace;
                  padding: 20px;
                  max-width: 400px;
                  margin: 0 auto;
                }
                .receipt-header {
                  text-align: center;
                  margin-bottom: 20px;
                }
                .receipt-title {
                  font-size: 24px;
                  font-weight: bold;
                  margin-bottom: 10px;
                }
                .receipt-info {
                  margin-bottom: 20px;
                  font-size: 12px;
                }
                .receipt-items {
                  margin-bottom: 20px;
                }
                .item-row {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 8px;
                  font-size: 14px;
                }
                .separator {
                  border-top: 2px dashed #000;
                  margin: 15px 0;
                }
                .totals {
                  font-size: 14px;
                }
                .total-row {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 8px;
                }
                .total-final {
                  font-weight: bold;
                  font-size: 18px;
                }
                .receipt-footer {
                  text-align: center;
                  margin-top: 30px;
                  font-size: 12px;
                }
                @media print {
                  body {
                    padding: 0;
                  }
                }
              </style>
            </head>
            <body>
              ${receiptHTML}
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.focus()
        printWindow.print()
      }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount: number) => {
    return `$${(amount / 100).toFixed(2)}`
  }


  return (
    <>
      {loading ? <div className="min-h-screen bg-muted/30 p-4 md:p-8 flex justify-center content-center items-center"> <Spinner  className="size-6"/> </div> :
        <div>
          <div className="min-h-screen bg-muted/30 p-4 md:p-8">
            <div className="mx-auto max-w-3xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold">Sale #{saleId}
                  </h1>
                  <p className="text-sm text-muted-foreground">{formatDate(sale.date)}</p>
                </div>
                <Button onClick={handlePrint} size="lg">
                  <Printer className="mr-2 h-5 w-5" />
                  Print Receipt
                </Button>
              </div>

              <Card>
                <CardContent className="p-6 md:p-8">
                  <div ref={receiptRef}>
                    <div className="receipt-header mb-6 text-center">
                      <h2 className="receipt-title text-2xl font-bold">Your Store Name</h2>
                      <p className="text-sm text-muted-foreground">123 Main Street, City, State 12345</p>
                      <p className="text-sm text-muted-foreground">Phone: (555) 123-4567</p>
                    </div>

                    <Separator className="my-6" />

                    <div className="receipt-info mb-6 space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Receipt #:</span>
                        <span className="font-mono font-semibold">{sale.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date:</span>
                        <span className="font-mono">{formatDate(sale.date)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Register:</span>
                        <span className="font-mono">{sale.cashRegisterID}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Customer ID:</span>
                        <span className="font-mono">{sale.customerID}</span>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="receipt-items mb-6">
                      <h3 className="mb-4 text-lg font-semibold">Items</h3>
                      <div className="space-y-3">
                        {sale.items.map((item) => {
                          const product = getProductDetails(item.productId)
                          return (
                            <div key={item.id} className="space-y-1">
                              <div className="item-row flex justify-between">
                                <div className="flex-1">
                                  <div className="font-medium">{product.name}</div>
                                  <div className="text-xs text-muted-foreground">{product.sku}</div>
                                </div>
                                <div className="text-right">
                                  <div className="font-semibold">{formatCurrency(item.priceAtSale * item.quantity)}</div>
                                </div>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {item.quantity} × {formatCurrency(item.priceAtSale)}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="totals space-y-2">
                      <div className="total-row flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span className="font-mono">{formatCurrency(sale.total)}</span>
                      </div>
                      <div className="total-row flex justify-between text-sm">
                        <span className="text-muted-foreground">Discount:</span>
                        <span className="font-mono">{formatCurrency(sale.discount)}</span>
                      </div>
                      <Separator className="my-3" />
                      <div className="total-row total-final flex justify-between text-xl">
                        <span>Total:</span>
                        <span className="font-mono">{formatCurrency(sale.total)}</span>
                      </div>
                    </div>

                    <div className="receipt-footer mt-8 text-center">
                      <p className="text-sm text-muted-foreground">Thank you for your business!</p>
                      <p className="mt-2 text-xs text-muted-foreground">Please keep this receipt for your records</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

      }
    </>

  )
}
