// This is a skeleton for a custom service class. Remove or add the methods you need here
import { Client } from 'undici'
import qs from 'qs'

export class PeersService {
  constructor(options) {
    if (!options.remote) throw new Error('Options expect `remote` property.')

    try {
      this.options = options
      this.client = new Client(options.remote, {
        connections: options.connections || 100,
        pipelining: options.pipelining || 10
      })
    } catch (err) {
      throw new Error(err)
    }
  }

  async find(_params) {
    const options = this._options(null, _params.query)
    const result = await this._request(options)
    return result
  }

  _options (id, params, data, method) {
    const options = {
      path: '/peers',
      method: method || 'GET'
    }

    if (id) options.path = `${options.path}/${id}`

    if (params) {
      const urlParams = qs.stringify(params)
      if (urlParams !== '') options.path = `${options.path}?${urlParams}`
    }

    if (data) options.body = Buffer.from(JSON.stringify(data))

    return options
  }

  _request (options) {
    const self = this
    return new Promise(function (resolve, reject) {
      self.client.request(options, function (err, data) {
        if (err) {
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
            return reject(statusCode)
          }
        } catch (err) {
          reject(err)
        }
      })
    })
  }
}

export const getOptions = (app) => {
  const ourRegistry = app.get('ourRegistry') || 'http://localhost:3031'
  return { 
    app,
    remote: ourRegistry
  }
}
