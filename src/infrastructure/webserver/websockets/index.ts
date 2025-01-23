import { GameWebSocketController } from "@/adapters/websockets/GameWebSocketController"
import { envs } from "@/config/envs"
import { WebSocketServer } from "ws"
import { IncomingMessage, Server } from "http"
import { IGameRepository } from "@/application/repositories/interfaces/IGameRepository"

export default function websockets(
  server: Server,
  deps: { gameRepository: IGameRepository },
) {
  const wss = new WebSocketServer({ port: envs.WEBSOCKET_PORT })

  const controller = new GameWebSocketController(deps.gameRepository)

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
}
