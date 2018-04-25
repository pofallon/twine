const program = require('commander')
const pkg = require('../package.json')
const lookup = require('../commands/lookup')
const util = require('../lib/util')

program
  .version(pkg.version)

program
  .command('users [screen-names]')
  .description('Find users by their screen name')
  .action((names) => lookup
    .users(util.extractName(pkg.name), names)
    .catch(util.handleError)
  )

program
  .command('statuses [ids]')
  .description('Find statuses (tweets) by their ID')
  .action((ids) => lookup
    .statuses(util.extractName(pkg.name), ids)
    .catch(util.handleError)
  )

program
  .parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}
