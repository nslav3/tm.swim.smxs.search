// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  serviceFinderDataValidator,
  serviceFinderPatchValidator,
  serviceFinderQueryValidator,
  serviceFinderResolver,
  serviceFinderExternalResolver,
  serviceFinderDataResolver,
  serviceFinderPatchResolver,
  serviceFinderQueryResolver
} from './service-finder.schema.js'
import { ServiceFinderService, getOptions } from './service-finder.class.js'
import { serviceFinderPath, serviceFinderMethods } from './service-finder.shared.js'

export * from './service-finder.class.js'
export * from './service-finder.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const serviceFinder = (app) => {
  // Register our service on the Feathers application
  app.use(serviceFinderPath, new ServiceFinderService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: serviceFinderMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(serviceFinderPath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(serviceFinderExternalResolver),
        schemaHooks.resolveResult(serviceFinderResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(serviceFinderQueryValidator),
        schemaHooks.resolveQuery(serviceFinderQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(serviceFinderDataValidator),
        schemaHooks.resolveData(serviceFinderDataResolver)
      ],
      patch: [
        schemaHooks.validateData(serviceFinderPatchValidator),
        schemaHooks.resolveData(serviceFinderPatchResolver)
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
