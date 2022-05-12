import {
  formatFiles,
  generateFiles,
  names,
  readProjectConfiguration,
  Tree,
  updateJson,
} from '@nrwl/devkit';
import * as path from 'path';
import { AddMixinGeneratorSchema } from './schema';

export default async function (tree: Tree, options: AddMixinGeneratorSchema) {
  const mixin = names(options.name).fileName;
  const mixinName = names(options.name).className;

  const templateSchema = {
    ...options,
    ...names(options.name),
    mixin,
    mixinName,
    template: '',
  };

  const modelRoot = `./${
    readProjectConfiguration(tree, options.library).root
  }/src/lib/${options.directory}`;

  generateFiles(
    tree,
    path.join(__dirname, './files'),
    modelRoot,
    templateSchema,
  );

  updateJson(tree, options.prismergeFile, (prisMergeFile) => {
    prisMergeFile.mixins = prisMergeFile.mixins ?? {};

    prisMergeFile.mixins = {
      ...prisMergeFile.mixins,
      ...{ [mixin]: `${modelRoot}/${options.name}.prisma.mixin` },
    };

    return prisMergeFile;
  });

  await formatFiles(tree);
}
