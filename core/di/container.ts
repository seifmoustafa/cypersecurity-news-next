import { MockDataSource } from "../data/sources/mock-data-source"

// Repositories
import { NewsRepositoryImpl } from "../data/repositories/news-repository-impl"
import { StandardsRepositoryImpl } from "../data/repositories/standards-repository-impl"
import { InstructionsRepositoryImpl } from "../data/repositories/instructions-repository-impl"
import { DefinitionsRepositoryImpl } from "../data/repositories/definitions-repository-impl"
import { FrameworkRepositoryImpl } from "../data/repositories/framework-repository-impl"
import { SystemsRepositoryImpl } from "../data/repositories/systems-repository-impl"
import { RegulationsRepositoryImpl } from "../data/repositories/regulations-repository-impl"
import { MediaRepositoryImpl } from "../data/repositories/media-repository-impl"
import { TickerRepositoryImpl } from "../data/repositories/ticker-repository-impl"
import { TipsRepositoryImpl } from "../data/repositories/tips-repository-impl"

// Services
import { NewsService } from "../services/news-service"
import { StandardsService } from "../services/standards-service"
import { InstructionsService } from "../services/instructions-service"
import { DefinitionsService } from "../services/definitions-service"
import { FrameworkService } from "../services/framework-service"
import { SystemsService } from "../services/systems-service"
import { RegulationsService } from "../services/regulations-service"
import { MediaService } from "../services/media-service"
import { TickerService } from "../services/ticker-service"
import { TipsService } from "../services/tips-service"

// Singleton instance of the data source
const mockDataSource = new MockDataSource()

// Repository instances
const newsRepository = new NewsRepositoryImpl(mockDataSource)
const standardsRepository = new StandardsRepositoryImpl(mockDataSource)
const instructionsRepository = new InstructionsRepositoryImpl(mockDataSource)
const definitionsRepository = new DefinitionsRepositoryImpl(mockDataSource)
const frameworkRepository = new FrameworkRepositoryImpl(mockDataSource)
const systemsRepository = new SystemsRepositoryImpl(mockDataSource)
const regulationsRepository = new RegulationsRepositoryImpl(mockDataSource)
const mediaRepository = new MediaRepositoryImpl(mockDataSource)
const tickerRepository = new TickerRepositoryImpl(mockDataSource)
const tipsRepository = new TipsRepositoryImpl(mockDataSource)

// Service instances
const newsService = new NewsService(newsRepository)
const standardsService = new StandardsService(standardsRepository)
const instructionsService = new InstructionsService(instructionsRepository)
const definitionsService = new DefinitionsService(definitionsRepository)
const frameworkService = new FrameworkService(frameworkRepository)
const systemsService = new SystemsService(systemsRepository)
const regulationsService = new RegulationsService(regulationsRepository)
const mediaService = new MediaService(mediaRepository)
const tickerService = new TickerService(tickerRepository)
const tipsService = new TipsService(tipsRepository)

// Export the container
export const container = {
  services: {
    news: newsService,
    standards: standardsService,
    instructions: instructionsService,
    definitions: definitionsService,
    framework: frameworkService,
    systems: systemsService,
    regulations: regulationsService,
    media: mediaService,
    ticker: tickerService,
    tips: tipsService,
  },
}
