import { GameMapper } from "@/application/dto/mappers/Game"
import { BaseGameUseCase } from "./BaseGameUseCase"

export class CompleteRoundAndAnnounceTheWinnerUseCase extends BaseGameUseCase {
  public execute(gameCode: string) {
    const game = this.validateGameExists(gameCode)

    game.completeRound()
    game.announceWinner()
    const updatedGame = this.gameRepository.update(game)
    return GameMapper.toResultsDto(updatedGame)
  }
}
