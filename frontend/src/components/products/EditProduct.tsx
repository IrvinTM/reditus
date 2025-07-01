import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Product } from "@/types/types"

interface editDialog{
  product:Product

}

export function EditDialog({product}: editDialog) {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Editar producto</Button>
        </DialogTrigger>
        <DialogContent className="w-[80%] h-[90%] overflow-auto">
          <DialogHeader>
            <DialogTitle>Editar producto</DialogTitle>
            <DialogDescription>
              Edita los detalles del producto y presiona guardar.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="product-name">Nombre</Label>
              <Input id="product-name" name="product-name" defaultValue={product.name} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="product-code">Codigo</Label>
              <Input id="product-code" name="product-code" defaultValue={product.code} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="product-barcode">Codigo de barras</Label>
              <Input id="product-barcode" name="product-barcode" defaultValue={product.barCode} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="measurement-unit">Unidad de medida</Label>
              <Input id="measurement-unit" name="measurement-unit" defaultValue={product.measurementUnit} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Descripción</Label>
              <Input id="description" name="description" defaultValue={product.description} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="image">Imagen</Label>
              <Input id="image" name="image" defaultValue={product.image} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="cost">Costo</Label>
              <Input id="cost" name="cost" defaultValue={product.cost} type="number" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="no-tax-included-price">Precio sin impuestos</Label>
              <Input id="no-tax-included-price" name="no-tax-included-price" defaultValue={product.noTaxIncludedPrice} type="number" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="tax-included-price">Precio con impuestos</Label>
              <Input id="tax-included-price" name="tax-included-price" defaultValue={product.taxIncludedPrice} type="number" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="profit-margin">Margen de ganancia</Label>
              <Input id="profit-margin" name="profit-margin" defaultValue={product.profitMargin} type="number" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="sales-price">Precio de venta</Label>
              <Input id="sales-price" name="sales-price" defaultValue={product.salesPrice} type="number" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit">Guardar cambios</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
