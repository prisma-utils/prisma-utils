import {
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  getWorkspacePath,
  names,
  offsetFromRoot,
  Tree,
} from '@nrwl/devkit';
import * as path from 'path';
import { InitGeneratorSchema } from './schema';

interface NormalizedSchema extends InitGeneratorSchema {
  projectRoot: string;
  projectDirectory: string;

  prismergeFileName: string;
  prismaSchemaFilePath: string;
}

function normalizeOptions(
  tree: Tree,
  options: InitGeneratorSchema,
): NormalizedSchema {
  const projectDirectory = names(options.directory).fileName;

  const projectRoot = `${projectDirectory}`;

  const prismergeFileName = names(options.name).fileName;
  const prismaSchemaFilePath = names(options.output).fileName;

  return {
    ...options,
    projectRoot,
    projectDirectory,

    prismergeFileName,
    prismaSchemaFilePath,
  };
}

function addFiles(tree: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };
  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    options.projectRoot,
    templateOptions,
  );
}

export default async function (tree: Tree, options: InitGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);

  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
}
