import { Product } from "@/types/types";
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

interface DeleteDialog {
  product: Product;
}

export const DeleteDialog = ({product}:DeleteDialog) => {

  const appUrl = import.meta.env.VITE_BACK_URL;

  const handleDelete=()=>{
    fetch(appUrl+"/api/products/delete/"+product.id, {
      method: "delete"
    }).then((response)=>{console.log(response.json())})

  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Borrar</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Estas seguro ?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta accion no se puede deshacer
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
