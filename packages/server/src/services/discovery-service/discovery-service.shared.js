export const discoveryServicePath = 'discovery-service'

export const discoveryServiceMethods = ['find', 'get']

export const discoveryServiceClient = (client) => {
  const connection = client.get('connection')

  client.use(discoveryServicePath, connection.service(discoveryServicePath), {
    methods: discoveryServiceMethods
  })
}
