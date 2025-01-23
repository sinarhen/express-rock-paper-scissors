import { envs } from "@/config/envs"
import { WebSocketServer } from "ws"
import { Server, IncomingMessage } from "http"

export function webSocketServerConfig(server: Server) {
  const wss = new WebSocketServer({ port: envs.WEBSOCKET_PORT })

  server.on("upgrade", (req: IncomingMessage, socket, head) => {
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req)
    })
  })
  return wss
}
