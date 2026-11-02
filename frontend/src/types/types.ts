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

export type SaleItem = {
    id: number;
    product: Product;
    quantity: number;
    priceAtSale: number;
}

export type Sale = {
    id?: number
    items: SaleItem[]
    date: string
    discount: number
    total: number
    cashRegisterID: number
    customerID: number | null
    customerName?: string
}

export type Customer = {
    id: number
    name: string
    identification: string
    phoneNumber: string
    email: string
    sales?: Sale[]
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

export type SaleItemRequest = {
    productId: number
    quantity: number
    priceAtSale: number
}


export type CreateSaleRequest = {
    items: SaleItemRequest[]
    discount: number
    total: number
    cashRegisterID: number
    customerID: number | null
}

export type SalesHistoryData = {
  content: Sale[]
  customPage: {
    totalElements: number
    totalPages: number
    number: number
    size: number
  }
}

export type SaleItemResponse = {
    id: number;
    productId: number;
    quantity: number;
    priceAtSale: number;
}

export type SaleResponse = {
    id?: number
    items: SaleItemResponse[]
    date: string
    discount: number
    total: number
    cashRegisterID: number
    customerID: number | null
    customerName?: string
}

export type CashRegister = {
    id: number
    balance: number
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
