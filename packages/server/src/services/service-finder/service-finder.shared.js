export const serviceFinderPath = 'service-finder'

export const serviceFinderMethods = ['find']

export const serviceFinderClient = (client) => {
  const connection = client.get('connection')

  client.use(serviceFinderPath, connection.service(serviceFinderPath), {
    methods: serviceFinderMethods
  })
}
