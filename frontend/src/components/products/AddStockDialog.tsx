import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddStockRequest, Product, Supplier } from "@/types/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface AddStockDialogProps {
  product: Product;
  onStockAdded: (product: Product) => void;
}

export function AddStockDialog({ product, onStockAdded }: AddStockDialogProps) {
  const appUrl = import.meta.env.VITE_BACK_URL;
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [supplierId, setSupplierId] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("1");

  useEffect(() => {
    fetch(appUrl + "/api/suppliers")
      .then((response) => response.json())
      .then((data) => setSuppliers(data.content || []))
      .catch((error) => console.error(error));
  }, []);

  const handleSubmit = async () => {
    const parsedQuantity = Number.parseInt(quantity, 10);
    if (!supplierId) {
      toast.error("Selecciona un proveedor");
      return;
    }
    if (!parsedQuantity || parsedQuantity <= 0) {
      toast.error("La cantidad debe ser mayor a cero");
      return;
    }

    const payload: AddStockRequest = {
      productId: product.id,
      supplierId: Number.parseInt(supplierId, 10),
      quantity: parsedQuantity,
    };

    try {
      const response = await fetch(appUrl + "/api/stocks/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        onStockAdded(updatedProduct);
        toast.success("Stock agregado correctamente");
      } else {
        const error = await response.json();
        toast.error(error.message || "No se pudo agregar stock");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error de conexion al agregar stock");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Agregar stock</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar stock</DialogTitle>
          <DialogDescription>
            Selecciona proveedor y cantidad para {product.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="supplier" className="text-right">
              Proveedor
            </Label>
            <div className="col-span-3">
              <Select value={supplierId} onValueChange={setSupplierId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar proveedor" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id.toString()}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">
              Cantidad
            </Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              className="col-span-3"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit" onClick={handleSubmit}>Guardar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
