"use client"
import { Comment, User, Props } from "@/types/comment"
import { useEffect, useState } from "react"
import axios from "axios"
import { useSession } from "next-auth/react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"


export default function CommentDialog({ postId, open, onClose }: Props) {
  const { data: session } = useSession()
  const token = session?.user.accessToken
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(false)

  const fetchComments = async () => {
    if (!token) return
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setComments(res.data.comments || [])
    } catch (err) {
      console.error("Erreur chargement commentaires", err)
    }
  }

  const handleComment = async () => {
    if (!newComment.trim() || !token) return
    setLoading(true)

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts/${postId}/comments`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setNewComment("")
      fetchComments() // Refetch complet avec utilisateur
    } catch (err) {
      console.error("Erreur création commentaire", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) fetchComments()
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Commentaires</DialogTitle>
        </DialogHeader>

        <div className="max-h-64 overflow-y-auto space-y-4 mt-2">
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-3">
              <img
                src={
                  comment.user?.avatar ??
                  `/placeholder-post.svg?height=32&width=32&text=${comment.user?.username?.[0] ?? "U"}`
                }
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <div className="font-medium text-sm text-foreground">
                  {comment.user.username}
                </div>
                <p className="text-sm text-foreground">{comment.content}</p>
              </div>
            </div>
          ))}

          {!comments.length && (
            <p className="text-muted-foreground text-sm">
              Aucun commentaire pour l’instant.
            </p>
          )}
        </div>

        <div className="space-y-2 pt-2">
          <Textarea
            placeholder="Ajouter un commentaire…"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="text-foreground"
          />
          <Button onClick={handleComment} disabled={!newComment.trim() || loading}>
            {loading ? "Envoi..." : "Commenter"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
