import { InMemoryGameRepository } from "./application/repositories/implementations/InMemoryGameRepository"
import { IGameRepository } from "./application/repositories/interfaces/IGameRepository"
import { InMemoryDatabase } from "./infrastructure/database/implementations/InMemoryDatabase"
import {
  GetGameUseCase,
  CreateGameUseCase,
  JoinGameUseCase,
  SetChoiceUseCase,
  CompleteRoundAndAnnounceTheWinnerUseCase,
  RequestRestartUseCase,
  DisconnectPlayerUseCase,
  ConnectPlayerUseCase,
  StartGameUseCase,
  StartCountdownUseCase,
  ConfirmRestartUseCase,
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
    startGame: (repository: IGameRepository) =>
      new StartGameUseCase(repository),
    startCountdown: (repository: IGameRepository) =>
      new StartCountdownUseCase(repository),
    setChoice: (repository: IGameRepository) =>
      new SetChoiceUseCase(repository),
    completeRoundAndAnnounceTheWinner: (repository: IGameRepository) =>
      new CompleteRoundAndAnnounceTheWinnerUseCase(repository),
    requestRestart: (repository: IGameRepository) =>
      new RequestRestartUseCase(repository),
    disconnectPlayer: (repository: IGameRepository) =>
      new DisconnectPlayerUseCase(repository),
    connectPlayer: (repository: IGameRepository) =>
      new ConnectPlayerUseCase(repository),
    confirmRestart: (repository: IGameRepository) =>
      new ConfirmRestartUseCase(repository),
  },
}
