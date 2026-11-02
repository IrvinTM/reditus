import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { Printer } from "lucide-react"
import Layout from "../layout/Layout"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Spinner } from "../ui/spinner"
import { ShiftReport as ShiftReportData } from "@/types/types"
import { PRINT_CSS } from "@/utils/print"
import { ShiftReport, printShiftReport } from "./ShiftReport"

const appUrl = import.meta.env.VITE_BACK_URL

export default function ShiftReportPage() {
  const { shiftId } = useParams()
  const [report, setReport] = useState<ShiftReportData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${appUrl}/api/shifts/${shiftId}/report`)
      .then((response) => (response.ok ? response.json() : null))
      .then(setReport)
      .finally(() => setLoading(false))
  }, [shiftId])

  return (
    <Layout>
      <div className="p-4 md:p-8 space-y-4">
        {loading ? (
          <div className="flex justify-center"><Spinner className="size-6" /></div>
        ) : !report ? (
          <p className="text-center text-muted-foreground">No se encontró el turno.</p>
        ) : (
          <>
            <div className="flex justify-center">
              <Button onClick={() => printShiftReport(report)}>
                <Printer className="mr-2 h-4 w-4" /> Imprimir
              </Button>
            </div>
            <Card className="bg-white text-black w-fit mx-auto">
              <CardContent className="p-2">
                <style>{PRINT_CSS}</style>
                <ShiftReport report={report} />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </Layout>
  )
}
