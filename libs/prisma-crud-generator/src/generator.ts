import { generatorHandler, GeneratorOptions } from '@prisma/generator-helper';
import { GENERATOR_NAME } from './constants';
import { CrudServiceGenerator } from './generators/crud.service.generator';
// import { DtoGenerator } from './generators/dto.generator';
import { GeneratorInterface } from './interfaces/generator.interface';
import { version } from './../package.json';

const defaultOptions: GeneratorInterface = {
  useStrict: 'false',
  dryRun: 'false',

  schemaPath: '',

  // DTOPath: 'data/dtos',
  // DTOCreatePrefix: 'Create',
  // DTOCreateParentClass: undefined,
  // DTOCreateParentClassPath: undefined,

  // DTOUpdatePrefix: 'Update',
  // DTOUpdateParentClass: undefined,
  // DTOUpdateParentClassPath: undefined,

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
      await crudServiceGenerator.writeToFile(
        outputBasePath,
        crudServiceContent,
      );
      } else {
        console.log(
          ` > Skipping Generation of CRUD Service for Model ${model.name}`,
        );
      }
      // ----------------------------------------

      /*
      // ----------------------------------------
      // generate CREATE DTOs
      const dtoCreateClassName = `${config.DTOCreatePrefix}${model.name}${config.DTOSuffix}`;
      const dtoCreateGenerator = new DtoGenerator(
        config,
        model,
        dtoCreateClassName,
      );
      const dtoCreateContent = await dtoCreateGenerator.generateContent(
        DTO_TYPE.CREATE,
      );
      await dtoCreateGenerator.writeToFile(
        DTO_TYPE.CREATE,
        outputBasePath,
        dtoCreateContent,
      );

      // generate Update DTOs
      const dtoUpdateClassName = `${config.DTOUpdatePrefix}${model.name}${config.DTOSuffix}`;
      const dtoUpdateGenerator = new DtoGenerator(
        config,
        model,
        dtoUpdateClassName,
      );
      const dtoUpdateContent = await dtoUpdateGenerator.generateContent(
        DTO_TYPE.UPDATE,
      );
      await dtoUpdateGenerator.writeToFile(
        DTO_TYPE.UPDATE,
        outputBasePath,
        dtoUpdateContent,
      );
      // ----------------------------------------
      */
    }
  },
});
