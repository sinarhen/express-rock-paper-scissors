import { Application } from "express"
import gameRouter from "./game"
import { IGameService } from "@/application/services/interfaces/IGameService"

export default function routes(
  app: Application,
  deps: {
    gameService: IGameService
  },
) {
  app.use("/api/games", gameRouter(deps))
}
