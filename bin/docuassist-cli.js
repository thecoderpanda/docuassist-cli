#!/usr/bin/env node

const { program } = require('commander');
const { initPlugin, ingestDocs, CheckTest } = require('../lib/commands');
const { version } = require('../package.json');


program
  .command('plugin init')
  .description('Install plugin in the Docusaurus directory')
  .action(initPlugin);

program
  .command('ingest')
  .description('Ingest documents into the vector store')
  .action(ingestDocs);

program
  .command('check')
  .description('Check test')
  .action(CheckTest);

program.parse(process.argv);
