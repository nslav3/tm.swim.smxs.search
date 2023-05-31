// For more information about this file see https://dove.feathersjs.com/guides/cli/client.html
import { feathers } from '@feathersjs/feathers'
import authenticationClient from '@feathersjs/authentication-client'
import { discoveryServiceClient } from './services/discovery-service/discovery-service.shared.js'

import { serviceFinderClient } from './services/service-finder/service-finder.shared.js'

import { peersClient } from './services/peers/peers.shared.js'

/**
 * Returns a  client for the server app.
 *
 * @param connection The REST or Socket.io Feathers client connection
 * @param authenticationOptions Additional settings for the authentication client
 * @see https://dove.feathersjs.com/api/client.html
 * @returns The Feathers client application
 */
export const createClient = (connection, authenticationOptions = {}) => {
  const client = feathers()

  client.configure(connection)
  client.configure(authenticationClient(authenticationOptions))
  client.set('connection', connection)

  client.configure(peersClient)

  client.configure(serviceFinderClient)

  client.configure(discoveryServiceClient)

  return client
}
