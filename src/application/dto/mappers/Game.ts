import Game from "@/domain/entities/Game"
import { playerToHiddenChoiceDto } from "../models/player"
import { GameProgressDto, GameResultsDto } from "../models/game"
import Player from "@/domain/entities/Player"

export class GameMapper {
  public static toProgressDto(game: Game): GameProgressDto {
    return {
      ...this.toBaseDto(game),
      player1: game.player1 ? playerToHiddenChoiceDto(game.player1) : null,
      player2: game.player2 ? playerToHiddenChoiceDto(game.player2) : null,
    }
  }

  public static toResultsDto(game: Game): GameResultsDto {
    if (!game.isRoomFilled()) {
      throw new Error("Game is not full")
    }
    const winner = game.getWinner()
    return {
      ...this.toBaseDto(game),
      player1: { ...game.player1, score: this.getScore(game, game.player1) },
      player2: { ...game.player2, score: this.getScore(game, game.player2) },
      winnerName: winner ? winner.name : null,
    }
  }

  private static toBaseDto(game: Game) {
    return {
      code: game.code,

      pastRounds: game.pastRounds.map((round) => ({
        player1Choice: round.player1Choice,
        player2Choice: round.player2Choice,
        winnerName: round.winnerName,
      })),
      isRoomFilled: game.isRoomFilled(),
      canRestart: game.canRestart(),
    }
  }

  private static getScore(game: Game, player: Player) {
    const winner = game.getWinner()
    return winner && player.name === winner.name
      ? player.score + 1
      : player.score
  }
}
