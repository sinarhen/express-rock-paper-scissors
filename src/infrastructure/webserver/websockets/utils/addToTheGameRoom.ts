import { GameWebSocketServer } from "@/infrastructure/types/customWs"
import { GameWebSocket } from "@/infrastructure/types/customWs"

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
    console.log("Setting player 1", ws.gameCode)
    wss.clientRooms.set(gameCode, [ws, undefined])
  } else {
    wss.clientRooms.set(gameCode, [clientRoom[0], ws])
  }
  const updatedClientRoom = wss.clientRooms.get(gameCode)
  console.log(updatedClientRoom?.[0], updatedClientRoom?.[1])

  return true
}
