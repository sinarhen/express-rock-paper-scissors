import { GameWebSocketServer } from "@/infrastructure/types/gameWsServer"
import { GameWebSocket } from "@/infrastructure/types/wsMessages"

export const addClientToGameRoom = (
  wss: GameWebSocketServer,
  ws: GameWebSocket,
  gameCode: string,
) => {
  const clientRoom = wss.clientRooms.get(gameCode)

  if (clientRoom && clientRoom[0] && clientRoom[1]) {
    ws.close(1008, "Game room is full")
    return false
  }
  if (!clientRoom || !clientRoom[0]) {
    wss.clientRooms.set(gameCode, [ws, undefined])
  } else {
    wss.clientRooms.set(gameCode, [clientRoom[0], ws])
  }

  return true
}
