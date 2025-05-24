"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useSession } from "next-auth/react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface User {
  id: number
  username: string
  avatar?: string | null
}

interface Comment {
  id: number
  content: string
  user: User
  createdAt: string
}

interface Props {
  postId: number
  open: boolean
  onClose: () => void
}

export default function CommentDialog({ postId, open, onClose }: Props) {
  const { data: session } = useSession()
  const token = session?.user.accessToken
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")

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
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts/${postId}/comment`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setNewComment("")
      setComments(prev => [...prev, res.data])
    } catch (err) {
      console.error("Erreur création commentaire", err)
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
          {comments.map(comment => (
            <div key={comment.id} className="flex items-start gap-3">
              <img
                src={comment.user.avatar || "/placeholder.svg?text=U"}
                alt={comment.user.username}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <div className="font-medium">{comment.user.username}</div>
                <p className="text-sm">{comment.content}</p>
              </div>
            </div>
          ))}
          {!comments.length && <p className="text-muted-foreground text-sm">Aucun commentaire pour l’instant.</p>}
        </div>

        <div className="space-y-2 pt-2">
          <Textarea
            placeholder="Ajouter un commentaire…"
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
          />
          <Button onClick={handleComment} disabled={!newComment.trim()}>
            Commenter
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
