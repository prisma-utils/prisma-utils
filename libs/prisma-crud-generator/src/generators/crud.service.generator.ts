import { GeneratorInterface } from './../interfaces/generator.interface';
import { DMMF } from '@prisma/generator-helper';
import { crudServiceStub } from './../stubs/crud.service.stub';
import * as path from 'path';
import { writeFileSafely } from './../utils/writeFileSafely';
import { promises as fs } from 'fs';

export class CrudServiceGenerator {
  constructor(
    private config: GeneratorInterface,
    private model: DMMF.Model,
    private className: string,
  ) {}

  public async generateContent() {
    let crudServiceContent: string;

    crudServiceContent = crudServiceStub;

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
      this.lowerCase(this.model.name),
    );

    return crudServiceContent;
  }

  public async writeToFile(outputBasePath: string, content: string) {
    const dtoFilePath = path.join(
      outputBasePath,
      this.config.CRUDServicePath,
      `${this.model.name.toLowerCase()}.crud.service.ts`,
    );

    await writeFileSafely(this.config, dtoFilePath, content);
  }

  /**
   * Converts the first character of a word to lower case
   * @param name
   */
  private lowerCase(name: string): string {
    return name.substring(0, 1).toLowerCase() + name.substring(1)
  }
}
