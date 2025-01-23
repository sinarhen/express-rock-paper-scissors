export type Choice = "rock" | "paper" | "scissors"

export const GameStatuses = {
  WAITING_FOR_PLAYERS: "Waiting for players",
  WAITING_FOR_CHOICES: "Waiting for choices",
  COUNTDOWN: "Countdown",
  WINNER_ANNOUNCED: "Winner announced",
} as const

export type GameStatus = (typeof GameStatuses)[keyof typeof GameStatuses]
