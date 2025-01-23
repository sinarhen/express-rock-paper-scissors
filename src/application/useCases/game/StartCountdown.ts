import { GameMapper } from "@/application/dto/mappers/Game"
import { BaseGameUseCase } from "./BaseGameUseCase"

export class StartCountdownUseCase extends BaseGameUseCase {
  public execute(gameCode: string) {
    const game = this.validateGameExists(gameCode)

    game.startCountdown()
    const updatedGame = this.gameRepository.update(game)

    return GameMapper.toProgressDto(updatedGame)
  }
}
