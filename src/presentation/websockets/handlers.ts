import { CommandHandlerFunc } from "@/infrastructure/types/commandHandler"
import {
  RequestMessagePayload,
  GameJoinedResponse,
  GameStartedResponse,
  GameUpdatedResponse,
  CountdownStartedResponse,
  WinnerAnnouncedResponse,
  GameWaitingForRestartResponse,
} from "@/infrastructure/types/wsMessages"

export const commandHandlers: {
  [K in RequestMessagePayload["command"]]?: CommandHandlerFunc<
    Extract<RequestMessagePayload, { command: K }>
  >
} = {
  joinGame: ({ gameService, broadcast, data, ws }) => {
    if (ws.playerName) {
      throw new Error("You are already in a game!")
    }
    if (!ws.gameCode) {
      throw new Error("You need to connect to a game first!")
    }
    const game = gameService.joinGame(data.playerName, ws.gameCode)

    ws.playerName = data.playerName

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
  },

  makeChoice: ({ ws, data, gameService, broadcast }) => {
    if (!ws.playerName || !ws.gameCode) {
      throw new Error("You need to join the game first!")
    }
    const { choice } = data
    const game = gameService.setChoice(ws.gameCode, ws.playerName, choice)

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
        try {
          const game = gameService.completeRound(ws.gameCode!)
          broadcast<WinnerAnnouncedResponse>({
            event: "winnerAnnounced",
            data: game,
          })
        } catch (err) {
          console.error("Error in final reveal:", err)
        }
      }, countdownTime * 1000)
    }
  },
  restartGame: ({ ws, gameService, broadcast }) => {
    if (!ws.playerName || !ws.gameCode) {
      throw new Error("You need to join the game first!")
    }
    const requestedRestart = gameService.requestRestart(
      ws.gameCode,
      ws.playerName,
    )

    if (requestedRestart.canRestart) {
      const game = gameService.getGame(ws.gameCode)
      broadcast<GameStartedResponse>({
        event: "gameStarted",
        data: game,
      })
    } else {
      broadcast<GameWaitingForRestartResponse>({
        event: "gameWaitingForRestart",
        data: requestedRestart,
      })
    }
  },
}
