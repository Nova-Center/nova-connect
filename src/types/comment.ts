// src/types/comment.ts
export interface User {
  id: number
  username: string
  avatar?: string | null
}

export interface Comment {
  id: number
  content: string
  user: User
  createdAt: string
}

export interface Props {
  postId: number
  open: boolean
  onClose: () => void
}
