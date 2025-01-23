import express from "express"

export default function expressConfig() {
  const app = express()
  app.use(express.json())
  return app
}
