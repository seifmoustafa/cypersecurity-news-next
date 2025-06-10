import { NewsRepositoryImpl } from "../data/repositories/news-repository-impl"
import { StandardsRepositoryImpl } from "../data/repositories/standards-repository-impl"
import { InstructionsRepositoryImpl } from "../data/repositories/instructions-repository-impl"
import { DefinitionsRepositoryImpl } from "../data/repositories/definitions-repository-impl"
import { SystemsRepositoryImpl } from "../data/repositories/systems-repository-impl"
import { TickerRepositoryImpl } from "../data/repositories/ticker-repository-impl"
import { TipsRepositoryImpl } from "../data/repositories/tips-repository-impl"
import { MediaRepositoryImpl } from "../data/repositories/media-repository-impl"
import { RegulationsRepositoryImpl } from "../data/repositories/regulations-repository-impl"
import { LawsRepositoryImpl } from "../data/repositories/laws-repository-impl"
import { FrameworkRepositoryImpl } from "../data/repositories/framework-repository-impl"
import { HelperSystemsRepositoryImpl } from "../data/repositories/helper-systems-repository-impl"

import { NewsService } from "../services/news-service"
import { StandardsService } from "../services/standards-service"
import { InstructionsService } from "../services/instructions-service"
import { DefinitionsService } from "../services/definitions-service"
import { SystemsService } from "../services/systems-service"
import { TickerService } from "../services/ticker-service"
import { TipsService } from "../services/tips-service"
import { MediaService } from "../services/media-service"
import { RegulationsService } from "../services/regulations-service"
import { LawsService } from "../services/laws-service"
import { FrameworkService } from "../services/framework-service"
import { HelperSystemsService } from "../services/helper-systems-service"

import { MockDataSource } from "../data/sources/mock-data-source"
import { ApiDataSource } from "../data/sources/api-data-source"

// Create data sources
const mockDataSource = new MockDataSource()
const apiDataSource = new ApiDataSource()

// Create repositories
const newsRepository = new NewsRepositoryImpl(apiDataSource)
const standardsRepository = new StandardsRepositoryImpl(mockDataSource)
const instructionsRepository = new InstructionsRepositoryImpl(mockDataSource)
const definitionsRepository = new DefinitionsRepositoryImpl(mockDataSource)
const systemsRepository = new SystemsRepositoryImpl(mockDataSource)
const tickerRepository = new TickerRepositoryImpl(apiDataSource)
const tipsRepository = new TipsRepositoryImpl(apiDataSource) // Now uses API
const mediaRepository = new MediaRepositoryImpl(mockDataSource)
const regulationsRepository = new RegulationsRepositoryImpl(mockDataSource)
const lawsRepository = new LawsRepositoryImpl(mockDataSource)
const frameworkRepository = new FrameworkRepositoryImpl()
const helperSystemsRepository = new HelperSystemsRepositoryImpl(apiDataSource)

// Create services
const newsService = new NewsService(newsRepository)
const standardsService = new StandardsService(standardsRepository)
const instructionsService = new InstructionsService(instructionsRepository)
const definitionsService = new DefinitionsService(definitionsRepository)
const systemsService = new SystemsService(systemsRepository)
const tickerService = new TickerService(tickerRepository)
const tipsService = new TipsService(tipsRepository)
const mediaService = new MediaService(mediaRepository)
const regulationsService = new RegulationsService(regulationsRepository)
const lawsService = new LawsService(lawsRepository)
const frameworkService = new FrameworkService(frameworkRepository)
const helperSystemsService = new HelperSystemsService(helperSystemsRepository)

// Export the container
export const container = {
  services: {
    news: newsService,
    standards: standardsService,
    instructions: instructionsService,
    definitions: definitionsService,
    systems: systemsService,
    ticker: tickerService,
    tips: tipsService,
    media: mediaService,
    regulations: regulationsService,
    laws: lawsService,
    framework: frameworkService,
    helperSystems: helperSystemsService,
  },
}
