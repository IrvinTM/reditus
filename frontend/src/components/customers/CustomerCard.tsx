import { Customer } from "@/types/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { EditCustomer } from "./EditCustomer";
import { DeleteCustomerDialog } from "./DeleteCustomerDialog";
import { useState } from "react";
import { Mail, Phone, MapPin, Hash } from "lucide-react";

interface CustomerCardProps {
  customer: Customer;
  onCustomerDeleted: () => void;
}

const CustomerCard = ({ customer, onCustomerDeleted }: CustomerCardProps) => {
  const [cust, setCust] = useState<Customer>(customer);

  return (
    <Card className="w-full max-w-sm overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold line-clamp-1">
          {cust.name}
        </CardTitle>
        <CardDescription className="flex items-center gap-1 text-sm text-muted-foreground">
             <Hash className="h-3 w-3" /> {cust.identification}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 pt-2">
        <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{cust.phoneNumber || "N/A"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="truncate" title={cust.email}>{cust.email || "N/A"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="truncate" title={cust.address}>{cust.address || "N/A"}</span>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <EditCustomer customer={cust} onCustomerChange={setCust} />
          <DeleteCustomerDialog customer={cust} onCustomerDeleted={onCustomerDeleted} />
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerCard;
