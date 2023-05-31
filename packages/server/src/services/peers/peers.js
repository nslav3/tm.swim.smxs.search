// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  peersDataValidator,
  peersPatchValidator,
  peersQueryValidator,
  peersResolver,
  peersExternalResolver,
  peersDataResolver,
  peersPatchResolver,
  peersQueryResolver
} from './peers.schema.js'
import { PeersService, getOptions } from './peers.class.js'
import { peersPath, peersMethods } from './peers.shared.js'

export * from './peers.class.js'
export * from './peers.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const peers = (app) => {
  // Register our service on the Feathers application
  app.use(peersPath, new PeersService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: peersMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(peersPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(peersExternalResolver), schemaHooks.resolveResult(peersResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(peersQueryValidator), schemaHooks.resolveQuery(peersQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(peersDataValidator), schemaHooks.resolveData(peersDataResolver)],
      patch: [schemaHooks.validateData(peersPatchValidator), schemaHooks.resolveData(peersPatchResolver)],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: [
        (context) => {
          console.error('services/peers: Error: %O', context.error)
        }
      ]
    }
  })
}
