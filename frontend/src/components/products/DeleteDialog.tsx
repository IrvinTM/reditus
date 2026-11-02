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
  onProductDeleted: () => void;
}

export const DeleteDialog = ({product, onProductDeleted}:DeleteDialog) => {

  const appUrl = import.meta.env.VITE_BACK_URL;

  const handleDelete= async ()=>{
    try{
   const response = await fetch(appUrl+"/api/products/delete/"+product.id, {
      method: "delete"
    })
    if(response.status === 204){
      onProductDeleted()
    }
    }
    catch(error){
      console.log(error)
    }
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
