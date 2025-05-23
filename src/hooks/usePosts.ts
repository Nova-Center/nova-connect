// src/hooks/usePosts.ts
import useSWR, { mutate as globalMutate } from "swr"
import axios from "axios"
import { useSession } from "next-auth/react"
import type { Post } from "@/types/post"

export const API_BASE = process.env.NEXT_PUBLIC_API_URL!
const POSTS_URL = `${API_BASE}/api/v1/posts`

export function usePosts() {
  const { data: session, status } = useSession()
  const token = session?.user.accessToken

  const fetcher = (url: string) =>
    axios
      .get<Post[]>(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.data)

  const shouldFetch = status === "authenticated" && Boolean(token)
  const { data, error, isLoading: swrLoading } = useSWR(
    () => (shouldFetch ? POSTS_URL : null),
    fetcher
  )

  return {
    posts: data ?? ([] as Post[]),
    isLoading: status === "loading" || swrLoading,
    error: error as Error | undefined,
  }
}

export function mutatePosts(newPosts?: Post[]) {
  return globalMutate(POSTS_URL, newPosts, false)
}
