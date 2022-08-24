import { generatorHandler, GeneratorOptions } from '@prisma/generator-helper';
import { GENERATOR_NAME } from './constants';
import { CrudServiceGenerator } from './generators/crud.service.generator';
import { GeneratorInterface } from './interfaces/generator.interface';
import { version } from './../package.json';
import { InputGenerator } from './generators/input.generator';
import { writeFileSafely } from './utils/writeFileSafely';
import path = require('path');

const defaultOptions: GeneratorInterface = {
  useStrict: 'false',
  dryRun: 'false',

  schemaPath: '',

  GenerateInputs: 'true',
  InputExportPath: 'data/inputs',
  InputSuffix: 'Input',
  InputValidatorPackage: 'class-validator',

  InputParentClass: undefined,
  InputParentClassPath: undefined,

  InputCreatePrefix: 'Create',
  InputUpdatePrefix: 'Update',

  GenerateServices: 'true',
  CRUDServicePath: 'services',
  CRUDServiceSuffix: 'CrudService',
  CRUDStubFile: undefined,
  CRUDAddExceptions: 'true',
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

      const outputBasePath = folderPath;

      // ----------------------------------------
      // generate CRUD Service
      if (config.GenerateServices === 'true') {
        console.log(` > Generating CRUD Service for Model ${model.name}`);
        const crudServiceName = `${model.name}${config.CRUDServiceSuffix}`;
        const crudServiceGenerator = new CrudServiceGenerator(
          config,
          model,
          crudServiceName,
        );
        const crudServiceContent = await crudServiceGenerator.generateContent();

        await writeFileSafely(
          config,
          path.join(
            outputBasePath,
            config.CRUDServicePath,
            `${model.name.toLowerCase()}.crud.service.ts`,
          ),
          crudServiceContent,
        );
      } else {
        console.log(
          ` > Skipping Generation of CRUD Service for Model ${model.name}`,
        );
      }
      // ----------------------------------------

      // ----------------------------------------
      // generate INPUTS
      if (config.GenerateInputs === 'true') {
        const inputGenerator = new InputGenerator(config, model);
        const inputContent = await inputGenerator.generateContent();

        await writeFileSafely(
          config,
          path.join(
            outputBasePath,
            config.InputExportPath,
            `${model.name.toLowerCase()}.input.ts`,
          ),
          inputContent,
        );
      }
      // ----------------------------------------
    }
  },
});
