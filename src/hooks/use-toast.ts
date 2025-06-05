"use client"

import { useState, useCallback } from "react"

type ToastType = "success" | "error" | "info"

interface Toast {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

let toastId = 0

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback(
    ({
      title,
      description,
      variant = "default",
    }: { title?: string; description?: string; variant?: "default" | "destructive" }) => {
      const id = (++toastId).toString()
      const newToast = { id, title, description, variant }

      setToasts((prev) => [...prev, newToast])

      // Auto-remove after 3 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
      }, 3000)

      return id
    },
    [],
  )

  const dismiss = useCallback((id?: string) => {
    setToasts((prev) => (id ? prev.filter((toast) => toast.id !== id) : []))
  }, [])

  return {
    toasts,
    toast,
    dismiss,
  }
}

// Export a simple toast function for direct use
export const toast = ({
  title,
  description,
  variant,
}: { title?: string; description?: string; variant?: "default" | "destructive" }) => {
  // Create a toast element
  const toastElement = document.createElement("div")
  toastElement.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg min-w-[300px] ${
    variant === "destructive" ? "bg-red-500 text-white" : "bg-green-500 text-white"
  }`

  // Create content
  const content = document.createElement("div")

  if (title) {
    const titleElement = document.createElement("h4")
    titleElement.className = "font-medium"
    titleElement.textContent = title
    content.appendChild(titleElement)
  }

  if (description) {
    const descElement = document.createElement("p")
    descElement.className = "text-sm opacity-90"
    descElement.textContent = description
    content.appendChild(descElement)
  }

  toastElement.appendChild(content)

  // Add to DOM
  document.body.appendChild(toastElement)

  // Remove after 3 seconds
  setTimeout(() => {
    if (document.body.contains(toastElement)) {
      document.body.removeChild(toastElement)
    }
  }, 3000)
}
