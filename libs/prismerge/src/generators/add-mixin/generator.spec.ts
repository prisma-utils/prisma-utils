import { Tree } from '@nrwl/devkit';

import generator from './generator';
import { AddMixinGeneratorSchema } from './schema';
import { createTreeWithLibrary } from './../../helpers/testing';

describe('add-model generator', () => {
  let appTree: Tree;
  const options: AddMixinGeneratorSchema = {
    name: 'test',
    directory: 'test',
    library: 'test',
    app: 'app',
    prismergeFile: './prismerge.json',
  };

  beforeEach(() => {
    appTree = createTreeWithLibrary(options.library);
    appTree.write(
      options.prismergeFile,
      JSON.stringify({ input: [], output: './prisma/schema.prisma' }),
    );
  });

  it('should run successfully', async () => {
    await expect(generator(appTree, options)).resolves.not.toThrowError();
  });
});
