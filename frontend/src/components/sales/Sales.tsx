import { useEffect, useRef, useState } from "react";
import {
  MinusCircle,
  PlusCircle,
  Trash2,
  Receipt,
  User,
  Percent,
  Plus,
  Printer,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Layout from "../layout/Layout";
import {
  CreateSaleRequest,
  Customer,
  PaymentMethod,
  Product,
  SaleItem,
  SaleItemRequest,
  SaleResponse,
  Tax,
} from "@/types/types";
import { SelectFromProducts } from "./SelectFromProducts";
import { apiErrorMessage, lineAmounts, paymentMethodLabels, toCents, toPriceString } from "@/utils/utils";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRegister } from "@/hooks/use-register";
import { Link, useNavigate } from "react-router";
import { AUTO_PRINT_KEY, fetchCompany, isAutoPrintEnabled, printReceipt } from "./Receipt";
import { Checkbox } from "@/components/ui/checkbox";

const PAYMENT_METHODS: PaymentMethod[] = ["CASH", "CARD", "MOBILE", "OTHER"];

type PaymentRow = {
  method: PaymentMethod;
  /** as typed by the cashier, in currency units */
  amount: string;
};

export default function Sales() {
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [discountOption, setDiscountOption] = useState("none");
  const [customDiscount, setCustomDiscount] = useState("");
  const [payments, setPayments] = useState<PaymentRow[]>([{ method: "CASH", amount: "" }]);
  const [barcode, setBarcode] = useState("");
  const barcodeInput = useRef<HTMLInputElement>(null);
  const appUrl = import.meta.env.VITE_BACK_URL;
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [customer, setCustomer] = useState<Customer>();
  const [openDialog, setOpenDialog] = useState(false);
  const [anon, setAnon] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [completedSale, setCompletedSale] = useState<SaleResponse | null>(null);
  const [autoPrint, setAutoPrint] = useState(isAutoPrintEnabled());
  const { registerId, register, shift, loading: registerLoading } = useRegister();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${appUrl}/api/taxes`)
      .then((response) => (response.ok ? response.json() : []))
      .then(setTaxes)
      .catch(() => setTaxes([]));
  }, []);

  // preview only: the server computes the real amounts
  const lines = saleItems.map((item) => lineAmounts(item.product, item.priceAtSale, item.quantity, taxes));
  const subtotal = lines.reduce((sum, line) => sum + line.net, 0);
  const tax = lines.reduce((sum, line) => sum + line.tax, 0);
  const gross = lines.reduce((sum, line) => sum + line.total, 0);

  useEffect(() => {
    if (discountOption === "percentage") {
      setDiscount(Math.round(gross * 0.1));
    } else if (discountOption === "custom") {
      setDiscount(Math.min(toCents(customDiscount), gross));
    } else {
      setDiscount(0);
    }
  }, [discountOption, customDiscount, gross]);

  const total = Math.max(gross - discount, 0);
  const paid = payments.reduce((sum, payment) => sum + toCents(payment.amount), 0);
  const nonCashPaid = payments
    .filter((payment) => payment.method !== "CASH")
    .reduce((sum, payment) => sum + toCents(payment.amount), 0);
  const hasCash = payments.some((payment) => payment.method === "CASH");
  const change = paid - total;
  const paymentError =
    nonCashPaid > total
      ? "Los pagos que no son en efectivo no pueden exceder el total"
      : !hasCash && paid !== total
        ? "Sin efectivo, los pagos deben sumar exactamente el total"
        : paid < total
          ? `Faltan ${toPriceString(total - paid)}`
          : null;

  const resetSale = () => {
    setSaleItems([]);
    setDiscountOption("none");
    setCustomDiscount("");
    setPayments([{ method: "CASH", amount: "" }]);
    setAnon(true);
    setCustomer(undefined);
    barcodeInput.current?.focus();
  };

  const handleQuantityChange = (id: number, change: number) => {
    setSaleItems(
      saleItems.map((saleItem) => {
        if (saleItem.id === id) {
          const maxAvailable = saleItem.product.available;
          const nextQuantity = saleItem.quantity + change;
          if (nextQuantity > maxAvailable) {
            toast.error("No hay suficiente stock");
            return saleItem;
          }
          const newQuantity = Math.max(1, nextQuantity);
          return { ...saleItem, quantity: newQuantity };
        }
        return saleItem;
      })
    );
  };

  const handlePriceChange = (id: number, value: string) => {
    setSaleItems(saleItems.map((item) => (item.id === id ? { ...item, priceAtSale: toCents(value) } : item)));
  };

  const handleRemoveProduct = (id: number) => {
    setSaleItems(saleItems.filter((saleItem) => saleItem.id !== id));
  };

  const handleAddProduct = async () => {
    const code = barcode.trim();
    if (!code) {
      return;
    }
    setBarcode("");
    const response = await fetch(`${appUrl}/api/products/barcode/${encodeURIComponent(code)}`);
    const product: Product | null = response.ok ? await response.json().catch(() => null) : null;
    if (!product) {
      toast.error("No se encontró ningún producto con el código " + code);
    } else {
      addProduct(product);
    }
    barcodeInput.current?.focus();
  };

  const addProduct = (newProduct: Product) => {
    if (!newProduct.active) {
      toast.error("Este producto no está activo");
      return;
    }
    if (newProduct.available <= 0) {
      toast.error("Este producto no tiene stock disponible");
      return;
    }

    const existingItem = saleItems.find(
      (item) => item.product.id === newProduct.id
    );

    if (existingItem) {
      if (existingItem.quantity >= newProduct.available) {
        toast.error("No hay suficiente stock para agregar otra unidad");
        return;
      }
      setSaleItems(
        saleItems.map((item) =>
          item.product.id === newProduct.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      const nsaleItem = {
        id: Date.now() + Math.random(),
        product: newProduct,
        quantity: 1,
        priceAtSale: newProduct.salesPrice,
      };
      setSaleItems([...saleItems, nsaleItem]);
    }

    toast.success("Producto agregado", { description: newProduct.name });
  };

  const updatePayment = (index: number, changes: Partial<PaymentRow>) => {
    setPayments(payments.map((payment, i) => (i === index ? { ...payment, ...changes } : payment)));
  };

  const fillRemaining = (index: number) => {
    const others = payments.reduce((sum, payment, i) => (i === index ? sum : sum + toCents(payment.amount)), 0);
    updatePayment(index, { amount: (Math.max(total - others, 0) / 100).toFixed(2) });
  };

  const handleCompleteSale = async () => {
    if (!shift || registerId === null) {
      toast.error("Abra un turno en la caja antes de vender");
      return;
    }
    if (paymentError) {
      toast.error(paymentError);
      return;
    }

    const itemsReq: SaleItemRequest[] = saleItems.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
      // the server uses the product price unless the product allows changing it
      price: item.product.allowPriceChange ? item.priceAtSale : undefined,
    }));

    const sale: CreateSaleRequest = {
      cashRegisterID: registerId,
      customerID: anon ? null : customer?.id ?? null,
      discount: discount,
      items: itemsReq,
      payments: payments
        .filter((payment) => toCents(payment.amount) > 0)
        .map((payment) => ({ method: payment.method, amount: toCents(payment.amount) })),
    };

    setSubmitting(true);
    try {
      const response = await fetch(appUrl + "/api/sales/create", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sale),
      });
      if (!response.ok) {
        toast.error(await apiErrorMessage(response, "Error al procesar la venta"));
        return;
      }
      const saved: SaleResponse = await response.json();
      setCompletedSale(saved);
      resetSale();
      if (autoPrint) {
        printReceipt(saved, await fetchCompany());
      }
    } catch {
      toast.error("Error de conexión al procesar la venta");
    } finally {
      setSubmitting(false);
    }
  };

  const handleValidateCustomer = async () => {
    let path: string;
    let value: string | undefined;

    if (customer?.identification) {
      path = "identification";
      value = customer.identification;
    } else if (customer?.phoneNumber) {
      path = "phone";
      value = customer.phoneNumber;
    } else if (customer?.email) {
      path = "email";
      value = customer.email;
    } else {
      toast.warning("Ingrese un campo único para validar (Identificación, Teléfono o Email)");
      return;
    }

    if (!value) return;

    try {
      const response = await fetch(`${appUrl}/api/customers/${path}/${value}`);
      if (response.ok) {
        const data = await response.json();
        setCustomer(data);
        toast.success("Cliente encontrado: " + data.name);
      } else {
        setOpenDialog(true);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al validar cliente");
    }
  };

  const validateField = async (type: string, value: string | undefined) => {
    if (!value) return;
    // Don't validate if we already have a full customer loaded with that ID (optional optimization, but let's keep simple)

    try {
      const response = await fetch(`${appUrl}/api/customers/${type}/${value}`);
      if (response.ok) {
        const data = await response.json();
        setCustomer(data);
        toast.success("Datos del cliente cargados");
      }
      // If not found silently via onBlur, maybe just do nothing or small toast?
      // The user might be typing a new customer.
    } catch (e) {
      // ignore
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, type: string, value: string | undefined) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      validateField(type, value);
    }
  }

  return (
    <Layout>
      {!registerLoading && !shift && (
        <div className="mx-4 mb-4 flex items-center gap-3 rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-3 text-sm">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <span className="flex-1">
            {register
              ? `${register.name ?? "La caja"} no tiene un turno abierto. Abra un turno para poder vender.`
              : "No hay una caja configurada para este equipo."}
          </span>
          <Button size="sm" asChild>
            <Link to="/caja">Ir a Caja</Link>
          </Button>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left side - Item list */}
        <Card className="h-[calc(100vh-120px)]">
          <CardHeader>
            <CardTitle>Venta</CardTitle>
            <div className="flex gap-2">
              <Input
                ref={barcodeInput}
                autoFocus
                placeholder="Escanear o ingresar codigo de barras"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddProduct();
                  }
                }}
              />
              <Button onClick={handleAddProduct}>Agregar</Button>
              <SelectFromProducts
                onProductSelected={addProduct}
              ></SelectFromProducts>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-320px)]">
              <div className="space-y-4">
                {saleItems.map((saleItem) => (
                  <div
                    key={saleItem.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{saleItem.product.name}</div>
                      {saleItem.product.allowPriceChange ? (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <span>$</span>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            className="h-7 w-24"
                            defaultValue={(saleItem.priceAtSale / 100).toFixed(2)}
                            onBlur={(e) => handlePriceChange(saleItem.id, e.target.value)}
                          />
                          <span>cada uno</span>
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          {toPriceString(saleItem.priceAtSale)} cada uno
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(saleItem.id, -1)}
                        className="h-8 w-8"
                      >
                        <MinusCircle className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">
                        {saleItem.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(saleItem.id, 1)}
                        className="h-8 w-8"
                      >
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveProduct(saleItem.id)}
                        className="h-8 w-8 text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {saleItems.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Ningun producto agregado
                  </div>
                )}
              </div>
            </ScrollArea>
            <CardFooter className="">
              <div className="w-full">
                <div className="flex justify-between">
                  <span>Sub-total:</span>
                  <span>{toPriceString(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Impuestos:</span>
                  <span>{toPriceString(tax)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento:</span>
                    <span>-{toPriceString(discount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>{toPriceString(total)}</span>
                </div>
              </div>
            </CardFooter>
          </CardContent>
        </Card>

        {/* Right side - Sale options */}
        <Card className="h-[calc(100vh-120px)]">
          <CardHeader>
            <CardTitle>Completar venta</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="payment" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="payment">Pago</TabsTrigger>
                <TabsTrigger value="customer">Cliente</TabsTrigger>
                <TabsTrigger value="discount">Descuento</TabsTrigger>
              </TabsList>
              <TabsContent value="payment" className="space-y-4">
                <div className="space-y-3">
                  <h3 className="font-medium">Pagos</h3>
                  {payments.map((payment, index) => (
                    <div key={index} className="flex gap-2">
                      <Select
                        value={payment.method}
                        onValueChange={(value) => updatePayment(index, { method: value as PaymentMethod })}
                      >
                        <SelectTrigger className="w-44">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PAYMENT_METHODS.map((method) => (
                            <SelectItem key={method} value={method}>
                              {paymentMethodLabels[method]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={payment.amount}
                        onChange={(e) => updatePayment(index, { amount: e.target.value })}
                      />
                      <Button variant="outline" onClick={() => fillRemaining(index)} title="Completar el total">
                        Exacto
                      </Button>
                      {payments.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => setPayments(payments.filter((_, i) => i !== index))}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPayments([...payments, { method: "CARD", amount: "" }])}
                  >
                    <Plus className="mr-1 h-4 w-4" /> Agregar otro pago
                  </Button>
                </div>
                <div className="rounded-lg border p-3 text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Recibido:</span>
                    <span>{toPriceString(paid)}</span>
                  </div>
                  {paymentError ? (
                    <div className="text-destructive">{paymentError}</div>
                  ) : (
                    <div className="flex justify-between text-lg font-bold">
                      <span>Cambio:</span>
                      <span>{toPriceString(change)}</span>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="customer" className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <h3 className="font-medium">Informacion del cliente</h3>
                  </div>
                  <div className="space-y-2">
                    {/*TODO save the sale to a anon cust if the radiogroup is checked */}
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={anon}
                        onCheckedChange={(checked) => {
                          setAnon(!!checked);
                          if (checked) setCustomer(undefined);
                        }}
                        id="toggle"
                      />
                      <Label htmlFor="toggle">Anonimo</Label>
                    </div>
                    <Label className={anon ? "text-secondary" : ""} htmlFor="customerName">Nombre</Label>

                    <Input
                      id="customerName"
                      disabled={anon}
                      value={customer?.name || ""}
                      onChange={(e) =>
                        setCustomer(prev => ({ ...prev!, name: e.target.value } as Customer))
                      }
                      placeholder="Ingresar el nombre del cliente"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className={anon ? "text-secondary" : ""} htmlFor="customerIdentification">
                      Identificacion
                    </Label>
                    <Input
                      disabled={anon}
                      id="customerIdentification"
                      value={customer?.identification || ""}
                      onChange={(e) =>
                        setCustomer(prev => ({ ...prev!, identification: e.target.value } as Customer))
                      }
                      onBlur={() => validateField("identification", customer?.identification)}
                      onKeyDown={(e) => handleKeyDown(e, "identification", customer?.identification)}
                      placeholder="Ingresar la identificacion del cliente"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className={anon ? "text-secondary" : ""} htmlFor="customerPhone">Numero de telefono</Label>
                    <Input
                      disabled={anon}
                      id="customerPhone"
                      placeholder="Ingresar el numero de telefono"
                      value={customer?.phoneNumber || ""}
                      onChange={(e) =>
                        setCustomer(prev => ({ ...prev!, phoneNumber: e.target.value } as Customer))
                      }
                      onBlur={() => validateField("phone", customer?.phoneNumber)}
                      onKeyDown={(e) => handleKeyDown(e, "phone", customer?.phoneNumber)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className={anon ? "text-secondary" : ""} htmlFor="customerEmail">Email</Label>
                    <Input
                      disabled={anon}
                      id="customerEmail"
                      type="email"
                      placeholder="Ingresar el email del cliente"
                      value={customer?.email || ""}
                      onChange={(e) =>
                        setCustomer(prev => ({ ...prev!, email: e.target.value } as Customer))
                      }
                      onBlur={() => validateField("email", customer?.email)}
                      onKeyDown={(e) => handleKeyDown(e, "email", customer?.email)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Button disabled={anon} onClick={handleValidateCustomer}>Validar cliente</Button>
                    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            No se encontro ningun cliente.
                          </DialogTitle>
                          <DialogDescription>
                            ¿Desea registrar un nuevo cliente con esta informacion?
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-2 mt-4">
                          <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancelar</Button>
                          {/* Ideally this would open the AddCustomer dialog or navigate to create page */}
                          <Button onClick={() => {
                            setOpenDialog(false);
                            toast.info("Por favor complete los datos y cree el cliente desde la sección Clientes (Próximamente creación rápida aquí)");
                          }}>Entendido</Button>
                        </div>
                      </DialogContent>

                    </Dialog>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="discount" className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4" />
                    <h3 className="font-medium">Aplicar descuento</h3>
                  </div>
                  <RadioGroup value={discountOption} onValueChange={setDiscountOption} className="grid gap-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="none" id="none" />
                      <Label htmlFor="none">Sin descuento</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="percentage" id="percentage" />
                      <Label htmlFor="percentage">10% de descuento</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="custom" id="custom" />
                      <Label htmlFor="custom">Monto fijo</Label>
                    </div>
                  </RadioGroup>
                  {discountOption === "custom" && (
                    <div className="pt-2">
                      <Label className="mb-2" htmlFor="customDiscount">
                        Ingresar cantidad de descuento ($)
                      </Label>
                      <Input
                        id="customDiscount"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={customDiscount}
                        onChange={(e) => setCustomDiscount(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex-col gap-4 border-t pt-4">
            <div className="grid grid-cols-2 gap-4 w-full">
              <Button variant="outline" className="w-full bg-transparent">
                Pausar venta
              </Button>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={resetSale}
              >
                Cancelar
              </Button>
            </div>
            <Button
              className="w-full h-16 text-lg"
              size="lg"
              onClick={handleCompleteSale}
              disabled={saleItems.length === 0 || !shift || submitting || paymentError !== null}
            >
              <Receipt className="mr-2 h-5 w-5" /> Completar venta (
              {toPriceString(total)})
            </Button>
            <div className="flex items-center gap-2 self-start">
              <Checkbox
                id="autoprint"
                checked={autoPrint}
                onCheckedChange={(checked) => {
                  setAutoPrint(!!checked);
                  localStorage.setItem(AUTO_PRINT_KEY, String(!!checked));
                }}
              />
              <Label htmlFor="autoprint">Imprimir recibo automáticamente</Label>
            </div>
          </CardFooter>
        </Card>
      </div>

      <Dialog
        open={completedSale !== null}
        onOpenChange={(open) => {
          if (!open) {
            setCompletedSale(null);
            barcodeInput.current?.focus();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Venta #{completedSale?.id} completada</DialogTitle>
            <DialogDescription>Total cobrado: {toPriceString(completedSale?.total ?? 0)}</DialogDescription>
          </DialogHeader>
          {completedSale?.payments.some((payment) => payment.change > 0) && (
            <div className="text-center text-3xl font-bold">
              Cambio: {toPriceString(completedSale.payments.reduce((sum, payment) => sum + payment.change, 0))}
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={async () => completedSale && printReceipt(completedSale, await fetchCompany())}
            >
              <Printer className="mr-2 h-4 w-4" /> Imprimir recibo
            </Button>
            <Button variant="outline" onClick={() => navigate(`/ventas/${completedSale?.id}`)}>
              Ver venta
            </Button>
            <Button onClick={() => setCompletedSale(null)} autoFocus>
              Nueva venta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
