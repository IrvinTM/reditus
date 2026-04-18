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
import { Supplier } from "@/types/types";
import { ChangeEvent, useState } from "react";

interface AddSupplierProps {
  onSupplierSuccess: () => void;
}

export function AddSupplier({ onSupplierSuccess }: AddSupplierProps) {
  const initialSupplier: Supplier = {
    id: 0,
    name: "",
    identification: "",
    phoneNumber: "",
    email: "",
    address: "",
  };

  const [supplier, setSupplier] = useState<Supplier>(initialSupplier);
  const appUrl = import.meta.env.VITE_BACK_URL;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSupplier((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(appUrl + "/api/suppliers/create", {
        method: "post",
        body: JSON.stringify(supplier),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        onSupplierSuccess();
        setSupplier(initialSupplier);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Nuevo Proveedor</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar Proveedor</DialogTitle>
          <DialogDescription>
            Ingresa los datos del nuevo proveedor.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nombre
            </Label>
            <Input
              id="name"
              name="name"
              value={supplier.name}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="identification" className="text-right">
              Identificacion
            </Label>
            <Input
              id="identification"
              name="identification"
              value={supplier.identification}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phoneNumber" className="text-right">
              Telefono
            </Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={supplier.phoneNumber}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              value={supplier.email}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Direccion
            </Label>
            <Input
              id="address"
              name="address"
              value={supplier.address || ""}
              onChange={handleChange}
              className="col-span-3"
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
