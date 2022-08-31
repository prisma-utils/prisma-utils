import { DMMF } from '@prisma/generator-helper';
import { DecoratorHelper } from '../helpers/decorator.helper';
import { PrismaHelper } from '../helpers/prisma.helper';
import { GeneratorInterface } from '../interfaces/generator.interface';
import {
  inputBaseClassStub,
  inputCreateClassStub,
  inputFieldStub,
  inputUpdateClassStub,
} from '../stubs/input.stub';

export class InputGenerator {
  private fieldDecorators: DecoratorHelper[] = [];
  private omitFields: string[] = [];

  constructor(private config: GeneratorInterface, private model: DMMF.Model) {}

  async generateContent() {
    let content = await this.generateBaseInput();

    const createInputStub = this.generateCreateInput();
    content = content.replace(/#{CreateClassStub}/g, createInputStub);

    const createUpdateStub = this.generateUpdateInput();
    content = content.replace(/#{UpdateClassStub}/g, createUpdateStub);

    content = content.replace(/#{Imports}/g, this.generateImportStatements());
    return content;
  }

  private getBaseInputClassName() {
    return `${this.model.name}${this.config.InputSuffix}`;
  }

  private async generateBaseInput() {
    let content = inputBaseClassStub;

    const className = this.getBaseInputClassName();
    content = content.replace(/#{NameBaseInput}/g, className);

    // ------------------------------------------
    // handle the parent class (extends)
    if (this.config.InputParentClass) {
      content = content.replace(
        /#{ParentClass}/g,
        `extends ${this.config.InputParentClass}`,
      );
    }

    if (this.config.InputParentClassPath) {
      this.addDecoratorToImport(
        new DecoratorHelper(
          this.config.InputParentClass + '',
          this.config.InputParentClassPath + '',
        ),
      );
    }
    content = content.replace(/#{ParentClass}/g, '');
    // ------------------------------------------

    let fieldsContent = '';

    for (const field of this.model.fields) {
      const fieldContent = await this.generateFieldContent(field);
      fieldsContent = fieldsContent + fieldContent;
    }

    content = content.replace(/#{Fields}/g, fieldsContent);

    return content;
  }

  private generateCreateInput() {
    let content = inputCreateClassStub;

    const baseClassName = this.getBaseInputClassName();
    const className = `${this.config.InputCreatePrefix}${this.model.name}${this.config.InputSuffix}`;

    content = content.replace(/#{NameBaseInput}/g, baseClassName);
    content = content.replace(/#{NameCreateInput}/g, className);

    const omitFieldString = this.omitFields
      .map((field) => `'${field}'`)
      .join(',');
    content = content.replace(/#{OmitFields}/g, omitFieldString);

    this.addDecoratorToImport(
      new DecoratorHelper('OmitType', '@nestjs/swagger'),
    );

    return content;
  }

  private generateUpdateInput() {
    let content = inputUpdateClassStub;

    const baseClassName = this.getBaseInputClassName();
    const className = `${this.config.InputUpdatePrefix}${this.model.name}${this.config.InputSuffix}`;

    content = content.replace(/#{NameBaseInput}/g, baseClassName);
    content = content.replace(/#{NameUpdateInput}/g, className);

    this.addDecoratorToImport(
      new DecoratorHelper('PartialType', '@nestjs/swagger'),
    );

    return content;
  }

  async generateFieldContent(field: DMMF.Field) {
    let content = inputFieldStub;

    content = content.replace(/#{FieldName}/g, field.name);
    content = content.replace(
      /#{Type}/g,
      PrismaHelper.getInstance().getPrimitiveMapTypeFromDMMF(field),
    );

    let isOptionalDecorator = '';

    if (field.isRequired === false) {
      content = content.replace(/#{Operator}/g, '?');
      const isOptionalDecoratorHelper = new DecoratorHelper(
        'IsOptional',
        this.config.InputValidatorPackage,
      );
      this.addDecoratorToImport(isOptionalDecoratorHelper);
      isOptionalDecorator = isOptionalDecoratorHelper.generateContent();
    } else {
      if (this.config.strict === 'true') {
        content = content.replace(/#{Operator}/g, '!');
      } else {
        content = content.replace(/#{Operator}/g, '');
      }
    }

    let openApiDecoratorsContent = '';
    if (this.config.GenerateInputSwagger === 'true') {
      const openApiDecorators =
        PrismaHelper.getInstance().generateSwaggerDecoratorsFromDMMF(field);

      // append the new decorators
      for (const fieldDecorator of openApiDecorators) {
        this.addDecoratorToImport(fieldDecorator);
      }

      openApiDecoratorsContent = openApiDecorators
        .map((decorator) => {
          return decorator.generateContent();
        })
        .join('\n');
    }

    // and now we add some custom decorators based on documentation
    const documentation = field.documentation;
    let customDecoratorsContent = '';
    if (documentation) {
      // we need to process this properly
      const customDecorators = this.parseDocumentation(field);

      for (const customDecorator of customDecorators) {
        // check, if the current field has an @Omit() decorator, so we skip everything
        if (customDecorator.name === 'Omit') {
          this.omitFields.push(field.name);
          continue;
        }

        // if the element has an @Relation() decorator
        if (customDecorator.name === 'Relation') {
          // for now, we do nothing
          this.omitFields.push(field.name);
          continue;
        }

        // if the element has an @RelationId() decorator
        if (customDecorator.name === 'RelationId') {
          // for now, we do nothing
          this.omitFields.push(field.name);
          continue;
        }

        customDecoratorsContent =
          customDecoratorsContent + customDecorator.generateContent();
        this.addDecoratorToImport(customDecorator);
      }
    }

    let fieldDecoratorsAndCustomDecoratorsContent = '';
    fieldDecoratorsAndCustomDecoratorsContent =
      openApiDecoratorsContent + isOptionalDecorator + customDecoratorsContent;

    content = content.replace(
      /#{Decorators}/g,
      fieldDecoratorsAndCustomDecoratorsContent,
    );

    return content;
  }

  private addDecoratorToImport(decorator: DecoratorHelper) {
    let found = false;

    for (const existingDecorator of this.fieldDecorators) {
      if (
        decorator.name === existingDecorator.name &&
        decorator.importFrom === existingDecorator.importFrom
      ) {
        found = true;
        break;
      }
    }

    if (found === false) {
      this.fieldDecorators.push(decorator);
    }
  }

  private generateImportStatements(): string {
    let result = '';

    for (const decorator of this.fieldDecorators) {
      result = `${result}import {${decorator.name}} from '${decorator.importFrom}';\n`;
    }

    return result;
  }

  private parseDocumentation(field: DMMF.Field): DecoratorHelper[] {
    let documentation = field.documentation || '';

    documentation = documentation.replace(/(\r\n|\n|\r)/gm, ' ');

    const customDecorators = documentation.split(' ');

    const result: DecoratorHelper[] = [];

    for (const customDecorator of customDecorators) {
      const decoratorParamsIndex = customDecorator.indexOf('(');
      const decoratorParams = customDecorator.substring(
        decoratorParamsIndex + 1,
        customDecorator.lastIndexOf(')'),
      );

      const decoratorName = customDecorator.substring(0, decoratorParamsIndex);

      const decorator = new DecoratorHelper(
        decoratorName,
        this.config.InputValidatorPackage,
        decoratorParams,
      );

      result.push(decorator);
    }

    return result;
  }
}
