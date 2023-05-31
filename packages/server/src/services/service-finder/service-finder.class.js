import { Client } from 'undici'
import qs from 'qs'
import urlite from 'urlite'
import fetch from 'node-fetch'

export class ServiceFinderService {
  constructor(options) {
    this.options = options
  }

  async find(_params) {
    const query = _params.query || {}
    if (Array.isArray(query.endpoints) && query.endpoints.length) {
      const promises = query.endpoints.map(r => {
        return this._findServices(r, query.categories, query.availability, query.interfaces)
      })
      const result = await (await Promise.allSettled(promises)).filter(x => x.status === 'fulfilled').map(x => x.value)
      return result
    }
    return []
  }

  async _findServices(endpoint, categories, availability, interfaces) {
    try {
      /*
      const url = urlite.parse(endpoint)
      let remote = `${url.protocol || 'http:'}//${url.hostname}`
      if (url.port) remote = `${remote}:${url.port}`
      console.log('remote', remote)
      const client = new Client(remote, {
        connections: 100,
        pipelining: 10
      })

      const options = {
        path: url.path ? `${url.path}/services` : '/services',
        method: 'GET',
        headers: { Accept: 'application/json', 'Accept-Encoding': 'gzip, deflate, br' },
        maxRedirections: 3
      }
      */
      // const result = await this._request(client, options)
      console.log('Getting services from', endpoint)
      const response = await fetch(endpoint + '/services', { 
        method: 'GET',
        headers: { Accept: 'application/json' },
        redirect: 'follow',
        follow: 20 
      })
      const data = await response.json()
      console.log('response', data)
      return { endpoint, data }
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
          console.log('headers', headers)
          if (statusCode >= 200 && statusCode < 300) {
            const bufs = []
            body.on('data', buf => {
              bufs.push(buf)
            })
            body.on('end', () => {
              console.log('bufs', Buffer.concat(bufs).toString('utf8'))
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
