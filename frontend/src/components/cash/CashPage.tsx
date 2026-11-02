import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router"
import { toast } from "sonner"
import { ArrowDownToLine, ArrowUpFromLine, FileText, Lock, Unlock } from "lucide-react"
import Layout from "../layout/Layout"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Badge } from "../ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Spinner } from "../ui/spinner"
import { useAuth } from "@/auth/AuthContext"
import { setDeviceRegisterId, useRegister } from "@/hooks/use-register"
import { Shift } from "@/types/types"
import { apiErrorMessage, formatDateTime, toCents, toPriceString } from "@/utils/utils"
import { printShiftReport } from "./ShiftReport"

const appUrl = import.meta.env.VITE_BACK_URL

async function post<T>(path: string, body: unknown, errorMessage: string): Promise<T | null> {
  const response = await fetch(`${appUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!response.ok) {
    toast.error(await apiErrorMessage(response, errorMessage))
    return null
  }
  return response.json()
}

export default function CashPage() {
  const { isAdmin } = useAuth()
  const { registers, registerId, register, shift, loading, reload } = useRegister()
  const navigate = useNavigate()

  const [openingFloat, setOpeningFloat] = useState("")
  const [movementType, setMovementType] = useState<"DEPOSIT" | "WITHDRAWAL">("WITHDRAWAL")
  const [movementAmount, setMovementAmount] = useState("")
  const [movementReason, setMovementReason] = useState("")
  const [countedCash, setCountedCash] = useState("")
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const run = async (action: () => Promise<void>) => {
    setSubmitting(true)
    try {
      await action()
    } finally {
      setSubmitting(false)
    }
  }

  const openShift = () =>
    run(async () => {
      const opened = await post<Shift>(
        "/api/shifts/open",
        { cashRegisterId: registerId, openingFloat: toCents(openingFloat) },
        "No se pudo abrir el turno",
      )
      if (opened) {
        toast.success("Turno abierto")
        setOpeningFloat("")
        reload()
      }
    })

  const addMovement = () =>
    run(async () => {
      const updated = await post<Shift>(
        `/api/shifts/${shift!.id}/cash`,
        { type: movementType, amount: toCents(movementAmount), reason: movementReason },
        "No se pudo registrar el movimiento",
      )
      if (updated) {
        toast.success(movementType === "DEPOSIT" ? "Entrada registrada" : "Salida registrada")
        setMovementAmount("")
        setMovementReason("")
        reload()
      }
    })

  const closeShift = () =>
    run(async () => {
      const closed = await post<Shift>(
        `/api/shifts/${shift!.id}/close`,
        { countedCash: toCents(countedCash), notes: notes || null },
        "No se pudo cerrar el turno",
      )
      if (closed) {
        toast.success("Turno cerrado")
        const response = await fetch(`${appUrl}/api/shifts/${closed.id}/report`)
        if (response.ok) {
          printShiftReport(await response.json())
        }
        navigate(`/caja/turnos/${closed.id}`)
      }
    })

  const printPartialReport = async () => {
    const response = await fetch(`${appUrl}/api/shifts/${shift!.id}/report`)
    if (response.ok) {
      printShiftReport(await response.json())
    }
  }

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="text-3xl font-bold">Caja</h1>
          {registers.length > 1 && (
            <Select
              value={registerId?.toString() ?? ""}
              onValueChange={(value) => {
                setDeviceRegisterId(Number(value))
                reload()
              }}
            >
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Seleccionar caja" />
              </SelectTrigger>
              <SelectContent>
                {registers.map((r) => (
                  <SelectItem key={r.id} value={r.id.toString()}>
                    {r.name ?? `Caja ${r.id}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {shift ? <Badge>Turno abierto</Badge> : <Badge variant="secondary">Sin turno abierto</Badge>}
        </div>

        {loading ? (
          <Spinner className="size-6" />
        ) : !register ? (
          <p className="text-muted-foreground">No hay cajas registradas. Un administrador puede crearlas en Ajustes.</p>
        ) : !shift ? (
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Abrir turno en {register.name ?? `Caja ${register.id}`}</CardTitle>
              <CardDescription>
                Cuente el efectivo que hay en la caja antes de empezar. Último saldo registrado:{" "}
                {toPriceString(register.balance)}.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Label htmlFor="opening-float">Fondo inicial ($)</Label>
              <Input
                id="opening-float"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={openingFloat}
                onChange={(e) => setOpeningFloat(e.target.value)}
              />
            </CardContent>
            <CardFooter>
              <Button onClick={openShift} disabled={submitting || openingFloat === ""}>
                <Unlock className="mr-2 h-4 w-4" /> Abrir turno
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Turno #{shift.id}</CardTitle>
                <CardDescription>
                  Abierto por {shift.openedBy} el {formatDateTime(shift.openedAt)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Fondo inicial</span>
                  <span>{toPriceString(shift.openingFloat)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Efectivo esperado</span>
                  <span>{toPriceString(shift.expectedCash)}</span>
                </div>
              </CardContent>
              <CardFooter className="gap-2">
                <Button variant="outline" onClick={printPartialReport}>
                  <FileText className="mr-2 h-4 w-4" /> Reporte parcial
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/vender">Ir a vender</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Entrada / salida de efectivo</CardTitle>
                <CardDescription>Pagos a proveedores, retiros, cambio agregado, etc.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Select value={movementType} onValueChange={(v) => setMovementType(v as "DEPOSIT" | "WITHDRAWAL")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WITHDRAWAL">Salida de efectivo</SelectItem>
                    <SelectItem value="DEPOSIT">Entrada de efectivo</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Monto"
                  value={movementAmount}
                  onChange={(e) => setMovementAmount(e.target.value)}
                />
                <Input
                  placeholder="Motivo"
                  value={movementReason}
                  onChange={(e) => setMovementReason(e.target.value)}
                />
              </CardContent>
              <CardFooter>
                <Button
                  onClick={addMovement}
                  disabled={submitting || toCents(movementAmount) <= 0 || !movementReason.trim()}
                >
                  {movementType === "DEPOSIT" ? (
                    <ArrowDownToLine className="mr-2 h-4 w-4" />
                  ) : (
                    <ArrowUpFromLine className="mr-2 h-4 w-4" />
                  )}
                  Registrar
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cerrar turno</CardTitle>
                <CardDescription>Cuente el efectivo de la caja. El sistema calcula la diferencia.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Label htmlFor="counted-cash">Efectivo contado ($)</Label>
                <Input
                  id="counted-cash"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={countedCash}
                  onChange={(e) => setCountedCash(e.target.value)}
                />
                <Input placeholder="Notas (opcional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
              </CardContent>
              <CardFooter>
                <Button variant="destructive" onClick={closeShift} disabled={submitting || countedCash === ""}>
                  <Lock className="mr-2 h-4 w-4" /> Cerrar turno
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {isAdmin && <RecentShifts />}
      </div>
    </Layout>
  )
}

function RecentShifts() {
  const [shifts, setShifts] = useState<Shift[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${appUrl}/api/shifts?size=30`)
      .then((response) => (response.ok ? response.json() : []))
      .then(setShifts)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Turnos recientes</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Caja</TableHead>
              <TableHead>Abierto</TableHead>
              <TableHead>Cerrado</TableHead>
              <TableHead className="text-right">Esperado</TableHead>
              <TableHead className="text-right">Contado</TableHead>
              <TableHead className="text-right">Diferencia</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shifts.map((s) => (
              <TableRow key={s.id} className="cursor-pointer" onClick={() => navigate(`/caja/turnos/${s.id}`)}>
                <TableCell>{s.id}</TableCell>
                <TableCell>{s.cashRegisterName ?? s.cashRegisterId}</TableCell>
                <TableCell>{formatDateTime(s.openedAt)} · {s.openedBy}</TableCell>
                <TableCell>{s.status === "OPEN" ? <Badge>Abierto</Badge> : `${formatDateTime(s.closedAt)} · ${s.closedBy}`}</TableCell>
                <TableCell className="text-right">{toPriceString(s.expectedCash)}</TableCell>
                <TableCell className="text-right">{s.countedCash === null ? "—" : toPriceString(s.countedCash)}</TableCell>
                <TableCell
                  className={`text-right ${s.difference && s.difference < 0 ? "text-destructive" : ""}`}
                >
                  {s.difference === null ? "—" : toPriceString(s.difference)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
