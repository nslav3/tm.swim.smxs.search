// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const serviceFinderSchema = Type.Object(
  {
    endpoints: Type.Array(),
    categories: Type.Array(),
    availability: Type.Array(),
    interfaces: Type.Array()
  },
  { $id: 'ServiceFinder', additionalProperties: false }
)
export const serviceFinderValidator = getValidator(serviceFinderSchema, dataValidator)
export const serviceFinderResolver = resolve({})

export const serviceFinderExternalResolver = resolve({})

// Schema for creating new entries
export const serviceFinderDataSchema = Type.Pick(serviceFinderSchema, ['text'], {
  $id: 'ServiceFinderData'
})
export const serviceFinderDataValidator = getValidator(serviceFinderDataSchema, dataValidator)
export const serviceFinderDataResolver = resolve({})

// Schema for updating existing entries
export const serviceFinderPatchSchema = Type.Partial(serviceFinderSchema, {
  $id: 'ServiceFinderPatch'
})
export const serviceFinderPatchValidator = getValidator(serviceFinderPatchSchema, dataValidator)
export const serviceFinderPatchResolver = resolve({})

// Schema for allowed query properties
export const serviceFinderQueryProperties = Type.Pick(serviceFinderSchema, ['endpoints', 'categories', 'availability', 'interfaces'])
export const serviceFinderQuerySchema = Type.Intersect(
  [
    querySyntax(serviceFinderQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: true })
  ],
  { additionalProperties: false }
)
export const serviceFinderQueryValidator = getValidator(serviceFinderQuerySchema, queryValidator)
export const serviceFinderQueryResolver = resolve({})
