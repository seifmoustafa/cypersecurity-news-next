import { NewsRepositoryImpl } from "../data/repositories/news-repository-impl"
import { StandardsRepositoryImpl } from "../data/repositories/standards-repository-impl"
import { DefinitionsRepositoryImpl } from "../data/repositories/definitions-repository-impl"
import { SystemsRepositoryImpl } from "../data/repositories/systems-repository-impl"
import { TickerRepositoryImpl } from "../data/repositories/ticker-repository-impl"
import { TipsRepositoryImpl } from "../data/repositories/tips-repository-impl"
import { MediaRepositoryImpl } from "../data/repositories/media-repository-impl"
import { LawsRepositoryImpl } from "../data/repositories/laws-repository-impl"
import { FrameworkRepositoryImpl } from "../data/repositories/framework-repository-impl"
import { HelperSystemsRepositoryImpl } from "../data/repositories/helper-systems-repository-impl"
import { RegulationCategoriesRepositoryImpl } from "../data/repositories/regulation-categories-repository-impl"
import { RegulationsRepositoryImpl } from "../data/repositories/regulations-repository-impl"
import { InstructionCategoriesRepositoryImpl } from "../data/repositories/instruction-categories-repository-impl"
import { InstructionYearsRepositoryImpl } from "../data/repositories/instruction-years-repository-impl"

import { NewsService } from "../services/news-service"
import { StandardsService } from "../services/standards-service"
import { DefinitionsService } from "../services/definitions-service"
import { SystemsService } from "../services/systems-service"
import { TickerService } from "../services/ticker-service"
import { TipsService } from "../services/tips-service"
import { MediaService } from "../services/media-service"
import { LawsService } from "../services/laws-service"
import { FrameworkService } from "../services/framework-service"
import { HelperSystemsService } from "../services/helper-systems-service"
import { RegulationCategoriesService } from "../services/regulation-categories-service"
import { RegulationsService } from "../services/regulations-service"
import { InstructionCategoriesService } from "../services/instruction-categories-service"
import { InstructionYearsService } from "../services/instruction-years-service"

import { MockDataSource } from "../data/sources/mock-data-source"
import { ApiDataSource } from "../data/sources/api-data-source"

// Create data sources
const mockDataSource = new MockDataSource()
const apiDataSource = new ApiDataSource()

// Create repositories
const newsRepository = new NewsRepositoryImpl(apiDataSource)
const standardsRepository = new StandardsRepositoryImpl(mockDataSource)
const instructionsRepository = null // Removed
const definitionsRepository = new DefinitionsRepositoryImpl(mockDataSource)
const systemsRepository = new SystemsRepositoryImpl(mockDataSource)
const tickerRepository = new TickerRepositoryImpl(apiDataSource)
const tipsRepository = new TipsRepositoryImpl(apiDataSource)
const mediaRepository = new MediaRepositoryImpl(mockDataSource)
const lawsRepository = new LawsRepositoryImpl(mockDataSource)
const frameworkRepository = new FrameworkRepositoryImpl()
const helperSystemsRepository = new HelperSystemsRepositoryImpl(apiDataSource)
const regulationCategoriesRepository = new RegulationCategoriesRepositoryImpl(apiDataSource)
const regulationsRepository = new RegulationsRepositoryImpl(apiDataSource)
const instructionCategoriesRepository = new InstructionCategoriesRepositoryImpl(apiDataSource)
const instructionYearsRepository = new InstructionYearsRepositoryImpl(apiDataSource)

// Create services
const newsService = new NewsService(newsRepository)
const standardsService = new StandardsService(standardsRepository)
const instructionsService = null // Removed
const definitionsService = new DefinitionsService(definitionsRepository)
const systemsService = new SystemsService(systemsRepository)
const tickerService = new TickerService(tickerRepository)
const tipsService = new TipsService(tipsRepository)
const mediaService = new MediaService(mediaRepository)
const lawsService = new LawsService(lawsRepository)
const frameworkService = new FrameworkService(frameworkRepository)
const helperSystemsService = new HelperSystemsService(helperSystemsRepository)
const regulationCategoriesService = new RegulationCategoriesService(regulationCategoriesRepository)
const regulationsService = new RegulationsService(regulationsRepository)
const instructionCategoriesService = new InstructionCategoriesService(instructionCategoriesRepository)
const instructionYearsService = new InstructionYearsService(instructionYearsRepository)

// Export the container
export const container = {
  services: {
    news: newsService,
    standards: standardsService,
    definitions: definitionsService,
    systems: systemsService,
    ticker: tickerService,
    tips: tipsService,
    media: mediaService,
    laws: lawsService,
    framework: frameworkService,
    helperSystems: helperSystemsService,
    regulationCategories: regulationCategoriesService,
    regulations: regulationsService,
    instructionCategories: instructionCategoriesService,
    instructionYears: instructionYearsService,
  },
}
