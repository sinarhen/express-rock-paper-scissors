import Player from "@/domain/entities/Player"
import { GameMapper } from "@/application/dto/mappers/Game"
import { BaseGameUseCase } from "./BaseGameUseCase"

export class ConnectPlayerUseCase extends BaseGameUseCase {
  public execute(gameCode: string, playerName: string) {
    const game = this.validateGameExists(gameCode)

    const newPlayer = new Player(playerName)

    game.addPlayer(newPlayer)

    const updatedGame = this.gameRepository.update(game)
    return GameMapper.toProgressDto(updatedGame)
  }
}
