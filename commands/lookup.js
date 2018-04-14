const readline = require('readline')
const JSONStream = require('JSONStream')
const PQueue = require('p-queue')
const CredentialManager = require('../lib/credential-manager')
const Twitter = require('../lib/twitter')
const BatchEmitter = require('../lib/batch-emitter')

const lookup = {
  async users (name, users, streams) {
    await doLookup(name, '1.1/users/lookup.json?screen_name=', users, streams)
  },
  async statuses (name, ids, streams) {
    await doLookup(name, '1.1/statuses/lookup.json?id=', ids, streams)
  }
}

const doLookup = async function (name, api, items, streams = process) {
  let creds = new CredentialManager(name)
  let [key, secret] = await creds.getKeyAndSecret('consumer')
  let twitter = new Twitter(key, secret)
  let [token, tokenSecret] = await creds.getKeyAndSecret('account')
  twitter.setToken(token, tokenSecret)
  let queue = new PQueue({concurrency: 2})
  let jsonStream = JSONStream.stringify()
  jsonStream.pipe(streams.stdout)
  await new Promise((resolve, reject) => {
    let batch = new BatchEmitter(100)
    batch.on('data', (data) => {
      queue.add(() => twitter.get(`${api}${data.join(',')}`))
        .then((results) => {
          results.forEach((result) => { jsonStream.write(result) })
        }).catch(reject)
    })
    batch.on('end', () => {
      queue.onIdle().then(() => {
        jsonStream.end()
        resolve()
      })
    })
    if (items) {
      items.split(',').forEach((item) => { batch.add(item) })
      batch.done()
    } else {
      readline.createInterface({input: streams.stdin})
        .on('line', (line) => { batch.add(line) })
        .on('close', () => { batch.done() })
    }
  })
}

module.exports = lookup
