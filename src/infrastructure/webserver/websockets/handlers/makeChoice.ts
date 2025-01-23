import { useCasesImplementations } from "@/composition-root"
import { GameStatuses } from "@/domain/types/Game"
import { CommandHandlerFunc } from "@/infrastructure/types/commandHandler"
import {
  CountdownStartedResponse,
  GameUpdatedResponse,
  MakeChoiceMessage,
  WinnerAnnouncedResponse,
} from "@/infrastructure/types/wsMessage"

export const makeChoice: CommandHandlerFunc<MakeChoiceMessage> = ({
  ws,
  data,
  gameRepository,
  broadcast,
}) => {
  if (!ws.playerName || !ws.gameCode) {
    throw new Error("You need to join the game first!")
  }
  const { choice } = data

  const game = useCasesImplementations.game
    .setChoice(gameRepository)
    .execute(ws.gameCode, ws.playerName, choice)

  if (!game.isRoomFilled) throw new Error("Wait for the other player, please!")

  if (game.status !== GameStatuses.WAITING_FOR_CHOICES) {
    throw new Error("You cannot make choice now!")
  }

  broadcast<GameUpdatedResponse>({
    event: "gameUpdated",
    data: game,
  })

  if (game.player1?.hasChosen && game.player2?.hasChosen) {
    const countdownTime = 3

    useCasesImplementations.game
      .startCountdown(gameRepository)
      .execute(ws.gameCode)

    broadcast<CountdownStartedResponse>({
      event: "countdownStarted",
      seconds: 3,
    })

    setTimeout(() => {
      const game = useCasesImplementations.game
        .completeRoundAndAnnounceTheWinner(gameRepository)
        .execute(ws.gameCode!)
      broadcast<WinnerAnnouncedResponse>({
        event: "winnerAnnounced",
        data: game,
      })
    }, countdownTime * 1000)
  }
}
