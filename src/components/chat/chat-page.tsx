import ChatInterface from "@/components/chat/chat-interface"

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages Nova Connect</h1>
          <p className="text-gray-600">Restez connecté avec votre communauté</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ChatInterface />
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border">
              <h3 className="font-semibold text-gray-900 mb-3">Membres actifs</h3>
              <div className="space-y-2">
                {[
                  { name: "Barry Keoghan", status: "En ligne", avatar: "/placeholder.svg?height=32&width=32" },
                  { name: "margot_robbie", status: "Il y a 5 min", avatar: "/placeholder.svg?height=32&width=32" },
                  { name: "robert_pattinson", status: "Il y a 1h", avatar: "/placeholder.svg?height=32&width=32" },
                ].map((member, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="relative">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {member.name.charAt(0)}
                      </div>
                      {index === 0 && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.status}</p>
                    </div>
                  </div>
                ))}
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
