import Game from "@/domain/entities/Game"
import { IGameRepository } from "../interfaces/IGameRepository"
import { db } from "@/infrastructure/database"

export class InMemoryGameRepository implements IGameRepository {
  public findByCode(code: string): Game | null {
    return db.games[code] || null
  }

  public create(game: Game): Game {
    if (db.games[game.code]) {
      throw new Error(`Game with code ${game.code} already exists`)
    }
    db.games[game.code] = game
    return game
  }

  public update(game: Game): Game {
    if (!db.games[game.code]) {
      throw new Error(`Game with code ${game.code} not found`)
    }
    db.games[game.code] = game
    return game
  }

  public delete(gameId: string): void {
    if (!db.games[gameId]) {
      throw new Error(`Game with ID ${gameId} not found`)
    }
    delete db.games[gameId]
  }

  public listAll(): Game[] {
    return Object.values(db.games)
  }
}
