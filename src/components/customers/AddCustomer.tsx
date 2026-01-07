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
import { Customer } from "@/types/types";
import { ChangeEvent, useState } from "react";

interface AddCustomerProps {
  onCustomerSuccess: () => void;
}

export function AddCustomer({ onCustomerSuccess }: AddCustomerProps) {
  const initialCustomer: Customer = {
    id: 0,
    name: "",
    identification: "",
    phoneNumber: "",
    email: "",
    address: "",
  };
  const [cust, setCust] = useState<Customer>(initialCustomer);
  const appUrl = import.meta.env.VITE_BACK_URL;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCust((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(appUrl + "/api/customers/create", {
        method: "post",
        body: JSON.stringify(cust),
        headers: {
          "Content-Type": "Application/json",
        },
      });

      if (response.ok) {
        onCustomerSuccess();
        setCust(initialCustomer); // Reset form
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Nuevo Cliente</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar Cliente</DialogTitle>
          <DialogDescription>
            Ingresa los datos del nuevo cliente.
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
              value={cust.name}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="identification" className="text-right">
              Identificación
            </Label>
            <Input
              id="identification"
              name="identification"
              value={cust.identification}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phoneNumber" className="text-right">
              Teléfono
            </Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={cust.phoneNumber}
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
              value={cust.email}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Dirección
            </Label>
            <Input
              id="address"
              name="address"
              value={cust.address || ""}
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
