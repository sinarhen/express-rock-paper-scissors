import Player from "@/domain/entities/Player"
import { GameMapper } from "@/application/dto/mappers/Game"
import { BaseGameUseCase } from "./BaseGameUseCase"

export class JoinGameUseCase extends BaseGameUseCase {
  public execute(playerName: string, code: string) {
    const game = this.validateGameExists(code)

    const player = new Player(playerName)
    game.addPlayer(player)

    const updatedGame = this.gameRepository.update(game)
    return GameMapper.toProgressDto(updatedGame)
  }
}
