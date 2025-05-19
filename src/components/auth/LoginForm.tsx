"use client"

import { useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"


const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
})

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
  const router = useRouter()

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    const res = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    })

    if (res?.ok) {
      router.push("/dashboard")
    } else {
      form.setError("email", {
        message: "Email ou mot de passe incorrect",
      })
    }

    setIsSubmitting(false)
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-8 space-y-6">
        <div className="text-center space-y-2">
          <Image
            src="/nova-connect-logo.png"
            alt="Logo"
            width={60}
            height={60}
            className="h-10 w-10 rounded-xl"
          />
          <div className="font-semibold text-xl">Nova Connect</div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 text-sm">Sign in to your account</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="madox@esgi.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type={showPassword ? "text" : "password"} placeholder="••••••••" {...field} />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                        <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-rose-500 to-teal-500 hover:from-rose-600 hover:to-teal-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link href="http://localhost:3000/auth/register" className="font-medium text-teal-600 hover:text-teal-500">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}
