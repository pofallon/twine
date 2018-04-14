const chai = require('chai')
const sinon = require('sinon')
const expect = chai.expect
const dirtyChai = require('dirty-chai')
const util = require('../../lib/util')

chai.use(dirtyChai)

describe('the util module', () => {
  context('the notEmpty function', () => {
    it('should return true when given a string', () => {
      expect(util.notEmpty('foo')).to.be.true()
    })
    it('should return an error when given an empty string', () => {
      expect(util.notEmpty('')).to.equal('This value is required')
    })
  })
  context('the handleError function', () => {
    it('should set the exitCode to 1', () => {
      sinon.stub(console, 'error')
      util.handleError('foo')
      expect(process.exitCode).to.equal(1)
      console.error.restore()
    })
    it('should print a message to console.error', () => {
      sinon.stub(console, 'error')
      util.handleError('bar')
      expect(console.error.calledWith('bar'))
      console.error.restore()
    })
  })
})
