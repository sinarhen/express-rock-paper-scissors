import { WebSocket } from "ws"
import { Choice } from "../../domain/types/Game"
import { GameProgressDto, GameResultsDto } from "@/application/dto/models/game"

export interface GameWebSocket extends WebSocket {
  gameCode?: string
  playerName?: string
}

interface JoinGameMessage {
  command: "joinGame"
  data: {
    playerName: string
  }
}

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

export type RequestMessagePayload =
  | JoinGameMessage
  | MakeChoiceMessage
  | RestartGameMessage

export {
  JoinGameMessage,
  MakeChoiceMessage,
  RestartGameMessage,
  GameJoinedResponse,
  GameStartedResponse,
  GameUpdatedResponse,
  CountdownStartedResponse,
  WinnerAnnouncedResponse,
  GameWaitingForRestartResponse,
}
