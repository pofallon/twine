const chai = require('chai')
const expect = chai.expect
const dirtyChai = require('dirty-chai')
const sinon = require('sinon')
const axios = require('axios')
const Twitter = require('../../lib/twitter')

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
})
