import Game from "@/domain/entities/Game"

class Database {
  public games: Record<string, Game> = {}
}

export const db = new Database()
