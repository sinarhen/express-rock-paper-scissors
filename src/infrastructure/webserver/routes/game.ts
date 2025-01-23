import express from "express"
import { gameService } from "@/composition-root"
import { GameController } from "@/adapters/controllers/GameController"

export default function gameRouter() {
  const router = express.Router()

  // inject game service dependency
  const controller = new GameController(gameService)

  // POST enpdpoints
  router.route("/create").post(controller.createGame)

  return router
}
