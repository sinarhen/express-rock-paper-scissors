import { Application } from "express"
import http, { IncomingMessage } from "http"
import { GameWebSocketController } from "@/presentation/websockets/GameWebSocketController"
import { WebSocketServer } from "ws"
import { getGameCodeFromRequest } from "./utils/validateWsParams"
import { gameService } from "@/composition-root"

export default function serverConfig(app: Application) {
  const server = http.createServer(app)

  const wss = new WebSocketServer({ noServer: true })

  const controller = new GameWebSocketController(gameService)

  server.on("upgrade", (req: IncomingMessage, socket, head) => {
    wss.handleUpgrade(req, socket, head, (ws) => {
      try {
        const gameCode = getGameCodeFromRequest(req)
        if (!gameCode) {
          ws.close(1008, "Missing game code")
          return
        }

        wss.emit("connection", ws, gameCode)
      } catch (error) {
        console.error("WebSocket upgrade error:", error)
        socket.destroy()
      }
    })
  })

  wss.on("connection", (ws, req) => {
    const gameCode = getGameCodeFromRequest(req)
    if (!gameCode) {
      ws.close(1008, "Missing game code")
      return
    }
    controller.registerHandlers(wss, ws, gameCode)
  })

  wss.on("error", (error) => {
    console.error("WebSocket server error:", error)
  })
}
