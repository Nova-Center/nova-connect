// src/components/dashboard/feed.tsx
"use client"

import Image from "next/image"
import { usePosts } from "@/hooks/usePosts"
import { Post } from "@/types/post"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  Heart,
  MessageCircle,
  Repeat,
  Share,
  MoreHorizontal,
} from "lucide-react"

export function Feed() {
  const { posts, isLoading, error } = usePosts()

  if (isLoading) {
    return <p className="p-6 text-center">Chargement…</p>
  }
  if (error) {
    return <p className="p-6 text-center text-red-500">Erreur : {error.message}</p>
  }
  if (posts.length === 0) {
    return <p className="p-6 text-center">Aucun post pour l’instant.</p>
  }

  return (
    <div className="container mx-auto px-14 py-6">
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
                      src={post.user?.avatar || "/placeholder.svg"}
                      alt={post.user?.name || "Avatar"}
                    />
                    <AvatarFallback>
                      {(post.user?.name || "??")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <div className="font-semibold">{post.user?.name || "Utilisateur inconnu"}</div>
                    <div className="text-xs text-muted-foreground">
                      @{post.user?.username || "anonyme"} ·{" "}
                      {new Date(post.createdAt).toLocaleString()}
                    </div>
                  </div>

                </div>
                <button className="rounded-full p-1 hover:bg-muted/50">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>
            </CardHeader>

            <CardContent className="p-4 pt-0">
              <p className="mb-4">{post.content}</p>
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
                  <Heart className="h-4 w-4" /> {post.likes}
                </button>
                <button className="flex items-center gap-2 text-sm hover:bg-muted/50 rounded px-2 py-1">
                  <MessageCircle className="h-4 w-4" /> {post.comments.length}
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
    </div>
  )
}
