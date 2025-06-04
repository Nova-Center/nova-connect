export interface Notification {
  id: string
  type: "like" | "comment" | "friend" | "event" | "system"
  title: string
  message: string
  time: string
  read: boolean
  avatar?: string
  userName?: string
}
