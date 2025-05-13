import { useEffect, useState } from "react"
import { Product, ProductsPageResponse } from "../types/types"
import ProductCard from "./ProductCard"

const Products = ()=>{
    
    const [productList, setProductList] = useState<Product[]>()
    
    const appUrl = import.meta.env.VITE_BACK_URL

    useEffect(()=>{
        const res  = fetch(appUrl+"/api/products")
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
        <button className="p-4 m-4 border-2 border-surface-2 bg-surface-0 rounded-xl text-text hover:bg-surface-1 hover:shadow-xl hover:shadow-surface-0 ">Agregar Producto</button>
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
