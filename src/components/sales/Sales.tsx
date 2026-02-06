import { useEffect, useState } from "react";
import {
  MinusCircle,
  PlusCircle,
  Trash2,
  Receipt,
  CreditCard,
  Banknote,
  Wallet,
  User,
  Percent,
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
import { CreateSaleRequest, Customer, Product, SaleItem, SaleItemRequest } from "@/types/types";
import { SelectFromProducts } from "./SelectFromProducts";
import { toPriceString } from "@/utils/utils";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

export default function Sales() {
  const exampleProduct = {
    id: 1,
    name: "test",
    code: "123456789",
    barCode: "1233",
    measurementUnit: "unit",
    categories: [],
    description: "This is a test product",
    image: "imgurl",
    cost: 1200,
    taxes: "", // TODO create type tax
    priceIncludesTaxes: true,
    allowPriceChange: true,
    noTaxIncludedPrice: 1200,
    taxIncludedPrice: 1200,
    profitMargin: 12,
    salesPrice: 1200,
    available: 2,
    active: true,
    ageRestricted: false,
  };
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [barcode, setBarcode] = useState("");
  const appUrl = import.meta.env.VITE_BACK_URL;
  // const [searchText, setSearchText] = useState("");
  const [cashChange, setCashChange] = useState<number>();
  const [cashAmount, setCashamount] = useState<number>();
  const [customer, setCustomer] = useState<Customer>();
  const [openDialog, setOpenDialog] = useState(false);
  const [anon, setAnon] = useState(true);


  const subtotal = saleItems.reduce(
    (sum, saleItem) => sum + saleItem.priceAtSale * saleItem.quantity,
    0
  );
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + tax - discount;

  useEffect(() => {
    if (cashAmount !== undefined) {
      const change = cashAmount * 100 - total;
      setCashChange(change);
    }
  }, [cashAmount, total]);

  const handleQuantityChange = (id: number, change: number) => {
    setSaleItems(
      saleItems.map((saleItem) => {
        if (saleItem.id === id) {
          const newQuantity = Math.max(1, saleItem.quantity + change);
          return { ...saleItem, quantity: newQuantity };
        }
        return saleItem;
      })
    );
  };

  /*   const handleSearch = async () => {
      const response = await fetch(
        appUrl + "/api/products/search/" + searchText,
        {}
      );
    }; */

  const handleRemoveProduct = (id: number) => {
    setSaleItems(saleItems.filter((saleItem) => saleItem.id !== id));
  };

  const handleAddProduct = () => {
    // In a real app, this would search for the product by barcode
    if (barcode.trim()) {
      const newSaleItem = {
        id: Math.random() * 2000,
        product: exampleProduct,
        priceAtSale: Math.floor(Math.random() * 50) + 10,
        quantity: 1,
      };
      setSaleItems([...saleItems, newSaleItem]);
      setBarcode("");
    }
  };

  const addProduct = (newProduct: Product) => {
    const existingItem = saleItems.find(
      (item) => item.product.id === newProduct.id
    );

    if (existingItem) {
      setSaleItems(
        saleItems.map((item) =>
          item.product.id === newProduct.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      const nsaleItem = {
        id: Math.random() * 2000,
        product: newProduct,
        quantity: 1,
        priceAtSale: newProduct.salesPrice,
      };
      setSaleItems([...saleItems, nsaleItem]);
    }

    toast.success("Product added", { description: newProduct.name });
  };

  const handleCompleteSale = async () => {
    //TODO validate if customer exists or create a new one if it doesnt
    //TODO create a cash register in the backend
    //TODO get the discount and customer from the actual sale

    const itemsReq: SaleItemRequest[] = []

    saleItems.forEach((item) => {
      const i: SaleItemRequest = {
        priceAtSale: item.priceAtSale,
        productId: item.product.id,
        quantity: item.quantity
      }

      itemsReq.push(i)
    })

    const defaultCashRegisterId = localStorage.getItem("defaultCashRegisterId");
    const cashRegisterID = parseInt(defaultCashRegisterId || "1");

    const sale: CreateSaleRequest = {
      // Use saved cash register ID or default to 1
      cashRegisterID: cashRegisterID,
      //hardcoded cust id
      customerID: customer?.id || 1,
      discount: discount,
      items: itemsReq,
      total: total,
    };
    const response = await fetch(appUrl + "/api/sales/create", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sale),
    });
    if (response.ok) {
      toast("Venta guardada");
      setSaleItems([]);
      setDiscount(0);
    } else {
      try {
        const errorData = await response.json();
        toast.error(errorData.message || "Error al procesar la venta");
      } catch (e) {
        toast.error("Error al procesar la venta");
      }
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left side - Item list */}
        <Card className="h-[calc(100vh-120px)]">
          <CardHeader>
            <CardTitle>Venta</CardTitle>
            <div className="flex gap-2">
              <Input
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
                      <div className="text-sm text-muted-foreground">
                        {toPriceString(saleItem.priceAtSale)} cada uno
                      </div>
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
                  <span>Impuesto (8%):</span>
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
                <div className="space-y-2">
                  <h3 className="font-medium">Seleccionar metodo de pago</h3>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash" className="flex items-center gap-2">
                        <Banknote className="h-4 w-4" /> Efectivo
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" /> Tarjeta
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mobile" id="mobile" />
                      <Label
                        htmlFor="mobile"
                        className="flex items-center gap-2"
                      >
                        <Wallet className="h-4 w-4" /> Pago con celular
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">Otro</Label>
                    </div>
                  </RadioGroup>
                </div>

                {paymentMethod === "cash" && (
                  <div className="space-y-2 pt-4">
                    <Label htmlFor="cashAmount">Cantidad</Label>
                    <div className="flex gap-2">
                      <Input
                        id="cashAmount"
                        type="number"
                        placeholder="0.00"
                        value={cashAmount}
                        onChange={(e) => {
                          setCashamount(Number.parseFloat(e.target.value) || 0);
                        }}
                      />
                    </div>
                    <span>
                      {(cashChange || 0) > 0
                        ? "El cambio es: " + toPriceString(cashChange || 0)
                        : "Faltan: " + toPriceString(cashChange || 0)}
                    </span>
                  </div>
                )}
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
                  <RadioGroup defaultValue="none" className="grid gap-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="none"
                        id="none"
                        onClick={() => setDiscount(0)}
                      />
                      <Label htmlFor="none">Sin descuento</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="percentage"
                        id="percentage"
                        onClick={() => setDiscount(subtotal * 0.1)}
                      />
                      <Label htmlFor="percentage">10% de descuento</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="fixed"
                        id="fixed"
                        onClick={() => setDiscount(5)}
                      />
                      <Label htmlFor="fixed">$5 de descuento</Label>
                    </div>
                  </RadioGroup>
                  <div className="pt-2">
                    <Label className="mb-2" htmlFor="customDiscount">
                      Ingresar cantidad de descuento ($)
                    </Label>
                    <Input
                      id="customDiscount"
                      type="number"
                      placeholder="0.00"
                      onChange={(e) =>
                        setDiscount(Number.parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>
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
                onClick={() => setSaleItems([])}
              >
                Cancelar
              </Button>
            </div>
            <Button
              className="w-full h-16 text-lg"
              size="lg"
              onClick={handleCompleteSale}
              disabled={saleItems.length === 0}
            >
              <Receipt className="mr-2 h-5 w-5" /> Completar venta (
              {toPriceString(total)})
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
}
