import { Application } from "express"
import http from "http"
import { envs } from "@/config/envs"

export default function serverConfig(app: Application) {
  const server = http.createServer(app)

  app.listen(envs.EXPRESS_PORT, () => {
    console.log("Server running on port", envs.EXPRESS_PORT)
  })

  return server
}
