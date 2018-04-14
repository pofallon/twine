const program = require('commander')
const pkg = require('../package.json')
const configure = require('../commands/configure')
const util = require('../lib/util')

program
  .version(pkg.version)

program
  .command('consumer')
  .description('Add a Twitter API key and secret')
  .action(() => configure.consumer(pkg.name).catch(util.handleError))

program
  .command('account')
  .description('Authorize access to a Twitter account')
  .action(() => configure.account(pkg.name).catch(util.handleError))

program
  .parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}
