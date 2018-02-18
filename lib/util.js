const opn = require('opn')

const notEmpty = (input) => (input === '' ? 'This value is required' : true)
const openBrowser = (url) => opn(url, {wait: false})

module.exports = { notEmpty, openBrowser }
