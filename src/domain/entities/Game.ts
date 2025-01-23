import { Choice } from "../types/Game"
import { PlayerStatuses } from "../types/Player"
import Player from "./Player"

export type Round = {
  player1Choice: Choice
  player2Choice: Choice
  winnerName: string | null
}
export default class Game {
  public player1: Player | null = null
  public player2: Player | null = null

  public pastRounds: Round[] = []

  constructor(public readonly code: string) {}

  public isRoomFilled(): this is { player1: Player; player2: Player } {
    return (
      !!this.player1 &&
      !!this.player2 &&
      this.player1.status !== PlayerStatuses.OUT_OF_GAME &&
      this.player2.status !== PlayerStatuses.OUT_OF_GAME
    )
  }

  public areChoicesMade(): this is {
    player1: Player & { choice: Choice }
    player2: Player & { choice: Choice }
  } {
    return (
      this.isRoomFilled() &&
      this.player1.choice !== null &&
      this.player2.choice !== null
    )
  }

  public canRestart(): boolean {
    return (
      this.isRoomFilled() &&
      this.player1!.status === PlayerStatuses.REQUESTED_A_REMATCH &&
      this.player2!.status === PlayerStatuses.REQUESTED_A_REMATCH
    )
  }

  public addPlayer(player: Player): void {
    if (this.isRoomFilled()) {
      throw new Error("Game is full")
    }
    if (!this.player1) {
      this.player1 = player
    } else {
      this.player2 = player
    }
  }
  public disconnectPlayer(playerName: string): void {
    const player = this.findPlayerByName(playerName)
    if (!player) {
      throw new Error("Player not found")
    }
    player.status = PlayerStatuses.OUT_OF_GAME
  }

  public voteRestart(playerName: string): boolean {
    const player = this.findPlayerByName(playerName)
    if (!player) {
      throw new Error("Player not found")
    }

    player.status = PlayerStatuses.REQUESTED_A_REMATCH

    return this.canRestart()
  }

  public resetGame(): void {
    if (!this.isRoomFilled()) return
    this.resetPlayers()
  }

  private resetPlayers(): void {
    if (this.player1) {
      this.player1.choice = null
      this.player1.status = PlayerStatuses.IN_GAME
    }
    if (this.player2) {
      this.player2.choice = null
      this.player2.status = PlayerStatuses.IN_GAME
    }
  }

  public completeRound(): void {
    if (!this.areChoicesMade()) {
      console.dir(this, { depth: null })
      throw new Error("Both players must make a choice to complete a round")
    }
    const winner = this.getWinner()
    this.pastRounds.push({
      player1Choice: this.player1.choice,
      player2Choice: this.player2.choice,
      winnerName: winner?.name ?? null,
    })
    this.resetGame()
  }

  public getWinner(): Player | null {
    if (!this.areChoicesMade()) {
      throw new Error("Both players must make a choice to determine a winner")
    }

    if (this.player1.choice === this.player2.choice) {
      return null // It's a draw
    }

    const player1Won =
      this.player1.choice === Game.winningRules[this.player2.choice]
    if (player1Won) {
      this.player1.score += 1
      return this.player1
    } else {
      this.player2.score += 1
      return this.player2
    }
  }

  public setChoice(playerName: string, choice: Choice): void {
    if (!this.isRoomFilled()) {
      throw new Error("Both players must join before making a choice")
    }

    const player = this.findPlayerByName(playerName)
    if (!player) {
      throw new Error("Player not found")
    }

    if (this.player1?.choice && this.player2?.choice) {
      throw new Error(`Opponent already made a choice. You can't change it now`)
    }

    player.choice = choice
  }

  private findPlayerByName(playerName: string): Player | null {
    if (this.player1?.name === playerName) {
      return this.player1
    }
    if (this.player2?.name === playerName) {
      return this.player2
    }
    return null
  }

  private static winningRules: Record<Choice, Choice> = {
    rock: "scissors",
    paper: "rock",
    scissors: "paper",
  }
}
