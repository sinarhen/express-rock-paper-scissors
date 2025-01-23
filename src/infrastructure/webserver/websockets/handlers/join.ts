import { IGameRepository } from "@/application/repositories/interfaces/IGameRepository"
import { useCasesImplementations } from "@/composition-root"
import {
  GameJoinedResponse,
  GameStartedResponse,
} from "@/infrastructure/types/wsMessages"

export function handleJoin({
  gameCode,
  gameRepository,
  playerName,
  broadcast,
}: {
  gameRepository: IGameRepository
  broadcast: <TMessage>(data: TMessage) => void
  gameCode: string
  playerName: string
}) {
  const game = useCasesImplementations.game
    .joinGame(gameRepository)
    .execute(playerName, gameCode)

  broadcast<GameJoinedResponse>({
    event: "gameJoined",
    data: game,
  })
  if (game.isRoomFilled) {
    broadcast<GameStartedResponse>({
      event: "gameStarted",
      data: game,
    })
  }
}
