import { GameMapper } from "@/application/dto/mappers/Game"
import { BaseGameUseCase } from "./BaseGameUseCase"

export class RequestRestartUseCase extends BaseGameUseCase {
  public execute(gameCode: string, playerName: string) {
    const game = this.validateGameExists(gameCode)

    if (!game.isRoomFilled()) {
      throw new Error("Game is not full")
    }

    game.voteRestart(playerName)
    const gameState = this.gameRepository.update(game)
    return GameMapper.toResultsDto(gameState)
  }
}
