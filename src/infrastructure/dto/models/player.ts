import Player from "@/domain/entities/Player"

export type PlayerWithHiddenChoiceDto = Omit<Player, "choice"> & {
  hasChosen: boolean
}
export type PlayerWithExposedChoiceDto = Player

export function playerToHiddenChoiceDto(
  player: Player,
): PlayerWithHiddenChoiceDto {
  return {
    name: player.name,
    status: player.status,
    score: player.score,
    hasChosen: !!player.choice,
  }
}
