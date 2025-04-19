import type { Tip } from "../models/tip"

export interface TipsRepository {
  getAllTips(): Promise<Tip[]>
  getRandomTip(): Promise<Tip>
}
