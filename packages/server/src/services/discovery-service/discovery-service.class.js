import got from 'got'

export class DiscoveryServiceService {
  constructor(options) {
    this.options = options
  }

  async find(_params) {
    return []
  }

  async get(id, _params) {
    let url = `${id}/discovery-service`
    const response = await got.get(url, {
       method: 'GET',
       headers: { 
         Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate, br',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'
       },
    }).json()

    const peers = await got.get(`${id}/peers`, {
       method: 'GET',
       headers: { 
         Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate, br',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'
       },
    }).json()
    console.log('peers', peers)
    response.peers = peers.peers ? peers.peers : peers
    return response
  }
}

export const getOptions = (app) => {
  return { app }
}
