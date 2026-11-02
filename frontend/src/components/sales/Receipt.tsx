import { renderToStaticMarkup } from "react-dom/server"
import { Company, SaleResponse } from "@/types/types"
import { formatDateTime, paymentMethodLabels, toPriceString } from "@/utils/utils"
import { printHtml } from "@/utils/print"

const appUrl = import.meta.env.VITE_BACK_URL

const statusBanner: Partial<Record<SaleResponse["status"], string>> = {
  VOIDED: "VENTA ANULADA",
  REFUNDED: "VENTA DEVUELTA",
  PARTIALLY_REFUNDED: "DEVOLUCIÓN PARCIAL",
}

/** Sale receipt, styled by PRINT_CSS so it looks the same on screen and on paper. */
export function Receipt({ sale, company }: { sale: SaleResponse; company: Company | null }) {
  const banner = statusBanner[sale.status]
  return (
    <div className="print-doc">
      <div className="center">
        {company?.logo && <img className="logo" src={company.logo} alt="" />}
        <div className="title">{company?.name || "Reditus"}</div>
        {company?.address && <div className="muted">{company.address}</div>}
        {company?.phoneNumber && <div className="muted">Tel: {company.phoneNumber}</div>}
        {company?.email && <div className="muted">{company.email}</div>}
      </div>
      <div className="sep" />
      <div className="row"><span>Recibo</span><span>#{sale.id}</span></div>
      <div className="row"><span>Fecha</span><span>{formatDateTime(sale.date)}</span></div>
      <div className="row"><span>Caja</span><span>{sale.cashRegisterID}</span></div>
      {sale.cashierName && <div className="row"><span>Cajero</span><span>{sale.cashierName}</span></div>}
      {sale.customerName && <div className="row"><span>Cliente</span><span>{sale.customerName}</span></div>}
      {banner && <div className="banner">{banner}</div>}
      <div className="sep" />
      {sale.items.map((item) => (
        <div className="item" key={item.id}>
          <div>{item.productName ?? `Producto ${item.productId}`}</div>
          <div className="row">
            <span>{item.quantity} x {toPriceString(item.priceAtSale)}</span>
            <span>{toPriceString(item.lineTotal)}</span>
          </div>
          {item.refundedQuantity > 0 && <div className="muted">Devuelto: {item.refundedQuantity}</div>}
        </div>
      ))}
      <div className="sep" />
      <div className="row"><span>Subtotal</span><span>{toPriceString(sale.subtotal)}</span></div>
      <div className="row"><span>Impuestos</span><span>{toPriceString(sale.taxTotal)}</span></div>
      {sale.discount > 0 && <div className="row"><span>Descuento</span><span>-{toPriceString(sale.discount)}</span></div>}
      <div className="row big"><span>TOTAL</span><span>{toPriceString(sale.total)}</span></div>
      <div className="sep" />
      {sale.payments.map((payment, index) => (
        <div key={index}>
          <div className="row">
            <span>{paymentMethodLabels[payment.method]}</span>
            <span>{toPriceString(payment.method === "CASH" ? payment.tendered : payment.amount)}</span>
          </div>
          {payment.change > 0 && <div className="row bold"><span>Cambio</span><span>{toPriceString(payment.change)}</span></div>}
        </div>
      ))}
      {sale.refundedTotal > 0 && (
        <div className="row"><span>Devuelto al cliente</span><span>{toPriceString(sale.refundedTotal)}</span></div>
      )}
      {sale.status === "VOIDED" && sale.voidReason && <div className="muted">Motivo: {sale.voidReason}</div>}
      <div className="sep" />
      <div className="center muted">¡Gracias por su compra!</div>
    </div>
  )
}

export async function fetchCompany(): Promise<Company | null> {
  try {
    const response = await fetch(`${appUrl}/api/company`)
    return response.ok ? await response.json() : null
  } catch {
    return null
  }
}

export function printReceipt(sale: SaleResponse, company: Company | null) {
  printHtml(`Recibo #${sale.id}`, renderToStaticMarkup(<Receipt sale={sale} company={company} />))
}

export const AUTO_PRINT_KEY = "reditus-autoprint"

export function isAutoPrintEnabled() {
  return localStorage.getItem(AUTO_PRINT_KEY) === "true"
}
