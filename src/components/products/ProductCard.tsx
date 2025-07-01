import { Product } from "@/types/types";
import { Card, CardContent, CardDescription,  CardHeader, CardTitle } from "../ui/card";
import { EditDialog } from "./EditProduct";
import { toPriceString } from "@/utils/utils";

interface ProductCard{
  product:Product
}
const ProductCard = ({product}: ProductCard)=>{
    return(
        <Card className="w-full max-w-sm overflow-hidden">
      <div className="relative">
        <img
          src={product.image}
          alt="Wireless Bluetooth Headphones"
          width={300}
          height={200}
          className="w-full h-48 object-contain"
        />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold line-clamp-2">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="text-sm text-muted-foreground mb-4">
                    {product.description}
                  </CardDescription>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">{toPriceString(product.salesPrice)}</span>
          </div>
          <EditDialog product={product}/>
        </div>
      </CardContent>
    </Card>
    )
}

export default ProductCard;