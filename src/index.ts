import expressConfig from "./infrastructure/webserver/config/express"
import serverConfig from "./infrastructure/webserver/config/server"
import api from "./infrastructure/webserver/routes"
import {
  dbsImplementations,
  repositoriesImplementations,
} from "./composition-root"
import { wsApi } from "./infrastructure/webserver/websockets"
import { webSocketServerConfig } from "./infrastructure/webserver/config/webSocketServer"

// Server setup
const app = expressConfig()
const server = serverConfig(app)
const wss = webSocketServerConfig(server)

// Simple dependency injection container:
// as long as we use InMemory database we need to share the same instance of it
// it's basically a singleton
// if we were using a real database we could just make it a scoped dependency
const gameRepository = repositoriesImplementations.gameRepository(
  dbsImplementations.inMemoryDb(),
)

// Infrastructure:
// HTTP Rest API
api(app, { gameRepository })

// Websockets API
wsApi(wss, { gameRepository })
