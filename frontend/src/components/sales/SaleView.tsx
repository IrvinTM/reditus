import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Company, PaymentMethod, RefundResponse, SaleResponse } from "@/types/types"
import { Ban, Printer, Undo2 } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { useParams, useSearchParams } from "react-router"
import { toast } from "sonner"
import { Spinner } from "../ui/spinner"
import { useAuth } from "@/auth/AuthContext"
import { getDeviceRegisterId } from "@/hooks/use-register"
import { apiErrorMessage, formatDateTime, paymentMethodLabels, saleStatusLabels, toPriceString } from "@/utils/utils"
import { PRINT_CSS } from "@/utils/print"
import { Receipt, fetchCompany, printReceipt } from "./Receipt"

const appUrl = import.meta.env.VITE_BACK_URL

export default function SaleView() {
  const { saleId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const { isAdmin } = useAuth()
  const [sale, setSale] = useState<SaleResponse | null>(null)
  const [company, setCompany] = useState<Company | null>(null)
  const [refunds, setRefunds] = useState<RefundResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [voidOpen, setVoidOpen] = useState(false)
  const [refundOpen, setRefundOpen] = useState(false)
  const autoPrinted = useRef(false)

  const load = useCallback(async () => {
    try {
      const [saleResponse, refundsResponse, companyData] = await Promise.all([
        fetch(`${appUrl}/api/sales/sale/${saleId}`),
        fetch(`${appUrl}/api/sales/${saleId}/refunds`),
        fetchCompany(),
      ])
      if (!saleResponse.ok) {
        toast.error(await apiErrorMessage(saleResponse, "No se encontró la venta"))
        return
      }
      const data: SaleResponse = await saleResponse.json()
      setSale(data)
      setCompany(companyData)
      setRefunds(refundsResponse.ok ? await refundsResponse.json() : [])

      if (searchParams.get("print") === "1" && !autoPrinted.current) {
        autoPrinted.current = true
        setSearchParams({}, { replace: true })
        printReceipt(data, companyData)
      }
    } finally {
      setLoading(false)
    }
  }, [saleId])

  useEffect(() => {
    load()
  }, [load])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <Spinner className="size-6" />
      </div>
    )
  }

  if (!sale) {
    return <div className="p-8 text-center text-muted-foreground">Venta no encontrada.</div>
  }

  const canVoid = isAdmin && sale.status === "COMPLETED"
  const canRefund = isAdmin && (sale.status === "COMPLETED" || sale.status === "PARTIALLY_REFUNDED")

  return (
    <div className="bg-muted/30 p-4 md:p-8">
      <div className="mx-auto max-w-4xl grid gap-6 md:grid-cols-[1fr_auto]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold">Venta #{sale.id}</h1>
            <Badge variant={sale.status === "COMPLETED" ? "secondary" : "destructive"}>
              {saleStatusLabels[sale.status]}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{formatDateTime(sale.date)}</p>

          <div className="flex flex-wrap gap-2">
            <Button onClick={() => printReceipt(sale, company)}>
              <Printer className="mr-2 h-4 w-4" /> Imprimir recibo
            </Button>
            {canRefund && (
              <Button variant="outline" onClick={() => setRefundOpen(true)}>
                <Undo2 className="mr-2 h-4 w-4" /> Devolución
              </Button>
            )}
            {canVoid && (
              <Button variant="destructive" onClick={() => setVoidOpen(true)}>
                <Ban className="mr-2 h-4 w-4" /> Anular venta
              </Button>
            )}
          </div>

          {sale.status === "VOIDED" && (
            <Card>
              <CardContent className="pt-6 text-sm">
                Anulada por <b>{sale.voidedBy ?? "—"}</b> el {formatDateTime(sale.voidedAt)}.
                <br />
                Motivo: {sale.voidReason}
              </CardContent>
            </Card>
          )}

          {refunds.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Devoluciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {refunds.map((refund) => (
                  <div key={refund.id} className="border-b pb-2 last:border-0">
                    <div className="flex justify-between font-medium">
                      <span>{formatDateTime(refund.date)} · {refund.user ?? "—"}</span>
                      <span>{toPriceString(refund.amount)} ({paymentMethodLabels[refund.method]})</span>
                    </div>
                    <div className="text-muted-foreground">
                      {refund.items.map((item) => `${item.quantity} x ${item.productName}`).join(", ")}
                    </div>
                    <div className="text-muted-foreground">Motivo: {refund.reason}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="bg-white text-black w-fit mx-auto">
          <CardContent className="p-2">
            <style>{PRINT_CSS}</style>
            <Receipt sale={sale} company={company} />
          </CardContent>
        </Card>
      </div>

      <VoidDialog open={voidOpen} onOpenChange={setVoidOpen} sale={sale} onDone={load} />
      <RefundDialog open={refundOpen} onOpenChange={setRefundOpen} sale={sale} onDone={load} />
    </div>
  )
}

type ActionDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  sale: SaleResponse
  onDone: () => void
}

function VoidDialog({ open, onOpenChange, sale, onDone }: ActionDialogProps) {
  const [reason, setReason] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const cashPaid = sale.payments.filter((p) => p.method === "CASH").reduce((sum, p) => sum + p.amount, 0)
  const otherPaid = sale.total - cashPaid

  const submit = async () => {
    setSubmitting(true)
    try {
      const response = await fetch(`${appUrl}/api/sales/${sale.id}/void`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason, cashRegisterId: getDeviceRegisterId() }),
      })
      if (!response.ok) {
        toast.error(await apiErrorMessage(response, "No se pudo anular la venta"))
        return
      }
      toast.success("Venta anulada")
      onOpenChange(false)
      setReason("")
      onDone()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Anular venta #{sale.id}</DialogTitle>
          <DialogDescription>
            Los productos vuelven al inventario.
            {cashPaid > 0 && <> Entregue {toPriceString(cashPaid)} en efectivo de esta caja.</>}
            {otherPaid > 0 && <> Revierta {toPriceString(otherPaid)} pagados con tarjeta u otros medios.</>}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="void-reason">Motivo</Label>
          <Input id="void-reason" value={reason} onChange={(e) => setReason(e.target.value)} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button variant="destructive" disabled={!reason.trim() || submitting} onClick={submit}>
            Anular
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function RefundDialog({ open, onOpenChange, sale, onDone }: ActionDialogProps) {
  const [quantities, setQuantities] = useState<Record<number, number>>({})
  const [reason, setReason] = useState("")
  const [method, setMethod] = useState<PaymentMethod>("CASH")
  const [submitting, setSubmitting] = useState(false)

  const items = Object.entries(quantities)
    .filter(([, quantity]) => quantity > 0)
    .map(([saleItemId, quantity]) => ({ saleItemId: Number(saleItemId), quantity }))

  const submit = async () => {
    setSubmitting(true)
    try {
      const response = await fetch(`${appUrl}/api/sales/${sale.id}/refunds`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, reason, method, cashRegisterId: getDeviceRegisterId() }),
      })
      if (!response.ok) {
        toast.error(await apiErrorMessage(response, "No se pudo registrar la devolución"))
        return
      }
      const refund: RefundResponse = await response.json()
      toast.success(`Devolución registrada: entregar ${toPriceString(refund.amount)}`)
      onOpenChange(false)
      setQuantities({})
      setReason("")
      onDone()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Devolución de la venta #{sale.id}</DialogTitle>
          <DialogDescription>
            Indique cuántas unidades devuelve el cliente. El monto se calcula con el precio pagado, incluyendo el
            descuento de la venta.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {sale.items.map((item) => {
            const refundable = item.quantity - item.refundedQuantity
            return (
              <div key={item.id} className="flex items-center justify-between gap-4">
                <div className="text-sm">
                  <div className="font-medium">{item.productName}</div>
                  <div className="text-muted-foreground">
                    Vendidas {item.quantity}, devueltas {item.refundedQuantity}
                  </div>
                </div>
                <Input
                  type="number"
                  className="w-24"
                  min={0}
                  max={refundable}
                  disabled={refundable === 0}
                  value={quantities[item.id] ?? 0}
                  onChange={(e) => {
                    const value = Math.max(0, Math.min(refundable, Number.parseInt(e.target.value) || 0))
                    setQuantities((previous) => ({ ...previous, [item.id]: value }))
                  }}
                />
              </div>
            )
          })}
          <div className="space-y-2">
            <Label>Devolver con</Label>
            <Select value={method} onValueChange={(value) => setMethod(value as PaymentMethod)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(paymentMethodLabels) as PaymentMethod[]).map((m) => (
                  <SelectItem key={m} value={m}>{paymentMethodLabels[m]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="refund-reason">Motivo</Label>
            <Input id="refund-reason" value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button disabled={items.length === 0 || !reason.trim() || submitting} onClick={submit}>
            Registrar devolución
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
