import { commandHandlers } from "@/infrastructure/webserver/websockets/handlers"
import { IGameRepository } from "@/application/repositories/interfaces/IGameRepository"
import { useCasesImplementations } from "@/composition-root"
import { GameWebSocketServer } from "@/infrastructure/types/gameWsServer"
import {
  GameWebSocket,
  RequestMessagePayload,
} from "@/infrastructure/types/wsMessages"
import { getGameRoomParams } from "@/infrastructure/webserver/websockets/getWsParams"
import { handleJoin } from "./handlers/join"

const createBroadcaster = ({
  msg,
  wss,
  gameCode,
}: {
  msg: unknown
  wss: GameWebSocketServer
  gameCode: string
}) => {
  console.log(wss.clientRooms.get(gameCode))
  const jsonData = JSON.stringify(msg)
  wss.clientRooms.get(gameCode)?.forEach((client) => {
    if (client?.readyState === 1) {
      client.send(jsonData)
    }
  })
}

export function wsApi(
  wss: GameWebSocketServer,
  deps: { gameRepository: IGameRepository },
) {
  wss.server.on("connection", (ws: GameWebSocket, req) => {
    try {
      const { gameCode, playerName } = getGameRoomParams(req)
      if (!gameCode) {
        ws.close(1008, "Missing game code")
        return
      }
      if (!playerName) {
        ws.close(1008, "Missing player name")
        return
      }
      const clientRoom = wss.clientRooms.get(gameCode)

      if (clientRoom && clientRoom[0] && clientRoom[1]) {
        ws.close(1008, "Game room is full")
        return
      }
      if (!clientRoom || !clientRoom[0]) {
        wss.clientRooms.set(gameCode, [ws, undefined])
      } else {
        wss.clientRooms.set(gameCode, [clientRoom[0], ws])
      }

      const broadcast = <TMessage>(msg: TMessage) =>
        createBroadcaster({ msg, wss, gameCode })

      handleJoin({
        gameCode,
        gameRepository: deps.gameRepository,
        playerName,
        broadcast,
      })

      // If join is successful, set player name and game code on the ws object for later use
      ws.playerName = playerName
      ws.gameCode = gameCode

      ws.on("message", (message) => {
        try {
          console.log("Received message:", message.toString())
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
