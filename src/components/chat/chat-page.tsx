"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import ChatInterface from "./chat-interface"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home } from "lucide-react"

export default function ChatPage() {
  const { otherUserId } = useParams()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="flex items-center gap-1 hover:text-gray-700">
            <Home className="h-4 w-4" /> Accueil
          </Link>
          <span>•</span>
          <span className="font-medium text-gray-900">Chat avec {otherUserId}</span>
        </nav>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Conversation avec <span className="text-violet-600">{otherUserId}</span>
      </h1>

      <ChatInterface />
    </div>
  )
}
