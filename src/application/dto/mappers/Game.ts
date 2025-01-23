import Game from "@/domain/entities/Game"
import { playerToHiddenChoiceDto } from "../models/player"
import { GameProgressDto, GameResultsDto } from "../models/game"

export class GameMapper {
  public static toProgressDto(game: Game): GameProgressDto {
    return {
      ...this.toBaseDto(game),
      player1: game.player1 ? playerToHiddenChoiceDto(game.player1) : null,
      player2: game.player2 ? playerToHiddenChoiceDto(game.player2) : null,
    }
  }
  public static toResultsDto(game: Game): GameResultsDto {
    const winner = game.getWinner()

    return {
      ...this.toBaseDto(game),
      player1: game.player1!,
      player2: game.player2!,
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
}
