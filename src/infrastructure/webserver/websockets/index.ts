import { GameWebSocketController } from "@/adapters/websockets/GameWebSocketController"
import { IGameRepository } from "@/application/repositories/interfaces/IGameRepository"
import { WebSocketServer } from "ws"

export function wsApi(
  wss: WebSocketServer,
  deps: { gameRepository: IGameRepository },
) {
  const controller = new GameWebSocketController(deps.gameRepository)

  wss.on("connection", (ws, req) => {
    controller.registerHandlers(wss, ws, req)
  })

  wss.on("error", (error) => {
    console.error("WebSocket server error:", error)
  })
}
