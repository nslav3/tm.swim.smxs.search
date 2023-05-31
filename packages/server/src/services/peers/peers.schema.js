// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const peersSchema = Type.Object(
  {
    id: Type.Number(),
    text: Type.String()
  },
  { $id: 'Peers', additionalProperties: false }
)
export const peersValidator = getValidator(peersSchema, dataValidator)
export const peersResolver = resolve({})

export const peersExternalResolver = resolve({})

// Schema for creating new entries
export const peersDataSchema = Type.Pick(peersSchema, ['text'], {
  $id: 'PeersData'
})
export const peersDataValidator = getValidator(peersDataSchema, dataValidator)
export const peersDataResolver = resolve({})

// Schema for updating existing entries
export const peersPatchSchema = Type.Partial(peersSchema, {
  $id: 'PeersPatch'
})
export const peersPatchValidator = getValidator(peersPatchSchema, dataValidator)
export const peersPatchResolver = resolve({})

// Schema for allowed query properties
export const peersQueryProperties = Type.Pick(peersSchema, ['id', 'text'])
export const peersQuerySchema = Type.Intersect(
  [
    querySyntax(peersQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export const peersQueryValidator = getValidator(peersQuerySchema, queryValidator)
export const peersQueryResolver = resolve({})
