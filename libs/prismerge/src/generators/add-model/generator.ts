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
import * as pluralize from 'pluralize';
import { set, defaultsDeep } from 'lodash';
import { prismergeFileAppStub } from '../../ui/prismerge.stub';

export default async function (tree: Tree, options: AddModelGeneratorSchema) {
  const model = names(options.name).fileName;
  const modelName = names(options.name).className;
  const modelMapName = pluralize(names(options.name).className.toLowerCase());

  const templateSchema = {
    ...options,
    ...names(options.name),
    model,
    modelName,
    modelMapName,
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
    content[options.app].inputs.push(`${modelRoot}/${model}.prisma`);

    return content;
  });

  await formatFiles(tree);
}
