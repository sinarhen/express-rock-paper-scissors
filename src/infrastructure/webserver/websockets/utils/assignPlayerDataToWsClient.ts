import { GameWebSocket } from "@/infrastructure/types/wsMessages"

export const assignPlayerDataToWsClient = (
  ws: GameWebSocket,
  playerName: string,
  gameCode: string,
) => {
  ws.playerName = playerName
  ws.gameCode = gameCode
}
