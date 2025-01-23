import generateSixCharCode from "../../utils/sixDigitCode"
import Game from "@/domain/entities/Game"
import { BaseGameUseCase } from "./BaseGameUseCase"

export class CreateGameUseCase extends BaseGameUseCase {
  public execute(): string {
    const code = generateSixCharCode()
    const game = new Game(code)
    this.gameRepository.create(game)
    return code
  }
}
