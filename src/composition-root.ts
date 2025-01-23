import { InMemoryGameRepository } from "./application/repositories/implementations/InMemoryGameRepository"
import { IGameRepository } from "./application/repositories/interfaces/IGameRepository"
import { InMemoryDatabase } from "./infrastructure/database/implementations/InMemoryDatabase"
import {
  GetGameUseCase,
  CreateGameUseCase,
  JoinGameUseCase,
  SetChoiceUseCase,
  CompleteRoundUseCase,
  RequestRestartUseCase,
  DisconnectPlayerUseCase,
  ConnectPlayerUseCase,
} from "@/application/useCases/game"
import { IDatabase } from "./infrastructure/database/interfaces/IDatabase"

export const dbsImplementations = {
  inMemoryDb: () => new InMemoryDatabase(),
}

export const repositoriesImplementations = {
  gameRepository: (db: IDatabase) => new InMemoryGameRepository(db),
}

export const useCasesImplementations = {
  game: {
    getGame: (repository: IGameRepository) => new GetGameUseCase(repository),
    createGame: (repository: IGameRepository) =>
      new CreateGameUseCase(repository),
    joinGame: (repository: IGameRepository) => new JoinGameUseCase(repository),
    setChoice: (repository: IGameRepository) =>
      new SetChoiceUseCase(repository),
    completeRound: (repository: IGameRepository) =>
      new CompleteRoundUseCase(repository),
    requestRestart: (repository: IGameRepository) =>
      new RequestRestartUseCase(repository),
    disconnectPlayer: (repository: IGameRepository) =>
      new DisconnectPlayerUseCase(repository),
    connectPlayer: (repository: IGameRepository) =>
      new ConnectPlayerUseCase(repository),
  },
}
