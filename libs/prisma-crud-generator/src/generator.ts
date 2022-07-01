import { generatorHandler, GeneratorOptions } from '@prisma/generator-helper';
import { logger } from '@prisma/sdk';
import * as path from 'path';
import { GENERATOR_NAME } from './constants';
import { defaultCrudServiceStub } from './stubs/crud.service.stub';
import {
  CompilerOptions,
  ExportDeclarationStructure,
  ModuleKind,
  OptionalKind,
  Project,
  ScriptTarget,
  SourceFile,
} from 'ts-morph';
import { promises as fs } from 'fs';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require('./../package.json');

const defaultConfig = {
  stubfolder: './stubs',
  barrelFile: true,
};

const baseCompilerOptions: CompilerOptions = {
  target: ScriptTarget.ES2019,
  module: ModuleKind.CommonJS,
  emitDecoratorMetadata: true,
  experimentalDecorators: true,
};

generatorHandler({
  onManifest() {
    logger.info(`${GENERATOR_NAME}:Registered`);
    return {
      version,
      defaultOutput: './../crud-services',
      prettyName: GENERATOR_NAME,
    };
  },
  onGenerate: async (options: GeneratorOptions) => {
    const project = new Project({
      compilerOptions: {
        ...baseCompilerOptions,
        ...{ declaration: true },
      },
    });

    const stubFile = options.generator.config?.['stubFile'];

    const outputPath = path.join(options.generator.output?.value as string);

    let crudServiceStubContent: string;
    if (stubFile) {
      logger.info(`Loading Stubs from ${stubFile}`);
      const customStub = await fs.readFile(
        path.join(options.schemaPath, stubFile),
        { encoding: 'utf-8' },
      );
      crudServiceStubContent = customStub.toString();
    } else {
      crudServiceStubContent = defaultCrudServiceStub;
    }

    const serviceFileNames: string[] = [];

    options.dmmf.datamodel.models.forEach(async (model) => {
      logger.info(`Processing Model ${model.name}`);

      let serviceContent = crudServiceStubContent;
      serviceContent = serviceContent.replace(/__Class__/g, model.name);
      serviceContent = serviceContent.replace(
        /__class__/g,
        model.name.toLowerCase(),
      );

      // write to output
      const outputFileName = `${model.name.toLowerCase()}.crud.service`;
      const outputFileWithExtension = `${outputFileName}.ts`;

      project.createSourceFile(
        path.join(outputPath, outputFileWithExtension),
        serviceContent,
        { overwrite: true },
      );

      serviceFileNames.push(outputFileName);
    });

    const barrelFile =
      options.generator.config?.['barrelfile'] || defaultConfig.barrelFile;

    if (barrelFile) {
      logger.info('Creating Barrel File');

      const barrelFilePath = path.join(outputPath, 'index.ts');

      const barrelFile = project.createSourceFile(barrelFilePath, undefined, {
        overwrite: true,
      });

      createBarrelFile(barrelFile, serviceFileNames);
    }

    project.save();
  },
});

function createBarrelFile(sourceFile: SourceFile, serviceNames: string[]) {
  sourceFile.addExportDeclarations(
    serviceNames
      .sort()
      .map<OptionalKind<ExportDeclarationStructure>>((serviceName) => ({
        moduleSpecifier: `./${serviceName}`,
      })),
  );
}
