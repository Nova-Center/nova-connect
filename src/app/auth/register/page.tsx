import { RegisterForm } from "@/components/auth/RegisterForm"

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-teal-50 p-4">
      <RegisterForm />
    </main>
  )
}
