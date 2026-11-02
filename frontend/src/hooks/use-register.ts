import { useCallback, useEffect, useState } from "react"
import { CashRegister, Shift } from "@/types/types"

const appUrl = import.meta.env.VITE_BACK_URL
export const REGISTER_KEY = "defaultCashRegisterId"

/** The register this device sells from (chosen in Ajustes, first register by default). */
export function getDeviceRegisterId(): number | null {
  const saved = localStorage.getItem(REGISTER_KEY)
  return saved ? Number.parseInt(saved) : null
}

export function setDeviceRegisterId(id: number) {
  localStorage.setItem(REGISTER_KEY, id.toString())
}

/**
 * Register of this device and its open shift (null when the shift is closed).
 */
export function useRegister() {
  const [registers, setRegisters] = useState<CashRegister[]>([])
  const [registerId, setRegisterId] = useState<number | null>(getDeviceRegisterId())
  const [shift, setShift] = useState<Shift | null>(null)
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`${appUrl}/api/cashregister`)
      if (!response.ok) {
        return
      }
      const list: CashRegister[] = await response.json()
      setRegisters(list)

      let id = getDeviceRegisterId()
      if (!list.some((register) => register.id === id)) {
        id = list.length > 0 ? list[0].id : null
        if (id !== null) {
          setDeviceRegisterId(id)
        }
      }
      setRegisterId(id)

      if (id === null) {
        setShift(null)
        return
      }
      const shiftResponse = await fetch(`${appUrl}/api/shifts/current?cashRegisterId=${id}`)
      setShift(shiftResponse.status === 200 ? await shiftResponse.json() : null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const register = registers.find((r) => r.id === registerId) ?? null

  return { registers, registerId, register, shift, loading, reload }
}
