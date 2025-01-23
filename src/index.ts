import express from "express"
import expressConfig from "./infrastructure/express"
import serverConfig from "./infrastructure/server"
import routes from "./infrastructure/routes"

const app = express()

expressConfig(app)

serverConfig(app)

routes(app)
