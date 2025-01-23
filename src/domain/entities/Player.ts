// import { v4 } from "uuid"
import { Choice } from "../types/Game"
import { PlayerStatus, PlayerStatuses } from "../types/Player"

export default class Player {
  // didn't use the id for simplicity. will lookup by name
  public name: string
  public status: PlayerStatus = PlayerStatuses.IN_GAME
  public score = 0
  public choice: Choice | null = null

  constructor(name: string) {
    this.name = name
  }
}
