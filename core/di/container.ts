import { SecurityProceduresApiDataSource } from "../data/sources/security-procedures-api-data-source"
import { SecurityProceduresRepositoryImpl } from "../data/repositories/security-procedures-repository-impl"
import { SecurityProceduresService } from "../services/security-procedures-service"

function createContainer() {
  // Data Sources
  // const someApiDataSource = new SomeApiDataSource()

  // Repositories
  // const someRepository = new SomeRepositoryImpl(someApiDataSource)

  // Services
  // const someService = new SomeService(someRepository)

  const securityProceduresApiDataSource = new SecurityProceduresApiDataSource()
  const securityProceduresRepository = new SecurityProceduresRepositoryImpl(securityProceduresApiDataSource)
  const securityProceduresService = new SecurityProceduresService(securityProceduresRepository)

  return {
    services: {
      // someService: someService,
      securityProcedures: securityProceduresService,
    },
    repositories: {
      // someRepository: someRepository,
      securityProcedures: securityProceduresRepository,
    },
  }
}

export const container = createContainer()
