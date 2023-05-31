import got, { Options } from 'got'

const options = new Options({
  method: 'GET',
  headers: { 
    Accept: 'application/json',
    'Accept-Encoding': 'gzip, deflate, br',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'
  },
  retry: { limit: 0 },
  followRedirect: true,
  maxRedirects: 2,
  timeout: { request: 3000 }
})
console.log('starting')
got.get('http://nsrr.faa.gov/smxs/services', options).json().then(result => {
  console.log('result', result)
}).catch(err => {
  console.error(err)
})