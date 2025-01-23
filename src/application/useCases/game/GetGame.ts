import { GameMapper } from "@/application/dto/mappers/Game"
import { BaseGameUseCase } from "./BaseGameUseCase"

export class GetGameUseCase extends BaseGameUseCase {
  public execute(code: string) {
    const game = this.gameRepository.findByCode(code)
    if (!game) {
      throw new Error(`Game with code ${code} not found`)
    }
    return GameMapper.toProgressDto(game)
  }
}
