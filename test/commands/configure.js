const path = require('path')
const fs = require('fs-extra')
const chai = require('chai')
const expect = chai.expect
const dirtyChai = require('dirty-chai')
const sinon = require('sinon')
const keytar = require('keytar')
const _ = require('lodash')
const inquirer = require('inquirer')
const configure = require('../../commands/configure')
const CredentialManager = require('../../lib/credential-manager')
const Twitter = require('../../lib/twitter')
const util = require('../../lib/util')

chai.use(dirtyChai)

describe('the configure module', () => {
  var secrets = { }
  var creds
  var sandbox
  before(() => {
    sinon.stub(keytar, 'setPassword').callsFake((service, key, secret) => {
      _.set(secrets, `${service}.${key}`, secret)
      return Promise.resolve()
    })
    sinon.stub(keytar, 'getPassword').callsFake((service, key) => {
      let value = _.get(secrets, `${service}.${key}`)
      return value ? Promise.resolve(value) : Promise.reject(new Error(`Missing consumer secret`))
    })
    sinon.stub(keytar, 'deletePassword').callsFake((service, key) => {
      _.unset(secrets, `${service}.${key}`)
      return Promise.resolve()
    })
    creds = new CredentialManager('twine-test')
  })
  beforeEach(() => {
    sandbox = sinon.sandbox.create()
  })
  it('should add credentials when none are found', async () => {
    sandbox.stub(inquirer, 'prompt').resolves({key: 'one', secret: 'two'})
    await configure.consumer('twine-test')
    let [key, secret] = await creds.getKeyAndSecret('consumer')
    expect(key).to.equal('one')
    expect(secret).to.equal('two')
    expect(inquirer.prompt.calledOnce).to.be.true()
  })
  it('should overwrite existing credentials', async () => {
    sandbox.stub(inquirer, 'prompt').resolves({key: 'three', secret: 'four'})
    await configure.consumer('twine-test')
    let [key, secret] = await creds.getKeyAndSecret('consumer')
    expect(key).to.equal('three')
    expect(secret).to.equal('four')
    expect(inquirer.prompt.calledOnce).to.be.true()
  })
  it('should add an account', async () => {
    sandbox.stub(CredentialManager.prototype, 'getKeyAndSecret')
      .resolves(['key', 'secret'])
    sandbox.stub(Twitter.prototype, 'post')
      .onFirstCall().resolves('oauth_token=abc&oauth_token_secret=def')
      .onSecondCall().resolves('oauth_token=ghi&oauth_token_secret=jkl')
    sandbox.stub(Twitter.prototype, 'get').resolves({screen_name: 'foo'})
    sandbox.stub(inquirer, 'prompt')
      .onFirstCall().resolves({continue: ''})
      .onSecondCall().resolves({pin: '1234'})
    sandbox.stub(util, 'openBrowser').returns('')
    sandbox.stub(console, 'log')
    await configure.account('twine-test')
    CredentialManager.prototype.getKeyAndSecret.restore()
    let [token, secret] = await creds.getKeyAndSecret('account')
    expect(token).to.equal('ghi')
    expect(secret).to.equal('jkl')
    expect(console.log.calledWith('Account "foo" successfully added')).to.be.true()
  })
  afterEach(() => {
    sandbox.restore()
  })
  after(async () => {
    await creds.clearAll()
    keytar.setPassword.restore()
    keytar.getPassword.restore()
    keytar.deletePassword.restore()
    await fs.unlink(path.join(process.env.HOME, '.config', 'configstore', 'twine-test.json'))
  })
})
