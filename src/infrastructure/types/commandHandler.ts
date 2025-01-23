import { IGameRepository } from "@/application/repositories/interfaces/IGameRepository"
import { GameWebSocket, RequestMessagePayload } from "./wsMessages"

export interface CommandHandlerDeps {
  ws: GameWebSocket
  gameRepository: IGameRepository
  broadcast: <TMessage>(data: TMessage) => void
  setCurrentPlayerName?: (playerName: string) => void
}

export type CommandHandlerFunc<T extends RequestMessagePayload> = (
  deps: CommandHandlerDeps & { data: T["data"] },
) => void
