"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
const chartData = [
  { month: "Enero", Telefonos: 186, Accesorios: 80 },
  { month: "Febrero", Telefonos: 305, Accesorios: 200 },
  { month: "Marzo", Telefonos: 237, Accesorios: 120 },
  { month: "Abril", Telefonos: 73, Accesorios: 190 },
  { month: "Mayo", Telefonos: 209, Accesorios: 130 },
  { month: "Junio", Telefonos: 214, Accesorios: 140 },
]

const chartConfig = {
  Telefonos: {
    label: "Telefonos",
    color: "green",
  },
  Accesorios: {
    label: "Accesorios",
    color: "orange",
  },
} satisfies ChartConfig

export default function Chart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ventas por mes</CardTitle>
        <CardDescription>Enero - Junio 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent payload={undefined} />} />
            <Bar
              dataKey="Telefonos"
              stackId="a"
              fill="var(--color-Telefonos)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="Accesorios"
              stackId="a"
              fill="var(--color-Accesorios)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Arriba por 5.2% este mes <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Ventas totales los ultimos seis meses.
        </div>
      </CardFooter>
    </Card>
  )
}