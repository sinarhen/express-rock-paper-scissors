import { GameWebSocket } from "@/infrastructure/types/customWs"

export const assignPlayerDataToWsClient = (
  ws: GameWebSocket,
  playerName: string,
  gameCode: string,
) => {
  ws.playerName = playerName
  ws.gameCode = gameCode
}
