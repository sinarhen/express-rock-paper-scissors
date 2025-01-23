import { setupWebSocketServer } from "@/infrastructure/ws/setupServer"
import { Application } from "express"
import http from "http"
import { IGameService } from "@/application/services/interfaces/IGameService"
import routes from "./routes"

export default function serverConfig(
  app: Application,
  deps: { gameService: IGameService },
) {
  const server = http.createServer(app)

  setupWebSocketServer(server, deps)

  routes(app, deps)
}
