import { ApiDataSource } from "../data/sources/api-data-source";
import { MockDataSource } from "../data/sources/mock-data-source";
import { SecurityProceduresApiDataSource } from "../data/sources/security-procedures-api-data-source";

// Repositories
import { NewsRepositoryImpl } from "../data/repositories/news-repository-impl";
import { RegulationsRepositoryImpl } from "../data/repositories/regulations-repository-impl";
import { RegulationCategoriesRepositoryImpl } from "../data/repositories/regulation-categories-repository-impl";
import { InstructionCategoriesRepositoryImpl } from "../data/repositories/instruction-categories-repository-impl";
import { InstructionYearsRepositoryImpl } from "../data/repositories/instruction-years-repository-impl";
import { InstructionsRepositoryImpl } from "../data/repositories/instructions-repository-impl";
import { TickerRepositoryImpl } from "../data/repositories/ticker-repository-impl";
import { TipsRepositoryImpl } from "../data/repositories/tips-repository-impl";
import { SystemsRepositoryImpl } from "../data/repositories/systems-repository-impl";
import { HelperSystemsRepositoryImpl } from "../data/repositories/helper-systems-repository-impl";
import { DefinitionsRepositoryImpl } from "../data/repositories/definitions-repository-impl";
import { LawsRepositoryImpl } from "../data/repositories/laws-repository-impl";
import { FrameworkRepositoryImpl } from "../data/repositories/framework-repository-impl";
import { MediaRepositoryImpl } from "../data/repositories/media-repository-impl";
import { StandardsRepositoryImpl } from "../data/repositories/standards-repository-impl";
import { ArticlesRepositoryImpl } from "../data/repositories/articles-repository-impl";
import { AwarenessRepositoryImpl } from "../data/repositories/awareness-repository-impl";
import { SecurityProceduresRepositoryImpl } from "../data/repositories/security-procedures-repository-impl";

// Services
import { NewsService } from "../services/news-service";
import { RegulationsService } from "../services/regulations-service";
import { RegulationCategoriesService } from "../services/regulation-categories-service";
import { InstructionCategoriesService } from "../services/instruction-categories-service";
import { InstructionYearsService } from "../services/instruction-years-service";
import { InstructionsService } from "../services/instructions-service";
import { TickerService } from "../services/ticker-service";
import { TipsService } from "../services/tips-service";
import { SystemsService } from "../services/systems-service";
import { HelperSystemsService } from "../services/helper-systems-service";
import { DefinitionsService } from "../services/definitions-service";
import { LawsService } from "../services/laws-service";
import { FrameworkService } from "../services/framework-service";
import { MediaService } from "../services/media-service";
import { StandardsService } from "../services/standards-service";
import { ArticlesService } from "../services/articles-service";
import { AwarenessService } from "../services/awareness-service";
import { SecurityProceduresService } from "../services/security-procedures-service";

class Container {
  private _apiDataSource: ApiDataSource | null = null;
  private _mockDataSource: MockDataSource | null = null;
  private _securityProceduresApiDataSource: SecurityProceduresApiDataSource | null =
    null;
  private _services: any = null;

  // Data sources
  get apiDataSource(): ApiDataSource {
    if (!this._apiDataSource) {
      this._apiDataSource = new ApiDataSource();
    }
    return this._apiDataSource;
  }

  get mockDataSource(): MockDataSource {
    if (!this._mockDataSource) {
      this._mockDataSource = new MockDataSource();
    }
    return this._mockDataSource;
  }

  get securityProceduresApiDataSource(): SecurityProceduresApiDataSource {
    if (!this._securityProceduresApiDataSource) {
      this._securityProceduresApiDataSource =
        new SecurityProceduresApiDataSource();
    }
    return this._securityProceduresApiDataSource;
  }

  // Services
  get services() {
    if (!this._services) {
      this._services = {
        news: new NewsService(new NewsRepositoryImpl(this.apiDataSource)),
        regulations: new RegulationsService(
          new RegulationsRepositoryImpl(this.apiDataSource)
        ),
        regulationCategories: new RegulationCategoriesService(
          new RegulationCategoriesRepositoryImpl(this.apiDataSource)
        ),
        instructionCategories: new InstructionCategoriesService(
          new InstructionCategoriesRepositoryImpl(this.apiDataSource)
        ),
        instructionYears: new InstructionYearsService(
          new InstructionYearsRepositoryImpl(this.apiDataSource)
        ),
        instructions: new InstructionsService(
          new InstructionsRepositoryImpl(this.apiDataSource)
        ),
        ticker: new TickerService(new TickerRepositoryImpl(this.apiDataSource)),
        tips: new TipsService(new TipsRepositoryImpl(this.apiDataSource)),
        systems: new SystemsService(
          new SystemsRepositoryImpl(this.apiDataSource)
        ),
        helperSystems: new HelperSystemsService(
          new HelperSystemsRepositoryImpl(this.apiDataSource)
        ),
        definitions: new DefinitionsService(
          new DefinitionsRepositoryImpl(this.apiDataSource)
        ),
        laws: new LawsService(new LawsRepositoryImpl(this.apiDataSource)),
        framework: new FrameworkService(
          new FrameworkRepositoryImpl(this.mockDataSource)
        ),
        media: new MediaService(new MediaRepositoryImpl(this.apiDataSource)),
        standards: new StandardsService(
          new StandardsRepositoryImpl(this.apiDataSource)
        ),
        articles: new ArticlesService(
          new ArticlesRepositoryImpl(this.apiDataSource)
        ),
        awareness: new AwarenessService(
          new AwarenessRepositoryImpl(this.apiDataSource)
        ),
        securityProcedures: new SecurityProceduresService(
          new SecurityProceduresRepositoryImpl(
            this.securityProceduresApiDataSource
          )
        ),
      };
    }
    return this._services;
  }

  // Individual service getters for easier access
  get standardsService() {
    return this.services.standards;
  }

  get newsService() {
    return this.services.news;
  }

  get regulationsService() {
    return this.services.regulations;
  }

  get instructionsService() {
    return this.services.instructions;
  }

  get awarenessService() {
    return this.services.awareness;
  }

  get securityProceduresService() {
    return this.services.securityProcedures;
  }

  get tipsService() {
    return this.services.tips;
  }

  get tickerService() {
    return this.services.ticker;
  }

  get systemsService() {
    return this.services.systems;
  }

  get helperSystemsService() {
    return this.services.helperSystems;
  }

  get definitionsService() {
    return this.services.definitions;
  }

  get lawsService() {
    return this.services.laws;
  }

  get frameworkService() {
    return this.services.framework;
  }

  get mediaService() {
    return this.services.media;
  }

  get articlesService() {
    return this.services.articles;
  }

  get regulationCategoriesService() {
    return this.services.regulationCategories;
  }

  get instructionCategoriesService() {
    return this.services.instructionCategories;
  }

  get instructionYearsService() {
    return this.services.instructionYears;
  }
}

// Export the container instance
export const container = new Container();
