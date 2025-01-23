import { Choice } from "../../domain/types/Game"
import { GameProgressDto, GameResultsDto } from "@/application/dto/models/game"

interface MakeChoiceMessage {
  command: "makeChoice"
  data: {
    choice: Choice
  }
}

interface RestartGameMessage {
  command: "restartGame"
  data: undefined
}

interface GameJoinedResponse {
  event: "gameJoined"
  data: GameProgressDto
}

interface GameStartedResponse {
  event: "gameStarted"
  data: GameProgressDto
}

interface GameUpdatedResponse {
  event: "gameUpdated"
  data: GameProgressDto
}

interface GameWaitingForRestartResponse {
  event: "gameWaitingForRestart"
  data: GameResultsDto
}

interface CountdownStartedResponse {
  event: "countdownStarted"
  seconds: number
}

interface WinnerAnnouncedResponse {
  event: "winnerAnnounced"
  data: GameResultsDto
}

export type ResponseMessagePayload =
  | GameUpdatedResponse
  | GameJoinedResponse
  | GameStartedResponse
  | CountdownStartedResponse
  | WinnerAnnouncedResponse
  | GameWaitingForRestartResponse

export type RequestMessagePayload = MakeChoiceMessage | RestartGameMessage

export {
  MakeChoiceMessage,
  RestartGameMessage,
  GameJoinedResponse,
  GameStartedResponse,
  GameUpdatedResponse,
  CountdownStartedResponse,
  WinnerAnnouncedResponse,
  GameWaitingForRestartResponse,
}
