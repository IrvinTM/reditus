import { useEffect, useState } from "react"
// import { Product, ProductsPageResponse } from "../types/types"
import ProductCard from "./ProductCard"
import { Product } from "@/types/types"
import Layout from "../layout/Layout"
import { toPriceString } from "@/utils/utils"


const Products = ()=>{
    
    const [productList, setProductList] = useState<Product[]>()
    
    const appUrl = import.meta.env.VITE_BACK_URL

    useEffect(()=>{
        fetch(appUrl+"/api/products/")
    .then((response)=>{
        console.log("en el then")
        response.json()

        .then((data)=>{
    setProductList(data.content)
        })
    })

    .catch((error:any)=> {
        console.log(error)
    })

    }, [])
    
    return (
        <>
            <Layout>
<div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Productos</h1>
      {/* Responsive Grid - Better for different screen sizes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {productList?.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </div>
            </Layout>
        </>
    );
}

export default Products;