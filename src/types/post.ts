// src/types/post.ts

export interface User {
  id: number
  name: string
  username: string
  avatar?: string | null
}

export interface Comment {
  id: number
  content: string
  userId: number
  postId: number
  createdAt: string
}

export interface Post {
  id: number
  content: string
  image: string | null
  likes: number
  createdAt: string
  user: User
  comments: Comment[]
}
