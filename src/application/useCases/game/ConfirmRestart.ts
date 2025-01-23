import { BaseGameUseCase } from "./BaseGameUseCase"
import { GameMapper } from "@/application/dto/mappers/Game"

export class ConfirmRestartUseCase extends BaseGameUseCase {
  public execute(gameCode: string) {
    this.validateGameExists(gameCode)
    const game = this.gameRepository.findByCode(gameCode)
    if (!game?.canRestart()) {
      throw new Error("Game cannot be restarted")
    }
    game.resetGame()
    const updatedGame = this.gameRepository.update(game)
    return GameMapper.toProgressDto(updatedGame)
  }
}
