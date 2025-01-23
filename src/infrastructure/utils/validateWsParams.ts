import { IncomingMessage } from "http"

export function getRequiredParamsFromReq(req: IncomingMessage) {
  const urlParams = new URLSearchParams(req.url?.split("?")[1])
  const gameCode = urlParams.get("gameCode")
  const playerName = urlParams.get("playerName")
  return { gameCode, playerName }
}
