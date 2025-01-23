import { useCasesImplementations } from "@/composition-root"
import { CommandHandlerFunc } from "@/infrastructure/types/commandHandler"
import {
  GameStartedResponse,
  GameWaitingForRestartResponse,
  RestartGameMessage,
} from "@/infrastructure/types/wsMessages"

export const restartGame: CommandHandlerFunc<RestartGameMessage> = ({
  ws,
  gameRepository,
  broadcast,
}) => {
  if (!ws.playerName || !ws.gameCode) {
    throw new Error("You need to join the game first!")
  }
  const gameState = useCasesImplementations.game
    .requestRestart(gameRepository)
    .execute(ws.gameCode, ws.playerName)

  if (gameState.canRestart) {
    const restartedGameState = useCasesImplementations.game
      .confirmRestart(gameRepository)
      .execute(ws.gameCode)

    broadcast<GameStartedResponse>({
      event: "gameStarted",
      data: restartedGameState,
    })
  } else {
    broadcast<GameWaitingForRestartResponse>({
      event: "gameWaitingForRestart",
      data: gameState,
    })
  }
}
