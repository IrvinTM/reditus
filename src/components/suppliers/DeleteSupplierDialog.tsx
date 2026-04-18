import { Supplier } from "@/types/types";
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

interface DeleteSupplierDialogProps {
  supplier: Supplier;
  onSupplierDeleted: () => void;
}

export const DeleteSupplierDialog = ({ supplier, onSupplierDeleted }: DeleteSupplierDialogProps) => {
  const appUrl = import.meta.env.VITE_BACK_URL;

  const handleDelete = async () => {
    try {
      const response = await fetch(appUrl + "/api/suppliers/delete/" + supplier.id, {
        method: "delete",
      });
      if (response.ok) {
        onSupplierDeleted();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Borrar</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Estas seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta accion no se puede deshacer. Se eliminara el proveedor {supplier.name}.
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
