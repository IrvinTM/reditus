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
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { Company } from "@/types/types";
import { Plus } from "lucide-react";
import { useAuth } from "@/auth/AuthContext";
import { setDeviceRegisterId, useRegister } from "@/hooks/use-register";
import { apiErrorMessage, toPriceString } from "@/utils/utils";
import { fetchCompany } from "./sales/Receipt";

const appUrl = import.meta.env.VITE_BACK_URL;

export default function Settings() {
  const { isAdmin } = useAuth();
  const { registers, registerId, reload } = useRegister();
  const [selectedRegisterId, setSelectedRegisterId] = useState<string>("");
  const [newRegisterName, setNewRegisterName] = useState("");

  useEffect(() => {
    setSelectedRegisterId(registerId?.toString() ?? "");
  }, [registerId]);

  const handleSave = () => {
    if (selectedRegisterId) {
      setDeviceRegisterId(Number(selectedRegisterId));
      reload();
      toast.success("Configuración guardada", {
        description: "Este equipo venderá desde la caja seleccionada.",
      });
    }
  };

  const handleCreateRegister = async () => {
    const response = await fetch(`${appUrl}/api/cashregister/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newRegisterName }),
    });
    if (!response.ok) {
      toast.error(await apiErrorMessage(response, "Error al crear caja registradora"));
      return;
    }
    const created = await response.json();
    toast.success(`Caja "${created.name}" creada`);
    setNewRegisterName("");
    reload();
  };

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Ajustes</h1>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Caja de este equipo</CardTitle>
              <CardDescription>
                Selecciona la caja registradora que utilizará este terminal para realizar ventas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <Select value={selectedRegisterId} onValueChange={setSelectedRegisterId}>
                  <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="Seleccionar caja..." />
                  </SelectTrigger>
                  <SelectContent>
                    {registers.map((register) => (
                      <SelectItem key={register.id} value={register.id.toString()}>
                        {register.name ?? `Caja ${register.id}`} ({toPriceString(register.balance)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isAdmin && (
                  <div className="flex gap-2">
                    <Input
                      className="w-[280px]"
                      placeholder="Nombre de la nueva caja"
                      value={newRegisterName}
                      onChange={(e) => setNewRegisterName(e.target.value)}
                    />
                    <Button variant="outline" onClick={handleCreateRegister} disabled={!newRegisterName.trim()}>
                      <Plus className="mr-1 h-4 w-4" /> Crear caja
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave} disabled={!selectedRegisterId}>Guardar cambios</Button>
            </CardFooter>
          </Card>

          {isAdmin && <CompanySettings />}
        </div>
      </div>
    </Layout>
  );
}

/** Business data printed on receipts. */
function CompanySettings() {
  const [company, setCompany] = useState<Company>({});

  useEffect(() => {
    fetchCompany().then((data) => setCompany(data ?? {}));
  }, []);

  const field = (key: keyof Company, label: string) => (
    <div className="grid gap-2">
      <Label htmlFor={`company-${key}`}>{label}</Label>
      <Input
        id={`company-${key}`}
        value={company[key] ?? ""}
        onChange={(e) => setCompany({ ...company, [key]: e.target.value })}
      />
    </div>
  );

  const save = async () => {
    const response = await fetch(`${appUrl}/api/company`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(company),
    });
    if (response.ok) {
      toast.success("Datos del negocio guardados");
    } else {
      toast.error(await apiErrorMessage(response, "No se pudieron guardar los datos"));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos del negocio</CardTitle>
        <CardDescription>Aparecen en los recibos impresos.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        {field("name", "Nombre")}
        {field("address", "Dirección")}
        {field("phoneNumber", "Teléfono")}
        {field("email", "Email")}
        {field("logo", "URL del logo")}
      </CardContent>
      <CardFooter>
        <Button onClick={save}>Guardar</Button>
      </CardFooter>
    </Card>
  );
}
