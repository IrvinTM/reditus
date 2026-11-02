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
import { AddStockDialog } from "./AddStockDialog";

interface ProductCard {
  product: Product;
  onProductDeleted: () => void;
}
const ProductCard = ({ product, onProductDeleted }: ProductCard) => {
  const [prod, setProd] = useState<Product>(product);
  const [imageError, setImageError] = useState(false);

  const showImage = prod.image && !imageError;

  return (
    <Card className="w-full max-w-sm overflow-hidden">
      <div className="relative h-48 bg-muted/20 flex items-center justify-center">
        {showImage ? (
          <img
            src={prod.image}
            alt={prod.name}
            width={300}
            height={200}
            className="w-full h-48 object-contain"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="text-sm text-muted-foreground">Sin imagen</span>
        )}
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
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">
              {toPriceString(prod.salesPrice)}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              Stock: {prod.available}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <AddStockDialog product={prod} onStockAdded={setProd} />
            <EditDialog product={prod} onProductChange={setProd} />
            <DeleteDialog product={prod} onProductDeleted={onProductDeleted}/>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
