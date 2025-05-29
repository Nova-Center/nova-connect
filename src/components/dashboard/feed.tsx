"use client"

import { useState } from "react"
import Image from "next/image"
import { useSession } from "next-auth/react"
import axios from "axios"
import { mutate } from "swr"

import { usePosts } from "@/hooks/usePosts"
import { Post } from "@/types/post"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import CommentDialog from "@/components/posts/CommentDialog"
import {
  Heart,
  MessageCircle,
  Repeat,
  Share,
  MoreHorizontal,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

export function Feed() {
  const { data: session } = useSession()
  const { posts, isLoading, error } = usePosts()
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null)

  const handleDelete = async (postId: number) => {
    if (!session?.user.accessToken) return

    const confirmDelete = confirm("Supprimer ce post ?")
    if (!confirmDelete) return

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts/${postId}`, {
        headers: { Authorization: `Bearer ${session.user.accessToken}` },
      })
      mutate("/api/v1/posts")
    } catch (err) {
      console.error("Erreur suppression :", err)
    }
  }

  if (isLoading) return <p className="p-6 text-center">Chargement…</p>
  if (error) return <p className="p-6 text-center text-red-500">Erreur : {error.message}</p>
  if (!Array.isArray(posts)) return <p className="p-6 text-center text-red-500">Erreur de chargement.</p>
  if (posts.length === 0) return <p className="p-6 text-center">Aucun post pour l’instant.</p>

  return (
    <div className="max-w-3xl mx-auto px-6 py-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Fil d'actualité</h1>
        <p className="text-muted-foreground">Découvrez ce que partagent vos amis</p>
      </header>

      <div className="space-y-6">
        {posts.map((post: Post) => (
          <Card key={post.id} className="overflow-hidden">
            <CardHeader className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={post.user?.avatar || "/placeholder-post.svg"}
                      alt={post.user?.firstName || "Avatar"}
                    />
                    <AvatarFallback>
                      {(post.user?.firstName || "??")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">
                      {post.user?.firstName && post.user?.lastName
                        ? `${post.user.firstName} ${post.user.lastName}`
                        : "Utilisateur inconnu"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      @{post.user?.username || "anonyme"} · {new Date(post.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                {session?.user.id === post.user?.id && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="rounded-full p-1 hover:bg-muted/50">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleDelete(post.id)}
                        className="text-red-600 cursor-pointer"
                      >
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-4 pt-0">
              {typeof post.content === "string" ? (
                <p className="mb-4">{post.content}</p>
              ) : (
                <pre className="text-xs text-muted-foreground bg-muted p-2 rounded mb-4">
                  {JSON.stringify(post.content, null, 2)}
                </pre>
              )}
              {post.image && (
                <div className="rounded-lg overflow-hidden mb-2">
                  <Image
                    src={post.image}
                    alt="Contenu du post"
                    width={600}
                    height={300}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
            </CardContent>

            <Separator />

            <CardFooter className="p-2">
              <div className="flex justify-between w-full">
                <button className="flex items-center gap-2 text-sm hover:bg-muted/50 rounded px-2 py-1">
                  <Heart className="h-4 w-4" /> {typeof post.likes === "number" ? post.likes : 0}
                </button>
                <button
                  className="flex items-center gap-2 text-sm hover:bg-muted/50 rounded px-2 py-1"
                  onClick={() => setSelectedPostId(post.id)}
                >
                  <MessageCircle className="h-4 w-4" /> {post.comments?.length || 0}
                </button>
                <button className="flex items-center gap-2 text-sm hover:bg-muted/50 rounded px-2 py-1">
                  <Repeat className="h-4 w-4" /> 0
                </button>
                <button className="hover:bg-muted/50 rounded p-1">
                  <Share className="h-4 w-4" />
                </button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {selectedPostId && (
        <CommentDialog
          postId={selectedPostId}
          open={!!selectedPostId}
          onClose={() => setSelectedPostId(null)}
        />
      )}
    </div>
  )
}
