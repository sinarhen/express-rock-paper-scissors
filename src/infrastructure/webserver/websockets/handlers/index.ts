import { useCasesImplementations } from "@/composition-root"
import { CommandHandlerFunc } from "@/infrastructure/types/commandHandler"
import {
  RequestMessagePayload,
  GameStartedResponse,
  GameUpdatedResponse,
  CountdownStartedResponse,
  WinnerAnnouncedResponse,
  GameWaitingForRestartResponse,
} from "@/infrastructure/types/wsMessages"

export const commandHandlers: {
  [K in RequestMessagePayload["command"]]: CommandHandlerFunc<
    Extract<RequestMessagePayload, { command: K }>
  >
} = {
  makeChoice: ({ ws, data, gameRepository, broadcast }) => {
    if (!ws.playerName || !ws.gameCode) {
      throw new Error("You need to join the game first!")
    }
    const { choice } = data

    const game = useCasesImplementations.game
      .setChoice(gameRepository)
      .execute(ws.gameCode, ws.playerName, choice)

    if (!game.isRoomFilled)
      throw new Error("Wait for the other player, please!")

    broadcast<GameUpdatedResponse>({
      event: "gameUpdated",
      data: game,
    })

    if (game.player1?.hasChosen && game.player2?.hasChosen) {
      const countdownTime = 3

      broadcast<CountdownStartedResponse>({
        event: "countdownStarted",
        seconds: 3,
      })
      setTimeout(() => {
        const game = useCasesImplementations.game
          .completeRound(gameRepository)
          .execute(ws.gameCode!)
        broadcast<WinnerAnnouncedResponse>({
          event: "winnerAnnounced",
          data: game,
        })
      }, countdownTime * 1000)
    }
  },
  restartGame: ({ ws, gameRepository, broadcast }) => {
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
  },
}
