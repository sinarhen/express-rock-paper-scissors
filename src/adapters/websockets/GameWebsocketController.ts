import { IGameRepository } from "@/application/repositories/interfaces/IGameRepository"
import { useCasesImplementations } from "@/composition-root"
import { Choice, GameStatuses } from "@/domain/types/Game"
import {
  CountdownStartedResponse,
  GameJoinedResponse,
  GameStartedResponse,
  GameUpdatedResponse,
  GameWaitingForRestartResponse,
  RequestMessagePayload,
  WinnerAnnouncedResponse,
} from "@/infrastructure/types/wsMessage"
import { RawData } from "ws"

export class GameWebSocketController {
  constructor(
    private readonly gameRepository: IGameRepository,
    private readonly params: { gameCode: string; playerName: string },
    private readonly broadcaster: <TMessage>(msg: TMessage) => void,
  ) {}

  public handleMessage = (message: RawData) => {
    const { data, command } = JSON.parse(
      message.toString(),
    ) as RequestMessagePayload

    switch (command) {
      case "makeChoice":
        this.makeChoice(data.choice)
        break
      case "restartGame":
        this.restartGame()
        break
      default:
        throw new Error(`Unknown command: ${command}`)
    }
  }

  public leaveGame() {
    const { gameCode, playerName } = this.params

    useCasesImplementations.game
      .disconnectPlayer(this.gameRepository)
      .execute(gameCode, playerName)
  }

  public joinGame() {
    const { gameCode, playerName } = this.params
    const game = useCasesImplementations.game
      .joinGame(this.gameRepository)
      .execute(playerName, gameCode)

    this.broadcaster<GameJoinedResponse>({
      event: "gameJoined",
      data: game,
    })

    if (game.isRoomFilled) {
      useCasesImplementations.game
        .startGame(this.gameRepository)
        .execute(gameCode)

      this.broadcaster<GameStartedResponse>({
        event: "gameStarted",
        data: game,
      })
    }
  }

  private makeChoice = (choice: Choice) => {
    const { gameCode, playerName } = this.params

    const game = useCasesImplementations.game
      .setChoice(this.gameRepository)
      .execute(gameCode, playerName, choice)

    if (!game.isRoomFilled)
      throw new Error("Wait for the other player, please!")

    if (game.status !== GameStatuses.WAITING_FOR_CHOICES) {
      throw new Error("You cannot make choice now!")
    }

    this.broadcaster<GameUpdatedResponse>({
      event: "gameUpdated",
      data: game,
    })

    if (game.player1?.hasChosen && game.player2?.hasChosen) {
      const countdownTime = 3

      useCasesImplementations.game
        .startCountdown(this.gameRepository)
        .execute(gameCode)

      this.broadcaster<CountdownStartedResponse>({
        event: "countdownStarted",
        seconds: 3,
      })

      setTimeout(() => {
        const game = useCasesImplementations.game
          .completeRoundAndAnnounceTheWinner(this.gameRepository)
          .execute(gameCode)

        this.broadcaster<WinnerAnnouncedResponse>({
          event: "winnerAnnounced",
          data: game,
        })
      }, countdownTime * 1000)
    }
  }
  private restartGame = () => {
    const { gameCode, playerName } = this.params
    const gameState = useCasesImplementations.game
      .requestRestart(this.gameRepository)
      .execute(gameCode, playerName)

    if (gameState.canRestart) {
      const restartedGameState = useCasesImplementations.game
        .confirmRestart(this.gameRepository)
        .execute(gameCode)

      this.broadcaster<GameStartedResponse>({
        event: "gameStarted",
        data: restartedGameState,
      })
    } else {
      this.broadcaster<GameWaitingForRestartResponse>({
        event: "gameWaitingForRestart",
        data: gameState,
      })
    }
  }
}
