import { Supplier } from "@/types/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useState } from "react";
import { Mail, Phone, MapPin, Hash } from "lucide-react";
import { EditSupplier } from "./EditSupplier";
import { DeleteSupplierDialog } from "./DeleteSupplierDialog";

interface SupplierCardProps {
  supplier: Supplier;
  onSupplierDeleted: () => void;
}

const SupplierCard = ({ supplier, onSupplierDeleted }: SupplierCardProps) => {
  const [supp, setSupp] = useState<Supplier>(supplier);

  return (
    <Card className="w-full max-w-sm overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold line-clamp-1">
          {supp.name}
        </CardTitle>
        <CardDescription className="flex items-center gap-1 text-sm text-muted-foreground">
          <Hash className="h-3 w-3" /> {supp.identification}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 pt-2">
        <div className="flex items-center gap-2 text-sm">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span>{supp.phoneNumber || "N/A"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="truncate" title={supp.email}>{supp.email || "N/A"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="truncate" title={supp.address}>{supp.address || "N/A"}</span>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <EditSupplier supplier={supp} onSupplierChange={setSupp} />
          <DeleteSupplierDialog supplier={supp} onSupplierDeleted={onSupplierDeleted} />
        </div>
      </CardContent>
    </Card>
  );
};

export default SupplierCard;
