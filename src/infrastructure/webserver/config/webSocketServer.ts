import { envs } from "@/config/envs"
import { WebSocketServer } from "ws"
import { Server, IncomingMessage } from "http"
import { GameWebSocketServer } from "@/infrastructure/types/gameWsServer"

export function webSocketServerConfig(server: Server): GameWebSocketServer {
  const wss = new WebSocketServer({ port: envs.WEBSOCKET_PORT })

  server.on("upgrade", (req: IncomingMessage, socket, head) => {
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req)
    })
  })
  return {
    server: wss,
    clientRooms: new Map(),
  }
}
