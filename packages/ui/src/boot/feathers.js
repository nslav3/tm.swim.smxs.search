import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import io from 'socket.io-client'

export default ({ app }) => {
  const url = `http://${window.location.hostname}:3032`
  const socket = io(url, {
    transports: ['websocket'],
    upgrade: false
  })
  const connection = socketio(socket, { timeout: 6000 })
  const client = feathers()
  client.configure(connection)
  app.config.globalProperties.$apiClient = client
}