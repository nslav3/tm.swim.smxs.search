import { serviceFinder } from './service-finder/service-finder.js'

import { peers } from './peers/peers.js'

export const services = (app) => {
  app.configure(serviceFinder)

  app.configure(peers)

  // All services will be registered here
}
