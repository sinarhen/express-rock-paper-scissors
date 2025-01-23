import gameServicesFactory from "./game"

export default function registerServices() {
  const { gameRepository, gameService } = gameServicesFactory()
  return {
    gameRepository,
    gameService,
  }
}
