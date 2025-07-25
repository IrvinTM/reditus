import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Product } from "@/types/types";
import { ChangeEvent, useEffect, useState } from "react";
import { AddDialog } from "../products/AddProduct";
import ProductCard from "./ProductCard";


interface selectProduct {
  onProductSelected: ( product: Product ) => void;
}

export function SelectFromProducts({
  onProductSelected
}: selectProduct) {
  const appUrl = import.meta.env.VITE_BACK_URL;
 const [productList, setProductList] = useState<Product[]>();
  const [exampleProduct, setExampleProduct] = useState<Product>({
    name: "Example",
    active: true,
    ageRestricted: false,
    allowPriceChange: false,
    available: 10,
    barCode: "test11",
    categories: [],
    code: "test11",
    cost: 100,
    description: "example",
    id: 1222,
    image: "http://image.com",
    measurementUnit: "unit",
    noTaxIncludedPrice: 33,
    priceIncludesTaxes: false,
    profitMargin: 20,
    salesPrice: 300,
    taxes: [],
    taxIncludedPrice: 0,
  });

  const [searchText, setSearchText] = useState("");

  const getProducts = ()=>{
    fetch(appUrl + "/api/products/")
      .then((response) => {
        response.json().then((data) => {
          setProductList(data.content);
        });
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  useEffect(() => {
    getProducts()
  }, []);

  const handleSearch = async (searchParam:string) => {
    if (searchParam === "") {
      getProducts()
      return
    }
    const response = await fetch(appUrl + "/api/products/search/" + searchParam)
    const res = await response.json()
    if (response.ok) {
      setProductList(res)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Seleccionar productos</Button>
      </DialogTrigger>
      <DialogContent className="h-full min-w-full p-0 flex flex-col">
        {/* Fixed Header */}
        <DialogHeader className="flex-shrink-0 px-4 py-2 border-b">
          <DialogTitle>Agregar un nuevo producto</DialogTitle>
          <DialogDescription>Selecciona el producto que deseas agregar.</DialogDescription>
        </DialogHeader>

        {/* Fixed Search Bar */}
        <div className="flex-shrink-0 px-4 pb-4 border-b bg-background">
          <div className="flex gap-2">
            <Input
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value)
              }}
              placeholder="Buscar productos..."
            />
            <Button onClick={() => handleSearch(searchText)}>Buscar</Button>
          </div>
        </div>

        {/* Scrollable Products Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {productList?.map((product) => (
              <ProductCard key={product.id} product={product} handleAdd={onProductSelected} />
            ))}
          </div>
        </div>

        {/* Fixed Footer */}
        <DialogFooter className="flex-shrink-0 p-2 pt-2 border-t">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={() => {}}>Hecho</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}