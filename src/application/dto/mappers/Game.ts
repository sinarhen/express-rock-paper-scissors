import Game from "@/domain/entities/Game"
import { GameProgressDto, GameResultsDto } from "../models/game"
import { PlayerMapper } from "./Player"

export class GameMapper {
  public static toProgressDto(game: Game): GameProgressDto {
    return {
      ...this.toBaseDto(game),
      player1: game.player1
        ? PlayerMapper.toHiddenChoiceDto(game.player1)
        : null,
      player2: game.player2
        ? PlayerMapper.toHiddenChoiceDto(game.player2)
        : null,
    }
  }

  public static toResultsDto(game: Game): GameResultsDto {
    if (!game.isRoomFilled()) {
      throw new Error("Game is not full")
    }
    const winner = game.getWinner()
    return {
      ...this.toBaseDto(game),
      player1: game.player1,
      player2: game.player2,
      winnerName: winner ? winner.name : null,
    }
  }

  private static toBaseDto(game: Game) {
    return {
      code: game.code,
      pastRounds: game.pastRounds.map((round) => ({
        player1: round.player1,
        player2: round.player2,
        winnerName: round.winnerName,
      })),
      isRoomFilled: game.isRoomFilled(),
      status: game.getStatus(),
      canRestart: game.canRestart(),
    }
  }
}
