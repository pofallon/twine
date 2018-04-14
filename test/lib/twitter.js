const chai = require('chai')
const expect = chai.expect
const chaiAsPromised = require('chai-as-promised')
const dirtyChai = require('dirty-chai')
const sinon = require('sinon')
const axios = require('axios')
const Twitter = require('../../lib/twitter')

chai.use(chaiAsPromised)
chai.use(dirtyChai)

describe('the twitter module', () => {
  var twitter
  before(() => {
    twitter = new Twitter('key', 'secret')
  })
  it('should set a token', () => {
    twitter.setToken('abc', '123')
    expect(twitter.token).to.include({key: 'abc'})
    expect(twitter.token).to.include({secret: '123'})
  })
  it('should invoke GET APIs', async () => {
    sinon.stub(axios, 'get').resolves({data: 'foo'})
    let response = await twitter.get('/api')
    expect(response).to.equal('foo')
    axios.get.restore()
  })
  it('should invoke POST APIs', async () => {
    sinon.stub(axios, 'post').resolves({data: 'bar'})
    let response = await twitter.post('/api', 'stuff')
    expect(response).to.equal('bar')
    axios.post.restore()
  })
  it('should reject on invalid credentials', async () => {
    sinon.stub(axios, 'post').rejects(new Error('401'))
    await expect(twitter.post('/api', 'stuff')).to.be.rejectedWith('Invalid Twitter credentials')
    axios.post.restore()
    sinon.stub(axios, 'get').rejects(new Error('401'))
    await expect(twitter.get('/api')).to.be.rejectedWith('Invalid Twitter credentials')
    axios.get.restore()
  })
  it('should reject on rate limit error', async () => {
    sinon.stub(axios, 'post').rejects(new Error('429'))
    await expect(twitter.post('/api', 'stuff')).to.be.rejectedWith('Twitter rate limit reached')
    axios.post.restore()
    sinon.stub(axios, 'get').rejects(new Error('429'))
    await expect(twitter.get('/api')).to.be.rejectedWith('Twitter rate limit reached')
    axios.get.restore()
  })
  it('should reject on other errors', async () => {
    sinon.stub(axios, 'post').rejects(new Error('foo'))
    await expect(twitter.post('/api', 'stuff')).to.be.rejectedWith('Twitter:')
    axios.post.restore()
    sinon.stub(axios, 'get').rejects(new Error('foo'))
    await expect(twitter.get('/api')).to.be.rejectedWith('Twitter:')
    axios.get.restore()
  })
})
