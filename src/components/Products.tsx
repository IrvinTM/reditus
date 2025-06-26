import { useEffect, useState } from "react"
import { Product, ProductsPageResponse } from "../types/types"
import ProductCard from "./ProductCard"
import { Button } from "@/components/ui/button"


const Products = ()=>{
    
    const [productList, setProductList] = useState<Product[]>()
    
    const appUrl = import.meta.env.VITE_BACK_URL

    useEffect(()=>{
        const res  = fetch(appUrl+"/api/products/")
    .then((response)=>{
        console.log("en el then")
        const data = response.json()

        .then((data)=>{
    setProductList(data.content)
        })
    })

    .catch((error:any)=> {
        console.log(error)
    })

    }, [])
    
    return(
        <>
        <Button>Agregar Producto</Button>
  {
        productList?.map((product)=>(
                    <div key={product.id}>
                        
            <ProductCard
            productName={product.name}
            productImageUrl={product.image}/>

                    </div>
        ))
     }                 
         
        </>
    )
}

export default Products;
