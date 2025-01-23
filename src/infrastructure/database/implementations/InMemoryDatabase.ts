import Game from "@/domain/entities/Game"
import { IDatabase } from "../interfaces/IDatabase"

export class InMemoryDatabase implements IDatabase {
  public games: {
    find: (key: string) => Game | null
    create: (key: string, value: Game) => void
    update: (key: string, value: Game) => void
    delete: (key: string) => void
    listAll: () => Game[]
  }

  constructor() {
    const data: Record<string, Game> = {}

    this.games = {
      find: (key: string): Game | null => data[key] || null,
      create: (key: string, value: Game): void => {
        if (data[key]) {
          throw new Error(`Game with key ${key} already exists`)
        }
        data[key] = value
      },
      update: (key: string, value: Game): void => {
        if (!data[key]) {
          throw new Error(`Game with key ${key} not found`)
        }
        data[key] = value
      },
      delete: (key: string): void => {
        if (!data[key]) {
          throw new Error(`Game with key ${key} not found`)
        }
        delete data[key]
      },
      listAll: (): Game[] => Object.values(data),
    }
  }
}
