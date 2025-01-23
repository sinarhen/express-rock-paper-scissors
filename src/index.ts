import express from "express"
import expressConfig from "./infrastructure/webserver/express"
import serverConfig from "./infrastructure/webserver/server"
import routes from "./infrastructure/webserver/routes"

const app = express()

expressConfig(app)

serverConfig(app)

routes(app)
