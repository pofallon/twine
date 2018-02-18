const program = require('commander')
const pkg = require('../package.json')
const configure = require('../commands/configure')

program
  .version(pkg.version)

program
  .command('consumer')
  .description('Add a Twitter API key and secret')
  .action(async () => {
    await configure.consumer(pkg.name)
  })

program
  .command('account')
  .description('Authorize access to a Twitter account')
  .action(async () => {
    await configure.account(pkg.name)
  })

program
  .parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}
