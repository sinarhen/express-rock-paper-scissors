import { Application } from "express"
import gameRouter from "./game"

export default function routes(
  app: Application,
) {
  app.use("/api/games", gameRouter())
}
