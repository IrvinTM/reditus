import { useEffect, useState } from "react";
import Layout from "./layout/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { CashRegister } from "@/types/types";
import { Plus } from "lucide-react";

export default function Settings() {
  const [cashRegisters, setCashRegisters] = useState<CashRegister[]>([]);
  const [selectedRegisterId, setSelectedRegisterId] = useState<string>("");
  const appUrl = import.meta.env.VITE_BACK_URL;

  const fetchCashRegisters = () => {
    fetch(`${appUrl}/api/cashregister`)
      .then((res) => res.json())
      .then((data) => {
        setCashRegisters(data.content);
        // Load saved preference
        const savedId = localStorage.getItem("defaultCashRegisterId");
        if (savedId && data.content.some((r: CashRegister) => r.id.toString() === savedId)) {
          setSelectedRegisterId(savedId);
        } else if (data.content?.length > 0) {
          // Default to first if not set or saved ID not found
          const firstId = data.content[0].id.toString();
          setSelectedRegisterId(firstId);
          // Optional: Auto-save default if none was set? 
          // Better let user explicitly save, but for "default behavior" it works.
        } else if (data.content?.length === 0) {
          createDefaultCashRegister()
        }
      })
      .catch((err) => console.error("Error fetching cash registers:", err));
  };

  useEffect(() => {
    fetchCashRegisters()
  }, []);

  const handleSave = () => {
    if (selectedRegisterId) {
      localStorage.setItem("defaultCashRegisterId", selectedRegisterId);
      toast.success("Configuración guardada", {
        description: `Caja registradora #${selectedRegisterId} seleccionada como predeterminada.`,
      });
    }
  };
  //create default cash register if it does not exist i need to first check if
  //the cash re 1 does not exist
  const createDefaultCashRegister = async () => {

    const cashRegisterDefault: CashRegister = cashRegisters[0];

    if (!cashRegisterDefault) {
      try {
        const response = await fetch(`${appUrl}/api/cashregister/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ balance: 0 }),
        });

        if (response.ok) {
          const newRegister = await response.json();
          toast.success("Caja registradora creada", {
            description: `Se ha creado la caja #${newRegister.id}`
          });
          fetchCashRegisters();
          // If it's the first one, select it
          if (cashRegisters.length === 1) {
            setSelectedRegisterId(newRegister.id.toString());
            handleSave()

          }
        } else {
          toast.error("Error al crear caja registradora");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error de conexión");
      }

    } else {
      toast("ya hay cajas registradoras")
    }


  }

  const handleCreateRegister = async () => {
    try {
      const response = await fetch(`${appUrl}/api/cashregister/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ balance: 0 }),
      });

      if (response.ok) {
        const newRegister = await response.json();
        toast.success("Caja registradora creada", {
          description: `Se ha creado la caja #${newRegister.id}`
        });
        fetchCashRegisters();
        // If it's the first one, select it
        if (cashRegisters.length === 0) {
          setSelectedRegisterId(newRegister.id.toString());
        }
      } else {
        toast.error("Error al crear caja registradora");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error de conexión");
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Ajustes</h1>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Caja</CardTitle>
              <CardDescription>
                Selecciona la caja registradora que utilizará este terminal para realizar ventas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <label className="text-sm font-medium">Caja Registradora Predeterminada</label>
                <div className="flex gap-2">
                  <Select
                    value={selectedRegisterId}
                    onValueChange={setSelectedRegisterId}
                  >
                    <SelectTrigger className="w-[280px]">
                      <SelectValue placeholder="Seleccionar caja..." />
                    </SelectTrigger>
                    <SelectContent>
                      {cashRegisters?.map((register) => (
                        <SelectItem key={register.id} value={register.id.toString()}>
                          Caja #{register.id} (Balance: ${register.balance})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon" onClick={handleCreateRegister} title="Crear nueva caja">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {cashRegisters?.length === 0 && (
                  <p className="text-sm text-muted-foreground text-yellow-600">
                    No hay cajas registradas. Crea una nueva para comenzar a vender.
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave} disabled={!selectedRegisterId}>Guardar cambios</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
