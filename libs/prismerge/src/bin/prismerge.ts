#!/usr/bin/env node

import { program } from 'commander';
import * as process from 'process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import path = require('path');
import * as fs from 'fs';
import { warningString } from './../ui/warning';
import { prismergeFileStub } from './../ui/prismerge.stub';
import { exit } from 'process';
import { glob } from 'glob'

const bootstrap = async () => {
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
    .option('-g, --generate', 'Generate a default file first.')
    .option('-nF, --no-format', 'Format the Prisma File after generation.')
    .parse(process.argv);

  const options = program.opts();

  const basePath = path.join(process.cwd());
  const inputPath = path.join(basePath, options.input);

  // check, if we need to generate the prismerge file
  if (options.generate) {
    if (!existsSync(inputPath)) {
      fs.writeFileSync(inputPath, JSON.stringify(prismergeFileStub), {
        encoding: 'utf-8',
      });
      console.log(
        `File ${inputPath} was successfully created; exiting PrisMerge!`,
      );
      exit(0);
    } else {
      console.log(`File ${inputPath} does already exist; exiting PrisMerge!`);
      exit(1);
    }
  }

  if (!existsSync(inputPath)) {
    console.log(`Cannot read file ${inputPath}; exiting PrisMerge!`);
    exit(1);
  }

  // now we have everything ready
  const prisMergeContent = JSON.parse(readFileSync(inputPath, 'utf8'));

  for (const [app, content] of Object.entries(prisMergeContent) as [[string, any]]) {
    console.log(`Processing app: ${app}...`);
    const prismaSchemaInputFiles = content.inputs || [];
    const prismaSchemaMixinFiles = content.mixins || {};
    const prismaSchemaOutputFile = content.output;

    let prismaContent = '';
    prismaContent = prismaContent + warningString;

    for (const schemaFileGlob of prismaSchemaInputFiles) {
      const schemaFiles = await new Promise<string[]>((resolve, reject) => {
        glob(schemaFileGlob, (err, files) => {
          if (err) {
            reject(err)
          }

          resolve(files)
        })
      })

      schemaFiles.forEach((schemaFile: string) => {
        const content = readFileSync(schemaFile, 'utf8');
        prismaContent = prismaContent + content;
      })
    }

    Object.entries(prismaSchemaMixinFiles).forEach(([key, filePath]) => {
      // find key and replace with content from value
      const content = readFileSync(filePath as string, 'utf8');
      const regEx = new RegExp(`__${key}__`, 'g');
      prismaContent = prismaContent.replace(regEx, content);
    });

    writeFileSync(prismaSchemaOutputFile, prismaContent, { encoding: 'utf8' });

    if (options.format) {
      console.log(`Formatting file ${content.output}`);
      execSync('npx prisma format');
    }

    console.log(`Done processing app ${app}`);
  };
};

bootstrap();
