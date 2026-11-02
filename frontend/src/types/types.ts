export type Product = {
    id: number;
    name: string;
    code: string;
    barCode: string;
    measurementUnit: string;
    categories: string[];
    description: string;
    image: string;
    cost: number;
    taxes: any; // TODO create type tax
    priceIncludesTaxes: boolean;
    allowPriceChange: boolean;
    noTaxIncludedPrice: number;
    taxIncludedPrice: number;
    profitMargin: number;
    salesPrice: number;
    available: number;
    active: boolean;
    ageRestricted: boolean;
};

type CustomPage = {
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
};

export type ProductsPageResponse = {
    content: Product[];
    customPage: CustomPage;
};

/** A line in the sale being built at the register (not saved yet). */
export type SaleItem = {
    id: number;
    product: Product;
    quantity: number;
    priceAtSale: number;
}

export type Customer = {
    id: number
    name: string
    identification: string
    phoneNumber: string
    email: string
    sales?: SaleResponse[]
    address?: string
}

export type Supplier = {
    id: number
    name: string
    identification: string
    phoneNumber: string
    email: string
    address?: string
}

export type AddStockRequest = {
    productId: number
    supplierId: number
    quantity: number
}

export type PaymentMethod = "CASH" | "CARD" | "MOBILE" | "OTHER"

export type SaleItemRequest = {
    productId: number
    quantity: number
    /** only sent for products that allow price changes */
    price?: number
}

export type PaymentRequest = {
    method: PaymentMethod
    /** for cash, what the customer handed over */
    amount: number
}

export type CreateSaleRequest = {
    items: SaleItemRequest[]
    discount: number
    cashRegisterID: number
    customerID: number | null
    payments: PaymentRequest[]
}

export type SaleStatus = "COMPLETED" | "PARTIALLY_REFUNDED" | "REFUNDED" | "VOIDED"

export type SaleItemResponse = {
    id: number
    productId: number
    productName: string | null
    quantity: number
    priceAtSale: number
    priceIncludesTaxes: boolean
    taxAmount: number
    lineTotal: number
    refundedQuantity: number
}

export type PaymentResponse = {
    method: PaymentMethod
    amount: number
    tendered: number
    change: number
}

export type SaleResponse = {
    id: number
    date: string | null
    status: SaleStatus
    items: SaleItemResponse[]
    payments: PaymentResponse[]
    subtotal: number
    taxTotal: number
    discount: number
    total: number
    refundedTotal: number
    cashRegisterID: number
    shiftId: number | null
    customerID: number | null
    customerName: string | null
    cashierName: string | null
    voidedAt: string | null
    voidedBy: string | null
    voidReason: string | null
}

export type SalesHistoryData = {
  content: SaleResponse[]
  customPage: {
    totalElements: number
    totalPages: number
    number: number
    size: number
  }
}

export type RefundResponse = {
    id: number
    saleId: number
    date: string
    user: string | null
    reason: string
    method: PaymentMethod
    amount: number
    items: { saleItemId: number; productName: string | null; quantity: number; amount: number }[]
}

export type Tax = {
    id: number
    name: string
    code: string
    percentage: number
}

export type Company = {
    name?: string
    address?: string
    phoneNumber?: string
    email?: string
    logo?: string
}

export type CashRegister = {
    id: number
    name: string | null
    balance: number
    openShiftId: number | null
}

export type Shift = {
    id: number
    cashRegisterId: number
    cashRegisterName: string | null
    status: "OPEN" | "CLOSED"
    openedBy: string | null
    openedAt: string
    openingFloat: number
    closedBy: string | null
    closedAt: string | null
    expectedCash: number
    countedCash: number | null
    difference: number | null
    notes: string | null
}

export type CashMovementType = "DEPOSIT" | "WITHDRAWAL" | "SALE" | "REFUND"

export type ShiftReport = {
    shift: Shift
    salesCount: number
    subtotal: number
    taxTotal: number
    discountTotal: number
    salesTotal: number
    salesByPaymentMethod: Partial<Record<PaymentMethod, number>>
    voidedCount: number
    voidedTotal: number
    refundsCount: number
    refundsTotal: number
    refundsByPaymentMethod: Partial<Record<PaymentMethod, number>>
    cashSales: number
    cashRefunds: number
    cashDeposits: number
    cashWithdrawals: number
    movements: {
        id: number
        date: string
        type: CashMovementType
        amount: number
        user: string | null
        reason: string | null
        saleId: number | null
    }[]
}

export type BackupStatus = {
    directory: string
    lastBackupAt: string | null
    stale: boolean
    lastError: string | null
    lastErrorAt: string | null
    files: { name: string; size: number; createdAt: string }[]
}

export type UserRole = "ADMINISTRADOR" | "CAJERO"

export type User = {
    id: number
    username: string
    role: UserRole
    name: string
    email: string
    enabled: boolean
}

export type CreateUserRequest = {
    username: string
    password: string
    role: UserRole
    name?: string
    email?: string
    enabled?: boolean
}
