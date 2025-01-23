import { Choice } from "@/domain/types/Game"
import { PlayerWithHiddenChoiceDto } from "./player"
import Player from "@/domain/entities/Player"

interface BastGameDto<TPlayer> {
  code: string
  player1: TPlayer
  player2: TPlayer
  pastRounds: {
    player1Choice: Choice
    player2Choice: Choice
    winnerName: string | null
  }[]
  isRoomFilled: boolean
  canRestart: boolean
}

export type GameProgressDto = BastGameDto<PlayerWithHiddenChoiceDto | null>
export type GameResultsDto = BastGameDto<Player> & {
  winnerName: string | null
}
