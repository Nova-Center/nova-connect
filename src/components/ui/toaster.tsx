"use client"

import { useToast } from "@/hooks/use-toast"
import { X } from "lucide-react"
import { useEffect, useState } from "react"

export function Toaster() {
  const { toasts, dismiss } = useToast()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            flex flex-col p-4 rounded-lg shadow-lg min-w-[300px] animate-in slide-in-from-right
            ${toast.variant === "destructive" ? "bg-red-500 text-white" : "bg-green-500 text-white"}
          `}
        >
          <div className="flex items-center justify-between">
            {toast.title && <h4 className="font-medium">{toast.title}</h4>}
            <button onClick={() => dismiss(toast.id)} className="ml-auto hover:opacity-70">
              <X className="h-4 w-4" />
            </button>
          </div>
          {toast.description && <p className="text-sm opacity-90">{toast.description}</p>}
        </div>
      ))}
    </div>
  )
}
