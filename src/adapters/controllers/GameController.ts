import { IGameRepository } from "@/application/repositories/interfaces/IGameRepository"
import { useCasesImplementations } from "@/composition-root"
import { Request, Response } from "express"

export class GameController {
  constructor(private readonly gameRepository: IGameRepository) {}

  public createGame = (req: Request, res: Response) => {
    try {
      const { playerName } = req.body
      if (!playerName) {
        res.status(400).json({ error: "Missing player name" })
        return
      }

      const gameCode = useCasesImplementations.game
        .createGame(this.gameRepository)
        .execute()
        
      res.status(201).json({
        code: gameCode,
      })
    } catch (error) {
      res.status(500).json({ error: (error as Error).message })
    }
  }
}
