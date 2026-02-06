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
    customerID: number
    customerName: string
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
    customerID: number
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
    customerID: number
    customerName: string
}

export type CashRegister = {
    id: number
    balance: number
}