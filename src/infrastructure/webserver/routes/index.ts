import { Application } from "express"
import gameRouter from "./game"
import { IGameRepository } from "@/application/repositories/interfaces/IGameRepository"

export default function api(
  app: Application,
  deps: {
    gameRepository: IGameRepository
  },
) {
  app.use("/api/games", gameRouter(deps.gameRepository))
}
