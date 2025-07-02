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
import { ChangeEvent, useState } from "react"

interface editDialog{
  product:Product
  onProductChange :  (product: Product) => void
}

export function EditDialog({product, onProductChange}: editDialog) {
  
    const [prod, setProd] = useState<Product>(product);
    const appUrl = import.meta.env.VITE_BACK_URL


  const handleChange = (e: ChangeEvent<HTMLInputElement>)=>{
      const {name, value} = e.target
    setProd((prevProduct)=>({
      ...prevProduct, [name]: value
    }
    ))
    console.log("the name is"+ name)
  }
const handleSubmit = ()=>{
    fetch(appUrl+"/api/products/update", {
      method: "put",
      body: JSON.stringify(prod),
      headers:{
        "Content-Type": "Application/json"
      }
    })
  }
  
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
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" onChange={handleChange} name="name" defaultValue={prod.name} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="product-code">Codigo</Label>
              <Input id="product-code" onChange={handleChange} name="code" defaultValue={prod.code} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="product-barcode">Codigo de barras</Label>
              <Input id="product-barcode" onChange={handleChange} name="barCode" defaultValue={prod.barCode} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="measurement-unit">Unidad de medida</Label>
              <Input id="measurement-unit" onChange={handleChange} name="measurementUnit" defaultValue={prod.measurementUnit} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Descripción</Label>
              <Input id="description" onChange={handleChange} name="description" defaultValue={prod.description} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="image">Imagen</Label>
              <Input id="image" onChange={handleChange} name="image" defaultValue={prod.image} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="cost">Costo</Label>
              <Input id="cost" onChange={handleChange} name="cost" defaultValue={prod.cost} type="number" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="no-tax-included-price">Precio sin impuestos</Label>
              <Input id="no-tax-included-price" onChange={handleChange} name="noTaxIncludedPrice" defaultValue={prod.noTaxIncludedPrice} type="number" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="tax-included-price">Precio con impuestos</Label>
              <Input id="tax-included-price" onChange={handleChange} name="taxIncludedPrice" defaultValue={prod.taxIncludedPrice} type="number" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="profit-margin">Margen de ganancia</Label>
              <Input id="profit-margin" name="profitMargin" onChange={()=>{handleChange}} defaultValue={prod.profitMargin} type="number" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="sales-price">Precio de venta</Label>
              <Input id="sales-price" onChange={handleChange} name="salesPrice" defaultValue={prod.salesPrice} type="number" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>

            <DialogClose asChild>
            <Button onClick={()=>{handleSubmit(); onProductChange(prod)}}>Guardar cambios</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
