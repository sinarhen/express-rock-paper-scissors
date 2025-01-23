import { InMemoryGameRepository } from "@/application/repositories/implementations/InMemoryGameRepository"
import { GameService } from "../services/implementations/GameService"

export default function gameServicesFactory() {
  const gameRepository = new InMemoryGameRepository()
  const gameService = new GameService(gameRepository)
  return {
    gameRepository,
    gameService,
  }
}
