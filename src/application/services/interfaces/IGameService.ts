import { Choice } from "@/domain/types/Game"
import { GameProgressDto, GameResultsDto } from "@/application/dto/models/game"

export interface IGameService {
  requestRestart(gameCode: string, playerName: string): GameResultsDto
  joinGame(playerName: string, code: string): GameProgressDto
  createGame(): string
  getGame(code: string): GameProgressDto
  setChoice(
    gameCode: string,
    playerName: string,
    choice: Choice,
  ): GameProgressDto
  completeRound(gameCode: string): GameResultsDto
  disconnectPlayer(gameCode: string, playerName: string): void
  connectPlayer(gameCode: string, playerName: string): void
}
