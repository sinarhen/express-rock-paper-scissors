import {
  GameWebSocket,
  RequestMessagePayload,
} from "@/infrastructure/types/wsMessages"
import { WebSocketServer } from "ws"
import { commandHandlers } from "./handlers"
import { IGameService } from "@/application/services/interfaces/IGameService"

export class GameWebSocketController {
  constructor(private readonly gameService: IGameService) {}

  public registerHandlers(
    wss: WebSocketServer,
    ws: GameWebSocket,
    gameCode: string,
  ) {
    ws.gameCode = gameCode

    const broadcast = (data: unknown) => {
      const jsonData = JSON.stringify(data)
      wss.clients.forEach((client: GameWebSocket) => {
        if (
          client.readyState === WebSocket.OPEN &&
          client.gameCode === ws.gameCode
        ) {
          client.send(jsonData)
        }
      })
    }
    ws.on("message", (rawMessage) =>
      this.handleMessage({ broadcast, ws, message: rawMessage.toString() }),
    )

    ws.on("close", () => {
      if (ws.playerName) {
        this.gameService.disconnectPlayer(gameCode, ws.playerName)
      }
    })
  }

  private handleMessage({
    broadcast,
    ws,
    message,
  }: {
    broadcast: (data: unknown) => void
    ws: GameWebSocket
    message: string
  }) {
    try {
      const { command, data } = JSON.parse(message) as RequestMessagePayload

      const handler = commandHandlers[command]
      if (!handler) {
        ws.send(JSON.stringify({ error: "Unknown command" }))
        return
      }

      handler({
        gameService: this.gameService,
        ws,
        data,
        broadcast,
      } as never)
    } catch (error) {
      this.handleError(ws, error, "Failed to process WebSocket message")
    }
  }

  private handleError(
    ws: GameWebSocket,
    error: unknown,
    defaultMessage: string,
  ) {
    console.error(error)

    const message = error instanceof Error ? error.message : defaultMessage
    ws.send(JSON.stringify({ error: message }))
    ws.close(1011, "Internal server error")
  }
}
