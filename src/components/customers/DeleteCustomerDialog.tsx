import { Customer } from "@/types/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";

interface DeleteCustomerDialogProps {
  customer: Customer;
  onCustomerDeleted: () => void;
}

export const DeleteCustomerDialog = ({ customer, onCustomerDeleted }: DeleteCustomerDialogProps) => {

  const appUrl = import.meta.env.VITE_BACK_URL;

  const handleDelete = async () => {
    try {
      const response = await fetch(appUrl + "/api/customers/delete/" + customer.id, {
        method: "delete"
      })
      if (response.ok) {
        onCustomerDeleted()
      }
    }
    catch (error) {
      console.log(error)
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Borrar</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se eliminará el cliente {customer.name}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Borrar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
