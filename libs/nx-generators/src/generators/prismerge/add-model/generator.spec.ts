import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration } from '@nrwl/devkit';

import generator from './generator';
import { AddModelGeneratorSchema } from './schema';

describe('add-model generator', () => {
  let appTree: Tree;
  const options: AddModelGeneratorSchema = {
    name: 'test',
    directory: 'test',
    library: 'test',
    prismergeFile: './prismerge.json',
  };

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await generator(appTree, options);
    const config = readProjectConfiguration(appTree, 'test');
    expect(config).toBeDefined();
  });
});
