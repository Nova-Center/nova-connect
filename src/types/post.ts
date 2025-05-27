// src/types/post.ts

export interface User {
  id: number
  name: string
  username: string
  firstName:string
  lastName:string
  avatar?: string | null
}

export interface Comment {
  user: any
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
