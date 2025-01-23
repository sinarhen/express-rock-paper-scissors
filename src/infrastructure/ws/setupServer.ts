import { WebSocketServer } from "ws"
import { IncomingMessage, Server } from "http"
import { getGameCodeFromRequest } from "@/infrastructure/utils/validateWsParams"
import { IGameService } from "@/application/services/interfaces/IGameService"
import { GameWebSocketController } from "@/presentation/websockets/GameWebSocketController"

export function setupWebSocketServer(
  server: Server,
  deps: {
    gameService: IGameService
  },
) {
  const wss = new WebSocketServer({ noServer: true })

  const controller = new GameWebSocketController(deps.gameService)

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
