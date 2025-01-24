import { IGameRepository } from "@/application/repositories/interfaces/IGameRepository"
import { GameWebSocketServer } from "@/infrastructure/types/customWs"
import { GameWebSocket } from "@/infrastructure/types/customWs"
import { createBroadcaster } from "./utils/createBroadcaster"
import { addClientToGameRoom } from "./utils/addToTheGameRoom"
import { assignPlayerDataToWsClient } from "./utils/assignPlayerDataToWsClient"
import { validateJoinedClientParams } from "./utils/validateJoinedClientParams"
import { WebSocketController } from "@/adapters/websockets/WebsocketController"

export function wsApi(
  wss: GameWebSocketServer,
  deps: { gameRepository: IGameRepository },
) {
  wss.server.on("connection", (ws: GameWebSocket, req) => {
    try {
      const params = validateJoinedClientParams(req, ws)
      if (!params) {
        return
      }
      const added = addClientToGameRoom(wss, ws, params.gameCode)
      if (!added) {
        return
      }

      assignPlayerDataToWsClient(ws, params.playerName, params.gameCode)

      const broadcaster = <TMessage>(msg: TMessage) =>
        createBroadcaster({ msg, wss, gameCode: params.gameCode })

      const controller = new WebSocketController(
        deps.gameRepository,
        params,
        broadcaster,
      )

      controller.joinGame()

      ws.on("message", (message) => {
        try {
          controller.handleMessage(message)
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Failed to handle message"
          ws.send(JSON.stringify({ error: message }))
        }
      })

      ws.on("close", () => {
        controller.leaveGame()
      })
    } catch (error) {
      ws.close(
        1008,
        error instanceof Error ? error.message : "Failed to join game",
      )
    }
  })

  wss.server.on("error", (error) => {
    console.error("WebSocket server error:", error)
  })
}
