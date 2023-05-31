import qs from 'qs'
import fetch from 'node-fetch'
import { logger } from '../../logger.js'

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
      let url = `${endpoint}/services`
      let urlParams = {}
      if (Array.isArray(categories) && categories.length) {
        urlParams['service-category'] = categories.join(',')
      }
      if (Array.isArray(availability) && availability.length) {
        urlParams['availability-status'] = availability.join(',')
      }
      if (Array.isArray(interfaces) && interfaces.length) {
        urlParams['interface-type'] = interfaces.join(',')
      }
      const q = qs.stringify(urlParams)
      if (q !== '') {
        url = `${url}?${q}`
      }
      logger.info('service-finder: Retrieving service list from %s ...', url)
      const response = await fetch(url, { 
        method: 'GET',
        headers: { 
          Accept: 'application/json',
         'Accept-Encoding': 'gzip, deflate, br',
         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'
        },
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
