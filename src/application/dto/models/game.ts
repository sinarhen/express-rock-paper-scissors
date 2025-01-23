import { PlayerWithHiddenChoiceDto } from "./player"
import Player from "@/domain/entities/Player"
import { Round } from "@/domain/entities/Game"

interface BastGameDto<TPlayer> {
  code: string
  player1: TPlayer
  player2: TPlayer
  pastRounds: Round[]
  isRoomFilled: boolean
  canRestart: boolean
}

export type GameProgressDto = BastGameDto<PlayerWithHiddenChoiceDto | null>
export type GameResultsDto = BastGameDto<Player> & {
  winnerName: string | null
}
