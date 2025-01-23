import { CommandHandlerFunc } from "@/infrastructure/types/commandHandler"
import { RequestMessagePayload } from "@/infrastructure/types/wsMessages"
import { makeChoice } from "./makeChoice"
import { restartGame } from "./restartGame"
export const commandHandlers: {
  [K in RequestMessagePayload["command"]]: CommandHandlerFunc<
    Extract<RequestMessagePayload, { command: K }>
  >
} = {
  makeChoice,
  restartGame,
}
