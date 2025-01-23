import Player from "@/domain/entities/Player"

// We use this to hide the choice of the player
// until the results are shown
export type PlayerWithHiddenChoiceDto = Omit<Player, "choice"> & {
  hasChosen: boolean
}
