import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';

export function createTreeWithLibrary(libName: string): Tree {
  const tree = createTreeWithEmptyWorkspace();
  tree.write(
    'workspace.json',
    String.raw`
      {
        "projects": {
          "${libName}": {
            "root": "libs/${libName}",
            "sourceRoot": "apps/${libName}/src",
            "projectType": "library",
            "targets":{}
          }
        }
      }
    `,
  );

  return tree;
}
