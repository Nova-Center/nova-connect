"use client"

import { useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon, CheckCircle2, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import axios from "axios"
import Image from "next/image";
import { logger } from "@/lib/logger"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  first_name: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  last_name: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  birth_date: z.date({
    required_error: "Birth date is required.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters.",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, {
      message: "Password must contain at least one number.",
    })
    .regex(/[^A-Za-z0-9]/, {
      message: "Password must contain at least one special character.",
    }),
})

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    },
  })

  const router = useRouter()

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      logger.info("Submitting register form", values)

      const response = await axios.post("http://localhost:3333/api/v1/auth/register", {
        username: values.username,
        firstName: values.first_name,
        lastName: values.last_name,
        birthDate: values.birth_date.toISOString().split("T")[0],
        email: values.email,
        password: values.password,
      })


      logger.info("Register success:", response.data)
      router.push("/auth/login")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error("Axios error:", error.message)
        logger.error("Details:", error.response?.data)
      } else {
        logger.error("Unknown error:", error)
      }

      form.setError("email", {
        message: "Erreur lors de l'inscription. Vérifie tes infos.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }


  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 space-y-6 text-center">
        <div className="flex justify-center">
          <CheckCircle2 className="h-16 w-16 text-teal-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Registration Successful!</h2>
        <p className="text-gray-600">Thank you for registering. You can now log in to your account.</p>
        <Button className="w-full">Go to Login</Button>
      </div>
    )
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

          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-500 text-sm">Join our community and start sharing with friends</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Madox" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Frédéric" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Sananes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="birth_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Birth Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="salah@esgi.com" {...field} />
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
                  <FormDescription className="text-xs">
                    Must be at least 8 characters with uppercase, lowercase, number and special character
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-rose-500 to-teal-500 hover:from-rose-600 hover:to-teal-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="http://localhost:3000/auth/login" className="font-medium text-teal-600 hover:text-teal-500">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
