import { GameMapper } from "@/application/dto/mappers/Game"
import { BaseGameUseCase } from "./BaseGameUseCase"

export class StartGameUseCase extends BaseGameUseCase {
  public execute(gameCode: string) {
    const game = this.validateGameExists(gameCode)

    game.startGame()
    const updatedGame = this.gameRepository.update(game)

    return GameMapper.toProgressDto(updatedGame)
  }
}
