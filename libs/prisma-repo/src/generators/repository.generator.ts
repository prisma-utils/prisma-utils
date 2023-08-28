import { GeneratorInterface } from '../interfaces/generator.interface';
import { DMMF } from '@prisma/generator-helper';
import {
  repositoryStub,
  repositoryStubWithExceptions,
} from '../stubs/repository.stub';
import * as path from 'path';
import { promises as fs } from 'fs';
import { lowerCaseFirstChar } from '../utils/utils';

export class RepositoryGenerator {
  constructor(
    private config: GeneratorInterface,
    private model: DMMF.Model,
    private className: string,
  ) {}

  public async generateContent() {
    let repositoryContent: string;

    if (this.config.RepositoryExceptions === 'true') {
      repositoryContent = repositoryStubWithExceptions;
    } else {
      repositoryContent = repositoryStub;
    }

    if (this.config.RepositoryStub) {
      const stubFullPath = path.join(
        this.config.schemaPath,
        this.config.RepositoryStub,
      );
      console.log(`Loading Stubs from ${stubFullPath}`);

      const customStub = await fs.readFile(stubFullPath, { encoding: 'utf-8' });
      repositoryContent = customStub.toString();
    }

    // replace variables
    repositoryContent = repositoryContent.replace(
      /#{RepositoryClassName}/g,
      this.className,
    );

    repositoryContent = repositoryContent.replace(/#{Model}/g, this.model.name);
    repositoryContent = repositoryContent.replace(
      /#{MODEL}/g,
      this.model.name.toUpperCase(),
    );
    repositoryContent = repositoryContent.replace(
      /#{model}/g,
      this.model.name.toLowerCase(),
    );
    repositoryContent = repositoryContent.replace(
      /#{moDel}/g,
      lowerCaseFirstChar(this.model.name),
    );

    return repositoryContent;
  }
}
