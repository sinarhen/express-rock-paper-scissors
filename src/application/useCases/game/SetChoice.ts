import { GameMapper } from "@/application/dto/mappers/Game"
import { Choice } from "@/domain/types/Game"
import { BaseGameUseCase } from "./BaseGameUseCase"

export class SetChoiceUseCase extends BaseGameUseCase {
  public execute(gameCode: string, playerName: string, choice: Choice) {
    const game = this.validateGameExists(gameCode)

    game.setChoice(playerName, choice)

    const updatedGame = this.gameRepository.update(game)
    return GameMapper.toProgressDto(updatedGame)
  }
}
