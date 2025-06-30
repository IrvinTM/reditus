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

export function EditDialog() {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Editar producto</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar producto</DialogTitle>
            <DialogDescription>
              Edita los detalles del producto y presiona guardar.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="product-name">Nombre</Label>
              <Input id="product-name" name="product-name" defaultValue="Apple iPhone 12 Pro Max" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="product-code">Codigo</Label>
              <Input id="product-code" name="product-code" defaultValue="SW-IPH-12PM" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="product-barcode">Codigo de barras</Label>
              <Input id="product-barcode" name="product-barcode" defaultValue="00019425204732" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="measurement-unit">Unidad de medida</Label>
              <Input id="measurement-unit" name="measurement-unit" defaultValue="unit" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Descripción</Label>
              <Input id="description" name="description" defaultValue="El iPhone 12 Pro Max. Pantalla Super Retina XDR de 6.7 pulgadas, sistema de cámaras Pro y 5G." />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="image">Imagen</Label>
              <Input id="image" name="image" defaultValue="https://static.swappa.com/images/cache/37/11/37119c3fa35083b0cd5b952f82307ea3.png" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="cost">Costo</Label>
              <Input id="cost" name="cost" defaultValue="22000" type="number" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="no-tax-included-price">Precio sin impuestos</Label>
              <Input id="no-tax-included-price" name="no-tax-included-price" defaultValue="25800" type="number" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="tax-included-price">Precio con impuestos</Label>
              <Input id="tax-included-price" name="tax-included-price" defaultValue="25800" type="number" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="profit-margin">Margen de ganancia</Label>
              <Input id="profit-margin" name="profit-margin" defaultValue="15" type="number" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="sales-price">Precio de venta</Label>
              <Input id="sales-price" name="sales-price" defaultValue="25800" type="number" />
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
