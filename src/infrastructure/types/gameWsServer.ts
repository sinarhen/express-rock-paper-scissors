import { WebSocketServer } from "ws"
import { GameWebSocket } from "./wsMessages"

export interface GameWebSocketServer {
  server: WebSocketServer
  clientRooms: Map<string, [GameWebSocket?, GameWebSocket?]>
}
