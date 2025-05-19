import { Logger } from "tslog"

export const logger = new Logger({
  name: "nova-frontend",
  type: "pretty",
  minLevel: 0,
})
