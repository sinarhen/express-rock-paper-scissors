import Game from "@/domain/entities/Game"

const fields = {
  games: Game,
}

export type IDatabase = {
  [K in keyof typeof fields]: {
    find(key: string): InstanceType<(typeof fields)[K]> | null
    create(key: string, value: InstanceType<(typeof fields)[K]>): void
    update(key: string, value: InstanceType<(typeof fields)[K]>): void
    delete(key: string): void
    listAll(): InstanceType<(typeof fields)[K]>[]
  }
}
