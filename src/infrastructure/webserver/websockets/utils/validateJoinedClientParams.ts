import { GameWebSocket } from "@/infrastructure/types/customWs"
import { IncomingMessage } from "http"

function getGameRoomParams(req: IncomingMessage) {
  const urlParams = new URLSearchParams(req.url?.split("?")[1])
  const gameCode = urlParams.get("gameCode")
  const playerName = urlParams.get("playerName")
  return { gameCode, playerName }
}

export const validateJoinedClientParams = (
  req: IncomingMessage,
  ws: GameWebSocket,
) => {
  const { gameCode, playerName } = getGameRoomParams(req)
  if (!gameCode) {
    ws.close(1008, "Missing game code")
    return
  }
  if (!playerName) {
    ws.close(1008, "Missing player name")
    return
  }

  return { gameCode, playerName }
}
