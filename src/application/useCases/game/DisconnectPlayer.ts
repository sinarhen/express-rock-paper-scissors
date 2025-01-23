import { BaseGameUseCase } from "./BaseGameUseCase"

export class DisconnectPlayerUseCase extends BaseGameUseCase {
  public execute(gameCode: string, playerName: string): void {
    const game = this.validateGameExists(gameCode)

    game.disconnectPlayer(playerName)

    this.gameRepository.update(game)
  }
}
