/// <reference types="next-auth" />

import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: number
      email: string
      accessToken: string
      refreshToken: string
    }
  }

  interface User {
    id: number
    email: string
    accessToken: string
    refreshToken: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number
    email: string
    accessToken: string
    refreshToken: string
  }
}
