import { useEffect, useState } from "react"
// import { Product, ProductsPageResponse } from "../types/types"
import ProductCard from "./ProductCard"
import { Product } from "@/types/types"
import Layout from "./Layout"


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
    
    return(
        <>
         <Layout>
   {
        productList?.map((product)=>(
                    <div key={product.id}>
                        
            <ProductCard
            productName={product.name}
            productImageUrl={product.image}/>

                    </div>
        ))
     }                 
 

          </Layout>

        </>
    )
}

export default Products;
