// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const discoveryServiceSchema = Type.Object(
  {
    id: Type.Number(),
    text: Type.String()
  },
  { $id: 'DiscoveryService', additionalProperties: false }
)
export const discoveryServiceValidator = getValidator(discoveryServiceSchema, dataValidator)
export const discoveryServiceResolver = resolve({})

export const discoveryServiceExternalResolver = resolve({})

// Schema for creating new entries
export const discoveryServiceDataSchema = Type.Pick(discoveryServiceSchema, ['text'], {
  $id: 'DiscoveryServiceData'
})
export const discoveryServiceDataValidator = getValidator(discoveryServiceDataSchema, dataValidator)
export const discoveryServiceDataResolver = resolve({})

// Schema for updating existing entries
export const discoveryServicePatchSchema = Type.Partial(discoveryServiceSchema, {
  $id: 'DiscoveryServicePatch'
})
export const discoveryServicePatchValidator = getValidator(discoveryServicePatchSchema, dataValidator)
export const discoveryServicePatchResolver = resolve({})

// Schema for allowed query properties
export const discoveryServiceQueryProperties = Type.Pick(discoveryServiceSchema, ['id', 'text'])
export const discoveryServiceQuerySchema = Type.Intersect(
  [
    querySyntax(discoveryServiceQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export const discoveryServiceQueryValidator = getValidator(discoveryServiceQuerySchema, queryValidator)
export const discoveryServiceQueryResolver = resolve({})
