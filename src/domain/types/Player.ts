export const PlayerStatuses = {
  OUT_OF_GAME: "Out of game",
  IN_GAME: "In game",
  REQUESTED_A_REMATCH: "Requested a rematch",
} as const

export type PlayerStatus = (typeof PlayerStatuses)[keyof typeof PlayerStatuses]
