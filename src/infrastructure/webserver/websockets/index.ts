import { commandHandlers } from "@/infrastructure/webserver/websockets/handlers"
import { IGameRepository } from "@/application/repositories/interfaces/IGameRepository"
import { useCasesImplementations } from "@/composition-root"
import { GameWebSocketServer } from "@/infrastructure/types/customWs"
import {
  GameJoinedResponse,
  GameStartedResponse,
  RequestMessagePayload,
} from "@/infrastructure/types/wsMessage"
import { GameWebSocket } from "@/infrastructure/types/customWs"
import { createBroadcaster } from "./utils/createBroadcaster"
import { addClientToGameRoom } from "./utils/addToTheGameRoom"
import { assignPlayerDataToWsClient } from "./utils/assignPlayerDataToWsClient"
import { validateJoinedClientParams } from "./utils/validateJoinedClientParams"

export function wsApi(
  wss: GameWebSocketServer,
  deps: { gameRepository: IGameRepository },
) {
  wss.server.on("connection", (ws: GameWebSocket, req) => {
    try {
      const validated = validateJoinedClientParams(req, ws)
      if (!validated) {
        return
      }
      const { gameCode, playerName } = validated

      const added = addClientToGameRoom(wss, ws, gameCode)
      if (!added) {
        return
      }

      // Assign player data to the ws client
      assignPlayerDataToWsClient(ws, playerName, gameCode)

      // Broadcast to all clients in the room
      const broadcast = <TMessage>(msg: TMessage) =>
        createBroadcaster({ msg, wss, gameCode })

      // Join to the game / If the room is full, start the game
      const game = useCasesImplementations.game
        .joinGame(deps.gameRepository)
        .execute(playerName, gameCode)

      broadcast<GameJoinedResponse>({
        event: "gameJoined",
        data: game,
      })

      if (game.isRoomFilled) {
        useCasesImplementations.game
          .startGame(deps.gameRepository)
          .execute(gameCode)

        broadcast<GameStartedResponse>({
          event: "gameStarted",
          data: game,
        })
      }

      ws.on("message", (message) => {
        try {
          const { command, data } = JSON.parse(
            message.toString(),
          ) as RequestMessagePayload

          switch (command) {
            case "makeChoice":
              commandHandlers.makeChoice({
                ws,
                data,
                gameRepository: deps.gameRepository,
                broadcast,
              })
              break
            case "restartGame":
              commandHandlers.restartGame({
                ws,
                gameRepository: deps.gameRepository,
                broadcast,
                data,
              })
              break
            default:
              throw new Error(`Unknown command: ${command}`)
          }
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Failed to handle message"
          ws.send(JSON.stringify({ error: message }))
        }
      })

      ws.on("close", () => {
        if (ws.playerName) {
          useCasesImplementations.game
            .disconnectPlayer(deps.gameRepository)
            .execute(gameCode, ws.playerName)
        }
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
