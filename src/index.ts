import express from "express"
import expressConfig from "./infrastructure/webserver/express"
import serverConfig from "./infrastructure/webserver/server"
import api from "./infrastructure/webserver/routes"
import dotenv from "dotenv"
import websockets from "./infrastructure/webserver/websockets"
import {
  dbsImplementations,
  repositoriesImplementations,
} from "./composition-root"

dotenv.config({
  path: process.env.NODE_ENV === "test" ? "dev.env" : "prod.env",
})

const app = express()

expressConfig(app)

const server = serverConfig(app)

// as long as we use InMemory database we need to share the same instance of it
// it's basically a singleton
// if we were using a real database we would have to make it scoped for each controller separately
const gameRepository = repositoriesImplementations.gameRepository(
  dbsImplementations.inMemoryDb(),
)

api(app, { gameRepository })
websockets(server, { gameRepository })
