import { Client } from 'undici'
import qs from 'qs'

export class ServiceFinderService {
  constructor(options) {
    this.options = options
  }

  async find(_params) {
    const query = _params.query || {}
    console.log('query', query)
    if (Array.isArray(query.endpoints) && query.endpoints.length) {
      const promises = query.endpoints.map(r => {
        return this._findServices('http://swim-registry.kr:8001', query.categories, query.availability, query.interfaces)
      })
      const result = await Promise.allSettled(promises)
      return result
    }
    return []
  }

  async _findServices(endpoint, categories, availability, interfaces) {
    try {
      console.log('endpoint', endpoint)
      const client = new Client(endpoint, {
        connections: 100,
        pipelining: 10
      })

      const options = {
        path: '/smxs/services',
        method: 'GET',
        headers: { Accept: 'application/json' }
      }
      const result = await this._request(client, options)
      console.log('result', result)
      return result
    } catch (err) {
      console.error('zaaa', err)
      throw(err)
    }
  }

  _request (client, options) {
    return new Promise(function (resolve, reject) {
      client.request(options, function (err, data) {
        if (err) {
          console.error('xxxxxxxxxx', err)
          return reject(err);
        }
        try {
          const { statusCode, headers, body } = data
          if (statusCode >= 200 && statusCode < 300) {
            const bufs = []
            body.on('data', buf => {
              bufs.push(buf)
            })
            body.on('end', () => {
              return resolve(JSON.parse(Buffer.concat(bufs).toString('utf8')))
            })
          } else {
            console.error('yyyyyy', err)
            return reject(statusCode)
          }
        } catch (err) {
          console.error('zzzz', err)
          reject(err)
        }
      })
    })
  }
}

export const getOptions = (app) => {
  return { app }
}
