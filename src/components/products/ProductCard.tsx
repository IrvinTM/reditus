import { Card, CardContent, CardDescription,  CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { EditDialog } from "./EditProduct";

interface ProductCard{
    productName:string
    productImageUrl: string
    productDescription: string
    producPrice: string

}
const ProductCard = ({productName, productImageUrl, productDescription, producPrice}: ProductCard)=>{
    return(
        <Card className="w-full max-w-sm overflow-hidden">
      <div className="relative">
        <img
          src={productImageUrl}
          alt="Wireless Bluetooth Headphones"
          width={300}
          height={200}
          className="w-full h-48 object-contain"
        />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold line-clamp-2">{productName}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="text-sm text-muted-foreground mb-4">
                    {productDescription}
                  </CardDescription>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">{producPrice}</span>
          </div>
          <EditDialog/>
        </div>
      </CardContent>
    </Card>
    )
}

export default ProductCard;