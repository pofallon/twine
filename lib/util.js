const opn = require('opn')

const notEmpty = (input) => (input === '' ? 'This value is required' : true)
const openBrowser = (url) => opn(url)

module.exports = { notEmpty, openBrowser }
