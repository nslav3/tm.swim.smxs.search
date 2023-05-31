// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  discoveryServiceDataValidator,
  discoveryServicePatchValidator,
  discoveryServiceQueryValidator,
  discoveryServiceResolver,
  discoveryServiceExternalResolver,
  discoveryServiceDataResolver,
  discoveryServicePatchResolver,
  discoveryServiceQueryResolver
} from './discovery-service.schema.js'
import { DiscoveryServiceService, getOptions } from './discovery-service.class.js'
import { discoveryServicePath, discoveryServiceMethods } from './discovery-service.shared.js'

export * from './discovery-service.class.js'
export * from './discovery-service.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const discoveryService = (app) => {
  // Register our service on the Feathers application
  app.use(discoveryServicePath, new DiscoveryServiceService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: discoveryServiceMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(discoveryServicePath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(discoveryServiceExternalResolver),
        schemaHooks.resolveResult(discoveryServiceResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(discoveryServiceQueryValidator),
        schemaHooks.resolveQuery(discoveryServiceQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(discoveryServiceDataValidator),
        schemaHooks.resolveData(discoveryServiceDataResolver)
      ],
      patch: [
        schemaHooks.validateData(discoveryServicePatchValidator),
        schemaHooks.resolveData(discoveryServicePatchResolver)
      ],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}
