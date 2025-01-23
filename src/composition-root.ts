import { InMemoryGameRepository } from "./application/repositories/implementations/InMemoryGameRepository"
import { GameService } from "./application/services/implementations/GameService"
import { InMemoryDatabase } from "./infrastructure/database/implementations/inMemory"

// Initializing this all as singletons for simplicity
export const inMemoryDb = new InMemoryDatabase()
export const gameRepository = new InMemoryGameRepository(inMemoryDb)
export const gameService = new GameService(gameRepository)
