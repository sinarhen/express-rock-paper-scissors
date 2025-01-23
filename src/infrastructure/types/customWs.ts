import { WebSocketServer } from "ws"
import { WebSocket } from "ws"

export interface GameWebSocketServer {
  server: WebSocketServer
  clientRooms: Map<string, [GameWebSocket?, GameWebSocket?]>
}
export interface GameWebSocket extends WebSocket {
  gameCode?: string
  playerName?: string
}
