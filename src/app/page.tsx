export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Bienvenue sur Nova Connect</h1>
        <p className="text-gray-500 text-lg">Connecte-toi pour continuer</p>

        <a
          href="/auth/login"
          className="text-teal-600 underline hover:text-teal-800"
        >
          Aller au login
        </a>
      </div>
    </main>
  )
}
