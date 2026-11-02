import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, Download, HardDriveDownload, RotateCcw, Upload } from "lucide-react";
import Layout from "../layout/Layout";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { BackupStatus } from "@/types/types";
import { apiErrorMessage, formatDateTime } from "@/utils/utils";

const appUrl = import.meta.env.VITE_BACK_URL;

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(0)} KB`;
  }
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function BackupsSettings() {
  const [status, setStatus] = useState<BackupStatus | null>(null);
  const [busy, setBusy] = useState(false);
  const [restoreName, setRestoreName] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const response = await fetch(`${appUrl}/api/backups`);
    setStatus(response.ok ? await response.json() : null);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const withBusy = async (action: () => Promise<void>) => {
    setBusy(true);
    try {
      await action();
    } finally {
      setBusy(false);
      load();
    }
  };

  const createBackup = () =>
    withBusy(async () => {
      const response = await fetch(`${appUrl}/api/backups`, { method: "POST" });
      if (response.ok) {
        toast.success("Copia de seguridad creada");
      } else {
        toast.error(await apiErrorMessage(response, "No se pudo crear la copia"));
      }
    });

  // the download needs the auth header, so it goes through fetch instead of a plain link
  const download = async (name: string) => {
    const response = await fetch(`${appUrl}/api/backups/${name}`);
    if (!response.ok) {
      toast.error("No se pudo descargar la copia");
      return;
    }
    const url = URL.createObjectURL(await response.blob());
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.click();
    URL.revokeObjectURL(url);
  };

  const upload = (file: File) =>
    withBusy(async () => {
      const form = new FormData();
      form.append("file", file);
      const response = await fetch(`${appUrl}/api/backups/upload`, { method: "POST", body: form });
      if (response.ok) {
        toast.success("Archivo cargado. Ahora puede restaurarlo.");
      } else {
        toast.error(await apiErrorMessage(response, "No se pudo cargar el archivo"));
      }
    });

  const restore = (name: string) =>
    withBusy(async () => {
      const response = await fetch(`${appUrl}/api/backups/${name}/restore`, { method: "POST" });
      if (response.ok) {
        const safety = await response.json();
        toast.success("Datos restaurados", {
          description: `Los datos anteriores se guardaron en ${safety.name}.`,
        });
      } else {
        toast.error(await apiErrorMessage(response, "No se pudo restaurar la copia"));
      }
    });

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold">Copias de seguridad</h1>

        <Card>
          <CardHeader>
            <CardTitle>Estado</CardTitle>
            <CardDescription>
              Se crea una copia automática cada noche. Guarde una copia fuera de este equipo (USB o nube)
              descargándola o configurando la carpeta de copias en una unidad externa.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {status?.stale && (
              <div className="flex items-center gap-2 rounded-md border border-yellow-500/50 bg-yellow-500/10 p-3">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                No hay copias de las últimas 48 horas.
              </div>
            )}
            {status?.lastError && (
              <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3">
                Última copia fallida ({formatDateTime(status.lastErrorAt)}): {status.lastError}
              </div>
            )}
            <div>Última copia: <b>{formatDateTime(status?.lastBackupAt)}</b></div>
            <div className="text-muted-foreground">Carpeta: {status?.directory ?? "—"}</div>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button onClick={createBackup} disabled={busy}>
                <HardDriveDownload className="mr-2 h-4 w-4" /> Crear copia ahora
              </Button>
              <Button variant="outline" onClick={() => fileInput.current?.click()} disabled={busy}>
                <Upload className="mr-2 h-4 w-4" /> Cargar archivo de copia
              </Button>
              <input
                ref={fileInput}
                type="file"
                accept=".dump"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    upload(file);
                  }
                  e.target.value = "";
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Copias disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Archivo</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Tamaño</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {status?.files.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      Aún no hay copias.
                    </TableCell>
                  </TableRow>
                )}
                {status?.files.map((file) => (
                  <TableRow key={file.name}>
                    <TableCell className="font-mono text-xs">{file.name}</TableCell>
                    <TableCell>{formatDateTime(file.createdAt)}</TableCell>
                    <TableCell className="text-right">{formatSize(file.size)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="sm" variant="outline" onClick={() => download(file.name)}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" disabled={busy} onClick={() => setRestoreName(file.name)}>
                        <RotateCcw className="mr-1 h-4 w-4" /> Restaurar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={restoreName !== null} onOpenChange={(open) => !open && setRestoreName(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Restaurar {restoreName}?</AlertDialogTitle>
            <AlertDialogDescription>
              Todos los datos actuales (ventas, productos, turnos...) se reemplazarán por los de esta copia.
              Antes se guardará una copia de los datos actuales. Asegúrese de que nadie esté vendiendo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (restoreName) {
                  restore(restoreName);
                }
                setRestoreName(null);
              }}
            >
              Restaurar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
