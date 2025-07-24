import { useState } from "react";
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
import Layout from "./layout/Layout";
import { Product, SaleItem } from "@/types/types";

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
  const [saleItems, setSaleItems] = useState<SaleItem[]>([
    { id: 1, product: exampleProduct, priceAtSale: 1200, quantity: 1 },
    { id: 1, product: exampleProduct, priceAtSale: 1200, quantity: 1 },
    { id: 1, product: exampleProduct, priceAtSale: 1200, quantity: 1 },
  ]);
  const [discount, setDiscount] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [barcode, setBarcode] = useState("");
  const appUrl = import.meta.env.VITE_BACK_URL;
  const [searchText, setSearchText] = useState("");


  const subtotal = saleItems.reduce(
    (sum, saleItem) => sum + saleItem.priceAtSale * saleItem.quantity,
    0
  );
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + tax - discount;

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

  const handleSearch = async () =>{
    const response = await fetch(appUrl+"/api/products/search/"+searchText, {
    })

  }

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

  const handleCompleteSale = () => {
    alert(`Sale completed! Total: $${total.toFixed(2)}`);
    // In a real app, this would process the payment and create a receipt
    setSaleItems([]);
    setDiscount(0);
    setCustomerName("");
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left side - Item list */}
        <Card className="h-[calc(100vh-120px)]">
          <CardHeader>
            <CardTitle>Items</CardTitle>
            <div className="flex gap-2">
              <Input
                placeholder="Scan or enter barcode"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleAddProduct}>Add</Button>
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
                        ${saleItem.priceAtSale.toFixed(2)} each
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
                    No items added to sale
                  </div>
                )}
              </div>
            </ScrollArea>
            <CardFooter className="">
              <div className="w-full">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (8%):</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </CardFooter>
          </CardContent>
        </Card>

        {/* Right side - Sale options */}
        <Card className="h-[calc(100vh-120px)]">
          <CardHeader>
            <CardTitle>Complete Sale</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="payment" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="payment">Payment</TabsTrigger>
                <TabsTrigger value="customer">Customer</TabsTrigger>
                <TabsTrigger value="discount">Discount</TabsTrigger>
              </TabsList>
              <TabsContent value="payment" className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Select Payment Method</h3>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash" className="flex items-center gap-2">
                        <Banknote className="h-4 w-4" /> Cash
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" /> Card
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mobile" id="mobile" />
                      <Label
                        htmlFor="mobile"
                        className="flex items-center gap-2"
                      >
                        <Wallet className="h-4 w-4" /> Mobile Pay
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">Other</Label>
                    </div>
                  </RadioGroup>
                </div>

                {paymentMethod === "cash" && (
                  <div className="space-y-2 pt-4">
                    <Label htmlFor="cashAmount">Cash Amount</Label>
                    <div className="flex gap-2">
                      <Input id="cashAmount" type="number" placeholder="0.00" />
                      <Button variant="outline">Calculate Change</Button>
                    </div>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="customer" className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <h3 className="font-medium">Customer Information</h3>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Customer Name</Label>
                    <Input
                      id="customerName"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerPhone">Phone Number</Label>
                    <Input
                      id="customerPhone"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerEmail">Email</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="discount" className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4" />
                    <h3 className="font-medium">Apply Discount</h3>
                  </div>
                  <RadioGroup defaultValue="none" className="grid gap-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="none"
                        id="none"
                        onClick={() => setDiscount(0)}
                      />
                      <Label htmlFor="none">No Discount</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="percentage"
                        id="percentage"
                        onClick={() => setDiscount(subtotal * 0.1)}
                      />
                      <Label htmlFor="percentage">10% Off</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="fixed"
                        id="fixed"
                        onClick={() => setDiscount(5)}
                      />
                      <Label htmlFor="fixed">$5 Off</Label>
                    </div>
                  </RadioGroup>
                  <div className="pt-2">
                    <Label htmlFor="customDiscount">
                      Custom Discount Amount ($)
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
                Hold Sale
              </Button>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => setSaleItems([])}
              >
                Cancel
              </Button>
            </div>
            <Button
              className="w-full h-16 text-lg"
              size="lg"
              onClick={handleCompleteSale}
              disabled={saleItems.length === 0}
            >
              <Receipt className="mr-2 h-5 w-5" /> Complete Sale ($
              {total.toFixed(2)})
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
}
