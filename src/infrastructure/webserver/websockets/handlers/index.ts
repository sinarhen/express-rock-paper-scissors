import { CommandHandlerFunc } from "@/infrastructure/types/commandHandler"
import { makeChoice } from "./makeChoice"
import { restartGame } from "./restartGame"
import { RequestMessagePayload } from "@/infrastructure/types/wsMessage"

export const commandHandlers: {
  [K in RequestMessagePayload["command"]]: CommandHandlerFunc<
    Extract<RequestMessagePayload, { command: K }>
  >
} = {
  makeChoice,
  restartGame,
  
}
