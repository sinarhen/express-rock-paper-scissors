import { GameWebSocketServer } from "@/infrastructure/types/customWs"

export const createBroadcaster = ({
  msg,
  wss,
  gameCode,
}: {
  msg: unknown
  wss: GameWebSocketServer
  gameCode: string
}) => {
  console.log(wss.clientRooms.get(gameCode))
  const jsonData = JSON.stringify(msg)
  wss.clientRooms.get(gameCode)?.forEach((client) => {
    if (client?.readyState === 1) {
      client.send(jsonData)
    }
  })
}
