import { Product } from "@/types/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { EditDialog } from "./EditProduct";
import { toPriceString } from "@/utils/utils";
import { useState } from "react";
import { DeleteDialog } from "./DeleteDialog";

interface ProductCard {
  product: Product;
  onProductDeleted: () => void;
}
const ProductCard = ({ product, onProductDeleted }: ProductCard) => {
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
            <EditDialog product={prod} onProductChange={setProd} />
            <DeleteDialog product={prod} onProductDeleted={onProductDeleted}/>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
