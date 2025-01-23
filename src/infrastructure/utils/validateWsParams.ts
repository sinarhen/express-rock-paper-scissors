import { IncomingMessage } from "http"

export function getGameCodeFromRequest(req: IncomingMessage) {
  const urlParams = new URLSearchParams(req.url?.split("?")[1])
  const gameCode = urlParams.get("gameCode")

  if (!gameCode) {
    throw new Error("Missing gameCode")
  }
  return gameCode
}
