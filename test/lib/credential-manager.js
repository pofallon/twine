const path = require('path')
const fs = require('fs-extra')
const chai = require('chai')
const expect = chai.expect
const chaiAsPromised = require('chai-as-promised')
const dirtyChai = require('dirty-chai')
const CredentialManager = require('../../lib/credential-manager')

chai.use(chaiAsPromised)
chai.use(dirtyChai)

describe('the credential manager', () => {
  var creds
  before(() => {
    creds = new CredentialManager('twine-test')
  })
  it('should return credentials set in the environment', async () => {
    process.env['TWINE-TEST_CONSUMER_KEY'] = 'one'
    process.env['TWINE-TEST_CONSUMER_SECRET'] = 'two'
    let [key, secret] = await creds.getKeyAndSecret('consumer')
    expect(key).to.equal('one')
    expect(secret).to.equal('two')
  })
  it('should prefer credentials set in the environment', async () => {
    await creds.storeKeyAndSecret('consumer', 'foo', 'bar')
    let [key, secret] = await creds.getKeyAndSecret('consumer')
    expect(key).to.equal('one')
    expect(secret).to.equal('two')
    delete process.env['TWINE-TEST_CONSUMER_KEY']
    delete process.env['TWINE-TEST_CONSUMER_SECRET']
  })
  it('should return credentials when they are found', async () => {
    await creds.storeKeyAndSecret('consumer', 'foo', 'bar')
    let [key, secret] = await creds.getKeyAndSecret('consumer')
    expect(key).to.equal('foo')
    expect(secret).to.equal('bar')
  })
  it('should reject when no key are found', async () => {
    await creds.clearKeyAndSecret('consumer')
    expect(creds.getKeyAndSecret('consumer')).to.be.rejectedWith('Missing consumer key')
  })
  it('should reject when no secret is found', async () => {
    creds.conf.set('keys.consumer', 'foo')
    await expect(creds.getKeyAndSecret('consumer')).to.be.rejectedWith('Missing consumer secret')
    creds.conf.delete('keys.consumer')
  })
  it('should remove all credentials', async () => {
    await creds.storeKeyAndSecret('consumer', 'one', 'two')
    await creds.storeKeyAndSecret('account', 'three', 'four')
    await creds.clearAll()
    await expect(creds.getKeyAndSecret('consumer')).to.be.rejected()
    await expect(creds.getKeyAndSecret('account')).to.be.rejected()
  })
  after(async () => {
    await creds.clearAll()
    await fs.unlink(path.join(process.env.HOME, '.config', 'configstore', 'twine-test.json'))
  })
})
