import { Request, Response } from "express"
import { IGameService } from "@/application/services/interfaces/IGameService"

export class GameController {
  constructor(private gameService: IGameService) {}

  public createGame = (req: Request, res: Response) => {
    try {
      const { playerName } = req.body
      if (!playerName) {
        res.status(400).json({ error: "Missing player name" })
        return
      }

      const gameCode = this.gameService.createGame()
      res.status(201).json({
        code: gameCode,
      })
    } catch (error) {
      res.status(500).json({ error: (error as Error).message })
    }
  }
}
