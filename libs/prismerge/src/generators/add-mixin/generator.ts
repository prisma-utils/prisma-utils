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
import { set, defaultsDeep } from 'lodash';
import { prismergeFileAppStub } from '../../ui/prismerge.stub';

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

  updateJson(tree, options.prismergeFile, (content) => {
    set(
      content,
      `${options.app}`,
      defaultsDeep(content[options.app], prismergeFileAppStub),
    );

    content[options.app].mixins = {
      ...content[options.app].mixins,
      ...{ [mixin]: `${modelRoot}/${options.name}.prisma.mixin` },
    };

    return content;
  });

  await formatFiles(tree);
}
