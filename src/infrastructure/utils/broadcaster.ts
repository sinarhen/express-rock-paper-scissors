import { WebSocketServer } from "ws"
import { GameWebSocket } from "../types/wsMessages"

export function createBroadcaster(wss: WebSocketServer, gameCode: string) {
  return (data: unknown) => {
    const jsonData = JSON.stringify(data)
    wss.clients.forEach((client: GameWebSocket) => {
      if (
        client.readyState === WebSocket.OPEN &&
        client.gameCode === gameCode
      ) {
        client.send(jsonData)
      }
    })
  }
}
