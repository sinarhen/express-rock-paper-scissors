import Player from "@/domain/entities/Player"
import { PlayerWithHiddenChoiceDto } from "../models/player"

export class PlayerMapper {
  public static toHiddenChoiceDto(player: Player): PlayerWithHiddenChoiceDto {
    return {
      name: player.name,
      status: player.status,
      score: player.score,
      hasChosen: !!player.choice,
    }
  }
}
