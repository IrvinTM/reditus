import { Product } from "@/types/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { toPriceString } from "@/utils/utils";
import { useState } from "react";
import { Button } from "../ui/button";

interface ProductCard {
  product: Product;
  handleAdd: (product: Product) => void;
}
const ProductCard = ({ product, handleAdd }: ProductCard) => {
  const [prod, setProd] = useState<Product>(product);

  return (
    <Card className="w-full max-w-sm overflow-hidden">
      <div className="relative">
        <img
          src={prod.image}
          alt="Wireless Bluetooth Headphones"
          width={300}
          height={200}
          className="w-full h-48 object-contain"
        />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold line-clamp-2">
          {prod.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="text-sm text-muted-foreground mb-4">
          {prod.description}
        </CardDescription>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">
              {toPriceString(prod.salesPrice)}
            </span>
          </div>
          <div className="flex gap-4">
            <Button onClick={()=>handleAdd(prod)}>Add</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
