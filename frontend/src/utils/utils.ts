import { PaymentMethod, Product, SaleStatus, Tax } from "@/types/types"

export function toPriceString(cents: number): string {
    const dollars = cents / 100

    const formatter = new Intl.NumberFormat("en-US", {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2

    })

    return formatter.format(dollars)
}

/** Parses an amount typed by the user (e.g. "12.50") into cents. */
export function toCents(value: string | number): number {
    const amount = typeof value === "number" ? value : Number.parseFloat(value)
    return Number.isFinite(amount) ? Math.round(amount * 100) : 0
}

export function formatDateTime(value: string | null | undefined): string {
    if (!value) {
        return "—"
    }
    return new Intl.DateTimeFormat("es", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value))
}

export const paymentMethodLabels: Record<PaymentMethod, string> = {
    CASH: "Efectivo",
    CARD: "Tarjeta",
    MOBILE: "Pago con celular",
    OTHER: "Otro",
}

export const saleStatusLabels: Record<SaleStatus, string> = {
    COMPLETED: "Completada",
    PARTIALLY_REFUNDED: "Devolución parcial",
    REFUNDED: "Devuelta",
    VOIDED: "Anulada",
}

/** Error message sent by the backend (ApiError), or a fallback. */
export async function apiErrorMessage(response: Response, fallback: string): Promise<string> {
    const body = await response.json().catch(() => null)
    return body?.error ?? body?.message ?? fallback
}

function divideRounded(dividend: number, divisor: number) {
    return Math.floor((dividend + Math.floor(divisor / 2)) / divisor)
}

/**
 * Same math as the backend SaleCalculator, only used to preview totals: the server computes the real ones.
 */
export function lineAmounts(product: Product, unitPrice: number, quantity: number, taxes: Tax[]) {
    const taxIds: number[] = Array.isArray(product.taxes) ? product.taxes : []
    const taxPercent = taxes
        .filter((tax) => taxIds.includes(tax.id))
        .reduce((sum, tax) => sum + tax.percentage, 0)
    const gross = unitPrice * quantity
    if (product.priceIncludesTaxes) {
        const net = divideRounded(gross * 100, 100 + taxPercent)
        return { net, tax: gross - net, total: gross }
    }
    const tax = divideRounded(gross * taxPercent, 100)
    return { net: gross, tax, total: gross + tax }
}
