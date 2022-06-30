import {
  formatFiles,
  generateFiles,
  names,
  readProjectConfiguration,
  Tree,
  updateJson,
} from '@nrwl/devkit';
import * as path from 'path';
import { AddFragmentGeneratorSchema } from './schema';
import { set, defaultsDeep } from 'lodash';
import { prismergeFileAppStub } from '../../ui/prismerge.stub';

export default async function (
  tree: Tree,
  options: AddFragmentGeneratorSchema,
) {
  const fragment = names(options.name).fileName;
  const fragmentName = names(options.name).className;

  const templateSchema = {
    ...options,
    ...names(options.name),
    fragment: fragment,
    fragmentName: fragmentName,
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

    content[options.app].fragments = {
      ...content[options.app].fragments,
      ...{ [fragment]: `${modelRoot}/${options.name}.prisma.fragment` },
    };

    return content;
  });

  await formatFiles(tree);
}
