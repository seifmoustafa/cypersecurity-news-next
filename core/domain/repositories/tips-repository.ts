import type { Tip } from "@/entities"

export interface TipsRepository {
  getRandomTip(): Promise<Tip>
}
