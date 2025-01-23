import express from "express"
import expressConfig from "./infrastructure/webserver/express"
import serverConfig from "./infrastructure/webserver/server"
import routes from "./infrastructure/webserver/routes"
import dotenv from "dotenv"

dotenv.config({
  path: process.env.NODE_ENV === "test" ? "dev.env" : "prod.env",
})

const app = express()

expressConfig(app)

serverConfig(app)

routes(app)
