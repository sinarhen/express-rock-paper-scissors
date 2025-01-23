import {
  GameJoinedResponse,
  GameStartedResponse,
  GameWebSocket,
  RequestMessagePayload,
} from "@/infrastructure/types/wsMessages"
import { WebSocketServer } from "ws"
import { commandHandlers } from "./handlers"
import { getRequiredParamsFromReq } from "@/infrastructure/utils/validateWsParams"
import { IncomingMessage } from "http"
import { IGameRepository } from "@/application/repositories/interfaces/IGameRepository"
import { useCasesImplementations } from "@/composition-root"

export class GameWebSocketController {
  constructor(private readonly gameRepository: IGameRepository) {}

  public registerHandlers(
    wss: WebSocketServer,
    ws: GameWebSocket,
    req: IncomingMessage,
  ) {
    try {
      const { gameCode, playerName } = getRequiredParamsFromReq(req)
      if (!gameCode) {
        ws.close(1008, "Missing game code")
        return
      }
      if (!playerName) {
        ws.close(1008, "Missing player name")
        return
      }

      ws.playerName = playerName
      ws.gameCode = gameCode

      const game = useCasesImplementations.game
        .joinGame(this.gameRepository)
        .execute(playerName, gameCode)

      const broadcast = <TMessage>(data: TMessage) => {
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

      broadcast<GameJoinedResponse>({
        event: "gameJoined",
        data: game,
      })
      if (game.isRoomFilled) {
        broadcast<GameStartedResponse>({
          event: "gameStarted",
          data: game,
        })
      }

      ws.on("message", (rawMessage) =>
        this.handleMessage({ broadcast, ws, message: rawMessage.toString() }),
      )

      ws.on("close", () => {
        if (ws.playerName) {
          useCasesImplementations.game
            .disconnectPlayer(this.gameRepository)
            .execute(gameCode, ws.playerName)
        }
      })
    } catch (error) {
      console.error(error)
      ws.close(
        1008,
        error instanceof Error ? error.message : "Failed to join game",
      )
    }
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
        ws,
        data,
        broadcast,
      } as never)
    } catch (error) {
      console.error(error)

      const message =
        error instanceof Error ? error.message : "Failed to handle message"
      ws.send(JSON.stringify({ error: message }))
    }
  }
}
