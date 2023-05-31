export const peersPath = 'peers'

export const peersMethods = ['find']

export const peersClient = (client) => {
  const connection = client.get('connection')

  client.use(peersPath, connection.service(peersPath), {
    methods: peersMethods
  })
}
