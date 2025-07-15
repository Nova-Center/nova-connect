"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import ChatInterface from "./chat-interface"
import { Home, MessageSquare } from "lucide-react"

export default function ChatPage() {
  const { otherUserId } = useParams()

  return (
    <div className="h-full flex flex-col max-w-full">
      {/* Navigation breadcrumb */}
      <div className="mb-4 flex-shrink-0">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-foreground transition-colors duration-200 px-2 py-1 rounded-md hover:bg-muted/50"
          >
            <Home className="h-4 w-4" />
            Accueil
          </Link>
          <span className="text-muted-foreground/50">•</span>
          <div className="flex items-center gap-1 font-medium text-foreground">
            <MessageSquare className="h-4 w-4" />
            <span>Chat avec {otherUserId}</span>
          </div>
        </nav>
      </div>

      {/* Titre de la conversation */}
      <div className="mb-4 flex-shrink-0">
        <h1 className="text-2xl font-bold text-foreground mb-1">
          Conversation avec{" "}
          <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
            {otherUserId}
          </span>
        </h1>
        <p className="text-sm text-muted-foreground">Discutez en temps réel avec votre contact</p>
      </div>

      {/* Interface de chat - prend l'espace restant et centré */}
      <div className="flex-1 min-h-0 flex justify-center">
        <div className="w-full max-w-3xl">
          <ChatInterface />
        </div>
      </div>
    </div>
  )
}
