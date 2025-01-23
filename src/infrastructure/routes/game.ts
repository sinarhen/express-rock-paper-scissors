import express from "express"
import { GameController } from "../../presentation/controllers/GameController"
import { IGameService } from "@/application/services/interfaces/IGameService"

export default function gameRouter(deps: { gameService: IGameService }) {
  const router = express.Router()

  const controller = new GameController(deps.gameService)

  // POST enpdpoints
  router.route("/create").post(controller.createGame)

  return router
}
