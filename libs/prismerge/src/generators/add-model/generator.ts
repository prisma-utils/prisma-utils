import {
  formatFiles,
  generateFiles,
  names,
  readProjectConfiguration,
  Tree,
  updateJson,
} from '@nrwl/devkit';
import * as path from 'path';
import { AddModelGeneratorSchema } from './schema';

export default async function (tree: Tree, options: AddModelGeneratorSchema) {
  const model = names(options.name).fileName;
  const modelName = names(options.name).className;

  const templateSchema = {
    ...options,
    ...names(options.name),
    model,
    modelName,
    template: '',
  };

  const modelRoot = path.join(
    readProjectConfiguration(tree, options.library).root,
    options.directory,
  );

  generateFiles(
    tree,
    path.join(__dirname, './files'),
    modelRoot,
    templateSchema,
  );

  updateJson(tree, options.prismergeFile, (prisMergeFile) => {
    prisMergeFile.inputs = prisMergeFile.inputs ?? [];
    prisMergeFile.inputs.push(`${modelRoot}/${model}.prisma`);

    return prisMergeFile;
  });

  await formatFiles(tree);
}
