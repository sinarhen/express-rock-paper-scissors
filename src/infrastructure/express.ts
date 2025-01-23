import express, { Application } from "express"

export default function expressConfig(app: Application) {
  app.use(express.json())
}
