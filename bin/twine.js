#! /usr/bin/env node

const program = require('commander')
const updateNotifier = require('update-notifier')
const pkg = require('../package.json')

updateNotifier({ pkg }).notify({ isGlobal: true })

program
  .version(pkg.version)
  .command('configure', 'configure Twitter-related credentials')
  .command('lookup', 'lookup things on Twitter')
  .parse(process.argv)
