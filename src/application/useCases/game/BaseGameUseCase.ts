import { IGameRepository } from "@/application/repositories/interfaces/IGameRepository"

export abstract class BaseGameUseCase {
  constructor(protected gameRepository: IGameRepository) {}

  protected validateGameExists(code: string) {
    const game = this.gameRepository.findByCode(code)
    if (!game) {
      throw new Error(`Game with code ${code} not found`)
    }
    return game
  }

  abstract execute(...args: Array<unknown>): unknown
}
