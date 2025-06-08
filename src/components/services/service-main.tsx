"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import CreateServiceForm from "@/components/services/create-service"
import ServiceList from "@/components/services/service-list"

export default function ServiceMain() {
  const [open, setOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleCreated = () => {
    setOpen(false)
    setRefreshKey((k) => k + 1)
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Services disponibles</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>+ Proposer un service</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Proposer un service</DialogTitle>
            </DialogHeader>
            <CreateServiceForm onCreated={handleCreated} />
          </DialogContent>
        </Dialog>
      </div>
      <ServiceList key={refreshKey} />
    </div>
  )
}
