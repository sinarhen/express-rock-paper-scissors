import { Choice } from "@/domain/types/Game"
import { IGameRepository } from "@/application/repositories/interfaces/IGameRepository"
import generateSixCharCode from "../../utils/sixDigitCode"
import Game from "@/domain/entities/Game"
import Player from "@/domain/entities/Player"
import { GameMapper } from "@/infrastructure/dto/mappers/Game"
import { IGameService } from "../interfaces/IGameService"

export class GameService implements IGameService {
  constructor(private readonly gameRepository: IGameRepository) {}

  public getGame(code: string) {
    const game = this.gameRepository.findByCode(code)
    if (!game) {
      throw new Error(`Game with code ${code} not found`)
    }
    return GameMapper.toProgressDto(game)
  }

  public createGame(): string {
    const code = generateSixCharCode()
    const game = new Game(code)
    this.gameRepository.create(game)
    return code
  }

  public joinGame(playerName: string, code: string) {
    const game = this.validateGameExists(code)

    const player = new Player(playerName)

    game.addPlayer(player)
    const updatedGame = this.gameRepository.update(game)
    return GameMapper.toProgressDto(updatedGame)
  }

  public setChoice(gameCode: string, playerName: string, choice: Choice) {
    const game = this.validateGameExists(gameCode)

    game.setChoice(playerName, choice)
    const updatedGame = this.gameRepository.update(game)
    return GameMapper.toProgressDto(updatedGame)
  }

  public completeRound(gameCode: string) {
    const game = this.validateGameExists(gameCode)
    game.completeRound()
    const updatedGame = this.gameRepository.update(game)
    return GameMapper.toResultsDto(updatedGame)
  }

  public requestRestart(gameCode: string, playerName: string) {
    const game = this.validateGameExists(gameCode)
    if (!game.isRoomFilled()) {
      throw new Error("Game is not full")
    }
    game.voteRestart(playerName)
    const updatedGame = this.gameRepository.update(game)
    return GameMapper.toResultsDto(updatedGame)
  }

  public disconnectPlayer(gameCode: string, playerName: string): void {
    const game = this.validateGameExists(gameCode)

    game.disconnectPlayer(playerName)
    this.gameRepository.update(game)
  }

  public connectPlayer(gameCode: string, playerName: string) {
    const game = this.validateGameExists(gameCode)
    const newPlayer = new Player(playerName)
    game.addPlayer(newPlayer)
    const updatedGame = this.gameRepository.update(game)
    return GameMapper.toProgressDto(updatedGame)
  }

  private validateGameExists(code: string) {
    const game = this.gameRepository.findByCode(code)
    if (!game) {
      throw new Error(`Game with code ${code} not found`)
    }
    return game
  }
}
