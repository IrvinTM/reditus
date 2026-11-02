import { useEffect, useState } from "react";
// import { Product, ProductsPageResponse } from "../types/types"
import ProductCard from "./ProductCard";
import { Product } from "@/types/types";
import Layout from "../layout/Layout";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { AddDialog } from "./AddProduct";

const Products = () => {
  const [productList, setProductList] = useState<Product[]>();
  const appUrl = import.meta.env.VITE_BACK_URL;
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
    <>
      <Layout>
        <div className="container mx-auto p-6">
          <div className="flex gap-2">
            <AddDialog
              product={exampleProduct}
              onProductAdded={setExampleProduct}
              onProductSuccess={getProducts}

            />
            <Input value={searchText} onChange={(e) => {setSearchText(e.target.value);}} />
            <Button onClick={() => handleSearch(searchText)} className="mb-2">Buscar</Button>
          </div>
          {/* Responsive Grid - Better for different screen sizes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {productList?.map((product) => (
              <ProductCard key={product.id} product={product} onProductDeleted={getProducts}/>
            ))}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Products;
