import { IGameService } from "@/application/services/interfaces/IGameService"
import { GameWebSocket, RequestMessagePayload } from "./wsMessages"

export interface CommandHandlerDeps {
  ws: GameWebSocket
  gameService: IGameService
  broadcast<T>(msg: T): void
  setCurrentPlayerName?: (playerName: string) => void
}

export type CommandHandlerFunc<T extends RequestMessagePayload> = (
  deps: CommandHandlerDeps & { data: T["data"] },
) => void
