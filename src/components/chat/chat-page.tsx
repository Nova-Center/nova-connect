import ChatInterface from "@/components/chat/chat-interface"
import Link from "next/link"
import { ArrowLeft, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/">
              <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                <ArrowLeft className="h-4 w-4" />
                Retour à l'accueil
              </Button>
            </Link>
            <div className="h-6 w-px bg-gray-300"></div>
            <nav className="flex items-center gap-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-gray-700 flex items-center gap-1">
                <Home className="h-4 w-4" />
                Accueil
              </Link>
              <span>•</span>
              <span className="text-gray-900 font-medium">Messages</span>
            </nav>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages Nova Connect</h1>
          <p className="text-gray-600">Restez connecté avec votre communauté</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ChatInterface />
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border">
              <h3 className="font-semibold text-gray-900 mb-3">Statut de connexion</h3>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Connecté à l'API</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg p-4 text-white">
              <h3 className="font-semibold mb-2">Nova Connect Premium</h3>
              <p className="text-sm text-purple-100 mb-3">Débloquez des fonctionnalités avancées pour votre chat</p>
              <button className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-md text-sm transition-colors">
                En savoir plus
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
