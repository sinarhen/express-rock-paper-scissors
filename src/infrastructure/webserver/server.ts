import { Application } from "express"
import http, { IncomingMessage } from "http"
import { GameWebSocketController } from "@/adapters/websockets/GameWebSocketController"
import { WebSocketServer } from "ws"
import { gameService } from "@/composition-root"
import { envs } from "@/config/envs"

export default function serverConfig(app: Application) {
  const server = http.createServer(app)

  const wss = new WebSocketServer({ port: envs.WEBSOCKET_PORT })

  const controller = new GameWebSocketController(gameService)

  server.on("upgrade", (req: IncomingMessage, socket, head) => {
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req)
    })
  })

  wss.on("connection", (ws, req) => {
    controller.registerHandlers(wss, ws, req)
  })

  wss.on("error", (error) => {
    console.error("WebSocket server error:", error)
  })

  app.listen(envs.EXPRESS_PORT, () => {
    console.log("Server running on port 3000")
  })
}
