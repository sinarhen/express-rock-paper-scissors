import { GameMapper } from "@/application/dto/mappers/Game"
import { BaseGameUseCase } from "./BaseGameUseCase"

export class CompleteRoundUseCase extends BaseGameUseCase {
  public execute(gameCode: string) {
    const game = this.validateGameExists(gameCode)

    game.completeRound()

    const updatedGame = this.gameRepository.update(game)
    return GameMapper.toResultsDto(updatedGame)
  }
}
