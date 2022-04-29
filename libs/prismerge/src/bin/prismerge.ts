#!/usr/bin/env node

import { program } from 'commander';
import * as process from 'process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import path = require('path');
import { warningString } from '../ui/warning';

const bootstrap = () => {
  program
    .version(
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('../../package.json').version,
      '-v, --version',
      'Output the current version.',
    )
    .description(
      'Merge all defined prisma *.schema files into one big prisma.schema file.',
    )
    .option(
      '-i, --input <path>',
      'Path to the PrisMerge File, relative to the current working directory.',
      './prismerge.json',
    )
    .option('-nF, --no-format', 'Format the Prisma File after generation.')
    .parse(process.argv);

  const options = program.opts();

  const basePath = path.join(process.cwd());
  const inputPath = path.join(basePath, options.input);

  if (!existsSync(inputPath)) {
    throw new Error(`Cannot read file ${inputPath}!`);
  }

  const prisMergeContent = JSON.parse(readFileSync(inputPath, 'utf8'));
  const prismaSchemaInputFiles = prisMergeContent.input;
  const prismaSchemaOutputFile = prisMergeContent.output;

  let prismaContent = '';
  prismaContent = prismaContent + warningString;

  prismaSchemaInputFiles.forEach((schemaFile: string) => {
    const content = readFileSync(schemaFile, 'utf8');
    prismaContent = prismaContent + content;
  });

  writeFileSync(prismaSchemaOutputFile, prismaContent, { encoding: 'utf8' });

  if (options.format) {
    execSync('npx prisma format');
  }
};

bootstrap();
