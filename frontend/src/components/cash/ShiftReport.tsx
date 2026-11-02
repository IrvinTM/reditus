import { renderToStaticMarkup } from "react-dom/server"
import { CashMovementType, PaymentMethod, ShiftReport as ShiftReportData } from "@/types/types"
import { formatDateTime, paymentMethodLabels, toPriceString } from "@/utils/utils"
import { printHtml } from "@/utils/print"

export const movementLabels: Record<CashMovementType, string> = {
  DEPOSIT: "Entrada",
  WITHDRAWAL: "Salida",
  SALE: "Venta",
  REFUND: "Devolución",
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={bold ? "row bold" : "row"}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}

/** End of shift (Z) report, styled by PRINT_CSS. */
export function ShiftReport({ report }: { report: ShiftReportData }) {
  const { shift } = report
  const closed = shift.status === "CLOSED"
  const byMethod = (values: Partial<Record<PaymentMethod, number>>) =>
    (Object.keys(paymentMethodLabels) as PaymentMethod[])
      .filter((method) => values[method])
      .map((method) => <Row key={method} label={`  ${paymentMethodLabels[method]}`} value={toPriceString(values[method]!)} />)

  return (
    <div className="print-doc">
      <div className="center">
        <div className="title">{closed ? "CIERRE DE TURNO" : "REPORTE PARCIAL"}</div>
        <div>{shift.cashRegisterName ?? `Caja ${shift.cashRegisterId}`} · Turno #{shift.id}</div>
      </div>
      <div className="sep" />
      <Row label="Abierto" value={formatDateTime(shift.openedAt)} />
      <Row label="Por" value={shift.openedBy ?? "—"} />
      {closed && <Row label="Cerrado" value={formatDateTime(shift.closedAt)} />}
      {closed && <Row label="Por" value={shift.closedBy ?? "—"} />}
      <div className="sep" />
      <Row label={`Ventas (${report.salesCount})`} value={toPriceString(report.salesTotal)} bold />
      <Row label="  Subtotal" value={toPriceString(report.subtotal)} />
      <Row label="  Impuestos" value={toPriceString(report.taxTotal)} />
      <Row label="  Descuentos" value={toPriceString(report.discountTotal)} />
      {byMethod(report.salesByPaymentMethod)}
      <Row label={`Devoluciones (${report.refundsCount})`} value={toPriceString(report.refundsTotal)} bold />
      {byMethod(report.refundsByPaymentMethod)}
      <Row label={`Anuladas (${report.voidedCount})`} value={toPriceString(report.voidedTotal)} bold />
      <div className="sep" />
      <div className="bold">Efectivo</div>
      <Row label="Fondo inicial" value={toPriceString(shift.openingFloat)} />
      <Row label="+ Ventas" value={toPriceString(report.cashSales)} />
      <Row label="+ Entradas" value={toPriceString(report.cashDeposits)} />
      <Row label="- Salidas" value={toPriceString(report.cashWithdrawals)} />
      <Row label="- Devoluciones" value={toPriceString(report.cashRefunds)} />
      <Row label="Esperado" value={toPriceString(shift.expectedCash)} bold />
      {closed && <Row label="Contado" value={toPriceString(shift.countedCash ?? 0)} bold />}
      {closed && (
        <Row
          label={(shift.difference ?? 0) < 0 ? "Faltante" : (shift.difference ?? 0) > 0 ? "Sobrante" : "Diferencia"}
          value={toPriceString(shift.difference ?? 0)}
          bold
        />
      )}
      {shift.notes && <div className="muted">Notas: {shift.notes}</div>}
      {report.movements.some((m) => m.type === "DEPOSIT" || m.type === "WITHDRAWAL") && (
        <>
          <div className="sep" />
          <div className="bold">Entradas y salidas</div>
          {report.movements
            .filter((m) => m.type === "DEPOSIT" || m.type === "WITHDRAWAL")
            .map((m) => (
              <div className="item" key={m.id}>
                <Row
                  label={`${movementLabels[m.type]} ${formatDateTime(m.date)}`}
                  value={`${m.type === "WITHDRAWAL" ? "-" : ""}${toPriceString(m.amount)}`}
                />
                <div className="muted">{m.reason} ({m.user ?? "—"})</div>
              </div>
            ))}
        </>
      )}
      <div className="sep" />
      <div className="center muted">Impreso {formatDateTime(new Date().toISOString())}</div>
    </div>
  )
}

export function printShiftReport(report: ShiftReportData) {
  printHtml(`Turno #${report.shift.id}`, renderToStaticMarkup(<ShiftReport report={report} />))
}
