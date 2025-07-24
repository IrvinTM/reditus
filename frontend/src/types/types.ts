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