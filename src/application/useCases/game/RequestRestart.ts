import { BaseGameUseCase } from "./BaseGameUseCase"

export class RequestRestartUseCase extends BaseGameUseCase {
  public execute(gameCode: string, playerName: string) {
    const game = this.validateGameExists(gameCode)

    if (!game.isRoomFilled()) {
      throw new Error("Game is not full")
    }

    const canRestart = game.voteRestart(playerName)

    if (canRestart) {
      game.resetGame()
    }

    this.gameRepository.update(game)
    return canRestart
  }
}
