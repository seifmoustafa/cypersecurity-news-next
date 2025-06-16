import { ApiDataSource } from "../data/sources/api-data-source"
import { MockDataSource } from "../data/sources/mock-data-source"

// Repositories
import { NewsRepositoryImpl } from "../data/repositories/news-repository-impl"
import { RegulationsRepositoryImpl } from "../data/repositories/regulations-repository-impl"
import { RegulationCategoriesRepositoryImpl } from "../data/repositories/regulation-categories-repository-impl"
import { InstructionCategoriesRepositoryImpl } from "../data/repositories/instruction-categories-repository-impl"
import { InstructionYearsRepositoryImpl } from "../data/repositories/instruction-years-repository-impl"
import { InstructionsRepositoryImpl } from "../data/repositories/instructions-repository-impl"
import { TickerRepositoryImpl } from "../data/repositories/ticker-repository-impl"
import { TipsRepositoryImpl } from "../data/repositories/tips-repository-impl"
import { SystemsRepositoryImpl } from "../data/repositories/systems-repository-impl"
import { HelperSystemsRepositoryImpl } from "../data/repositories/helper-systems-repository-impl"
import { DefinitionsRepositoryImpl } from "../data/repositories/definitions-repository-impl"
import { LawsRepositoryImpl } from "../data/repositories/laws-repository-impl"
import { FrameworkRepositoryImpl } from "../data/repositories/framework-repository-impl"
import { MediaRepositoryImpl } from "../data/repositories/media-repository-impl"
import { StandardsRepositoryImpl } from "../data/repositories/standards-repository-impl"
import { ArticlesRepositoryImpl } from "../data/repositories/articles-repository-impl"

// Services
import { NewsService } from "../services/news-service"
import { RegulationsService } from "../services/regulations-service"
import { RegulationCategoriesService } from "../services/regulation-categories-service"
import { InstructionCategoriesService } from "../services/instruction-categories-service"
import { InstructionYearsService } from "../services/instruction-years-service"
import { InstructionsService } from "../services/instructions-service"
import { TickerService } from "../services/ticker-service"
import { TipsService } from "../services/tips-service"
import { SystemsService } from "../services/systems-service"
import { HelperSystemsService } from "../services/helper-systems-service"
import { DefinitionsService } from "../services/definitions-service"
import { LawsService } from "../services/laws-service"
import { FrameworkService } from "../services/framework-service"
import { MediaService } from "../services/media-service"
import { StandardsService } from "../services/standards-service"
import { ArticlesService } from "../services/articles-service"

class Container {
  private _apiDataSource: ApiDataSource | null = null
  private _mockDataSource: MockDataSource | null = null
  private _services: any = null

  // Data sources
  get apiDataSource(): ApiDataSource {
    if (!this._apiDataSource) {
      this._apiDataSource = new ApiDataSource()
    }
    return this._apiDataSource
  }

  get mockDataSource(): MockDataSource {
    if (!this._mockDataSource) {
      this._mockDataSource = new MockDataSource()
    }
    return this._mockDataSource
  }

  // Services
  get services() {
    if (!this._services) {
      this._services = {
        news: new NewsService(new NewsRepositoryImpl(this.apiDataSource)),
        regulations: new RegulationsService(new RegulationsRepositoryImpl(this.apiDataSource)),
        regulationCategories: new RegulationCategoriesService(
          new RegulationCategoriesRepositoryImpl(this.apiDataSource),
        ),
        instructionCategories: new InstructionCategoriesService(
          new InstructionCategoriesRepositoryImpl(this.apiDataSource),
        ),
        instructionYears: new InstructionYearsService(new InstructionYearsRepositoryImpl(this.apiDataSource)),
        instructions: new InstructionsService(new InstructionsRepositoryImpl(this.apiDataSource)),
        ticker: new TickerService(new TickerRepositoryImpl(this.apiDataSource)),
        tips: new TipsService(new TipsRepositoryImpl(this.apiDataSource)),
        systems: new SystemsService(new SystemsRepositoryImpl(this.apiDataSource)),
        helperSystems: new HelperSystemsService(new HelperSystemsRepositoryImpl(this.apiDataSource)),
        definitions: new DefinitionsService(new DefinitionsRepositoryImpl(this.apiDataSource)),
        laws: new LawsService(new LawsRepositoryImpl(this.apiDataSource)),
        framework: new FrameworkService(new FrameworkRepositoryImpl(this.mockDataSource)),
        media: new MediaService(new MediaRepositoryImpl(this.apiDataSource)),
        standards: new StandardsService(new StandardsRepositoryImpl(this.apiDataSource)),
        articles: new ArticlesService(new ArticlesRepositoryImpl(this.apiDataSource)),
      }
    }
    return this._services
  }

  // Individual service getters for easier access
  get standardsService() {
    return this.services.standards
  }

  get newsService() {
    return this.services.news
  }

  get regulationsService() {
    return this.services.regulations
  }

  get instructionsService() {
    return this.services.instructions
  }
}

export const container = new Container()
