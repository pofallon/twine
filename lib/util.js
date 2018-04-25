const opn = require('opn')
const chalk = require('chalk')

const notEmpty = (input) => (input === '' ? 'This value is required' : true)
const openBrowser = (url) => opn(url, {wait: false})
const handleError = (message) => {
  console.error(chalk.redBright(message))
  process.exitCode = 1
}
const extractName = (pkgName) => pkgName.substr(pkgName.indexOf('/') + 1)

module.exports = { notEmpty, openBrowser, handleError, extractName }
