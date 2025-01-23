import express from "express"
import { GameController } from "@/adapters/controllers/GameController"
import { IGameRepository } from "@/application/repositories/interfaces/IGameRepository"

export default function gameRouter(gameRepository: IGameRepository) {
  const router = express.Router()

  const controller = new GameController(gameRepository)

  // POST enpdpoints
  router.route("/create").post(controller.createGame)

  return router
}
