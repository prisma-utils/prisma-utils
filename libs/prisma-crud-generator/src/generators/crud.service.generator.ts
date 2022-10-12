import { GeneratorInterface } from './../interfaces/generator.interface';
import { DMMF } from '@prisma/generator-helper';
import {
  crudServiceStub,
  crudServiceStubWithExceptions,
} from './../stubs/crud.service.stub';
import * as path from 'path';
import { promises as fs } from 'fs';
import { lowerCaseFirstChar } from '../utils/utils';

export class CrudServiceGenerator {
  constructor(
    private config: GeneratorInterface,
    private model: DMMF.Model,
    private className: string,
  ) {}

  public async generateContent() {
    let crudServiceContent: string;

    if (this.config.CRUDAddExceptions === 'true') {
      crudServiceContent = crudServiceStubWithExceptions;
    } else {
      crudServiceContent = crudServiceStub;
    }

    if (this.config.CRUDStubFile) {
      const stubFullPath = path.join(
        this.config.schemaPath,
        this.config.CRUDStubFile,
      );
      console.log(`Loading Stubs from ${stubFullPath}`);

      const customStub = await fs.readFile(stubFullPath, { encoding: 'utf-8' });
      crudServiceContent = customStub.toString();
    }

    // replace variables
    crudServiceContent = crudServiceContent.replace(
      /#{CrudServiceClassName}/g,
      this.className,
    );

    crudServiceContent = crudServiceContent.replace(
      /#{Model}/g,
      this.model.name,
    );
    crudServiceContent = crudServiceContent.replace(
      /#{MODEL}/g,
      this.model.name.toUpperCase(),
    );
    crudServiceContent = crudServiceContent.replace(
      /#{model}/g,
      this.model.name.toLowerCase(),
    );
    crudServiceContent = crudServiceContent.replace(
      /#{moDel}/g,
      lowerCaseFirstChar(this.model.name),
    );

    return crudServiceContent;
  }
}
