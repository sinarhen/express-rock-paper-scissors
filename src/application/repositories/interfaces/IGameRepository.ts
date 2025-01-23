import Game from "../../../domain/entities/Game"

export interface IGameRepository {
  findByCode(gameCode: string): Game | null
  create(game: Game): Game
  update(game: Game): Game
  delete(gameId: string): void
  listAll(): Game[]
}
