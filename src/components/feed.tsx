import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Repeat,
  Share,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

const posts = [
  {
    id: 1,
    user: {
      name: "Salahe-eddine Bouhdjeur",
      username: "sbouhdjeur",
      avatar: "/placeholder.svg?height=40&width=40&text=SM",
    },
    content:
      "Le Projet Annuel avance bien ! Merci à tous pour votre travail acharné. Hâte de voir le résultat final.",
    likes: 42,
    comments: 12,
    shares: 5,
    time: "Il y a 2h",
  },
  {
    id: 2,
    user: {
      name: "Mahamadou Gory-Kante",
      username: "mgorykante",
    },
    content:
      "Je passe une bonne année à l'ESGI ! J'ai rencontré des gens formidables et j'apprends beaucoup.",
    likes: 87,
    comments: 23,
    shares: 14,
    time: "Il y a 5h",
  },
];

export function Feed() {
  return (
    <div className="container mx-auto px-14 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Fil d'actualité</h1>
        <p className="text-muted-foreground">
          Découvrez ce que partagent vos amis
        </p>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <Card key={post.id} className="overflow-hidden">
            <CardHeader className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={post.user.avatar || "/placeholder.svg"}
                      alt={post.user.name}
                    />
                    <AvatarFallback>
                      {post.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{post.user.name}</div>
                    <div className="text-xs text-muted-foreground">
                      @{post.user.username} · {post.time}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="mb-4">{post.content}</p>
              <div className="rounded-lg overflow-hidden mb-2">
                <Image
                  width={600}
                  height={300}
                  src={"/placeholder-post.svg"}
                  alt="Post content"
                  className="w-full h-auto object-cover"
                />
              </div>
            </CardContent>
            <Separator />
            <CardFooter className="p-2">
              <div className="flex justify-between w-full">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Heart className="h-4 w-4" />
                  <span>{post.likes}</span>
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.comments}</span>
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Repeat className="h-4 w-4" />
                  <span>{post.shares}</span>
                </Button>
                <Button variant="ghost" size="sm">
                  <Share className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
