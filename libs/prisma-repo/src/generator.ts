import { generatorHandler, GeneratorOptions } from '@prisma/generator-helper';
import { RepositoryGenerator } from './generators/repository.generator';
import { GeneratorInterface } from './interfaces/generator.interface';
import { version } from './../package.json';
import { writeFileSafely } from './utils/writeFileSafely';
import { lowerCaseFirstChar } from './utils/utils';
import { GENERATOR_NAME } from './constants';
import path = require('path');

const defaultOptions: GeneratorInterface = {
  strict: 'false',
  dryRun: 'false',

  schemaPath: '',

  GenerateRepositories: 'true',
  RepositoryPath: 'repositories',
  RepositorySuffix: 'Repository',
  RepositoryStub: undefined,
  RepositoryExceptions: 'true',
};

generatorHandler({
  onManifest() {
    console.log(`${GENERATOR_NAME}:Registered`);
    return {
      version,
      defaultOutput: '../generated',
      prettyName: GENERATOR_NAME,
    };
  },
  onGenerate: async (options: GeneratorOptions) => {
    const configOverwrites = {
      schemaPath: options.schemaPath,
    };

    const config: GeneratorInterface = {
      ...defaultOptions,
      ...options.generator.config,
      ...configOverwrites,
    };

    for (const model of options.dmmf.datamodel.models) {
      console.log(`Processing Model ${model.name}`);

      let folderPath = options.generator.output?.value + '';
      folderPath = folderPath?.replace(/#{Model}/g, model.name);
      folderPath = folderPath?.replace(/#{model}/g, model.name.toLowerCase());
      folderPath = folderPath?.replace(/#{MODEL}/g, model.name.toUpperCase());
      folderPath = folderPath?.replace(
        /#{moDel}/g,
        lowerCaseFirstChar(model.name),
      );

      const outputBasePath = folderPath;

      // ----------------------------------------
      // Generate Repository
      if (config.GenerateRepositories === 'true') {
        console.log(` > Generating Repository for Model ${model.name}`);
        const repositoryName = `${model.name}${config.RepositorySuffix}`;
        const repositoryGenerator = new RepositoryGenerator(
          config,
          model,
          repositoryName,
        );
        const repositoryContent = await repositoryGenerator.generateContent();

        await writeFileSafely(
          config,
          path.join(
            outputBasePath,
            config.RepositoryPath,
            `${model.name.toLowerCase()}.repository.ts`,
          ),
          repositoryContent,
        );
      } else {
        console.log(
          ` > Skipping Generation of Repository for Model ${model.name}`,
        );
      }
      // ----------------------------------------
    }
  },
});
