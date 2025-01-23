import Game from "@/domain/entities/Game"
import { IGameRepository } from "../interfaces/IGameRepository"
import { IDatabase } from "@/infrastructure/database/interfaces/IDatabase"

export class InMemoryGameRepository implements IGameRepository {
  constructor(private readonly db: IDatabase) {}

  public findByCode(code: string): Game | null {
    return this.db.games.find(code)
  }

  public create(game: Game): Game {
    this.db.games.create(game.code, game)
    return game
  }

  public update(game: Game): Game {
    this.db.games.update(game.code, game)
    return game
  }

  public delete(gameId: string): void {
    this.db.games.delete(gameId)
  }

  public listAll(): Game[] {
    return this.db.games.listAll()
  }
}
