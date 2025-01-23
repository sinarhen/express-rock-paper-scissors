import express from "express"
import expressConfig from "./infrastructure/express"
import serverConfig from "./infrastructure/server"
import routes from "./infrastructure/routes"
import registerServices from "./application/factories"

const app = express()

expressConfig(app)

const services = registerServices()

serverConfig(app, { gameService: services.gameService })

routes(app, { gameService: services.gameService })
