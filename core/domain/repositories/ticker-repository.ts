import type { TickerItem } from "../models/ticker-item"

export interface TickerRepository {
  getTickerItems(): Promise<TickerItem[]>
}
