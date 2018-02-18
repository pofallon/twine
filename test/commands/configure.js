const path = require('path')
const fs = require('fs')
const chai = require('chai')
const expect = chai.expect
const dirtyChai = require('dirty-chai')
const sinon = require('sinon')
const inquirer = require('inquirer')
const configure = require('../../commands/configure')
const CredentialManager = require('../../lib/credential-manager')

chai.use(dirtyChai)

describe('the configure module', () => {
  var creds
  before(() => {
    creds = new CredentialManager('twine-test')
  })
  it('should add credentials when none are found', async () => {
    sinon.stub(inquirer, 'prompt').resolves({key: 'one', secret: 'two'})
    await configure.consumer('twine-test')
    let [key, secret] = await creds.getKeyAndSecret()
    expect(key).to.equal('one')
    expect(secret).to.equal('two')
    expect(inquirer.prompt.calledOnce).to.be.true()
    inquirer.prompt.restore()
  })
  it('should overwrite existing credentials', async () => {
    sinon.stub(inquirer, 'prompt').resolves({key: 'three', secret: 'four'})
    await configure.consumer('twine-test')
    let [key, secret] = await creds.getKeyAndSecret()
    expect(key).to.equal('three')
    expect(secret).to.equal('four')
    expect(inquirer.prompt.calledOnce).to.be.true()
    inquirer.prompt.restore()
  })
  after((done) => {
    fs.unlink(path.join(process.env.HOME, '.config', 'configstore', 'twine-test.json'), done)
  })
})
