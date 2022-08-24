import { DMMF } from '@prisma/generator-helper';
import { DecoratorHelper } from './decorator.helper';

export const primitiveTypeMap: Record<any, string> = {
  bigInt: 'BigInt',
  boolean: 'boolean',
  bytes: 'Buffer',
  datetime: 'Date',
  decimal: 'number',
  float: 'number',
  int: 'number',
  json: 'JSON',
  string: 'string',
};

export class PrismaHelper {
  static instance: PrismaHelper;

  static getInstance() {
    if (PrismaHelper.instance) {
      return PrismaHelper.instance;
    }
    PrismaHelper.instance = new PrismaHelper();
    return PrismaHelper.instance;
  }

  public getPrimitiveMapTypeFromDMMF(field: DMMF.Field): string {
    if (typeof field.type !== 'string') {
      return 'unknown';
    }
    return primitiveTypeMap[field.type.toLowerCase()];
  }

  public generateSwaggerDecoratorsFromDMMF(
    field: DMMF.Field,
  ): DecoratorHelper[] {
    const decorators: DecoratorHelper[] = [];

    if (field.isRequired) {
      decorators.push(new DecoratorHelper('ApiProperty', '@nestjs/swagger'));
    } else {
      decorators.push(
        new DecoratorHelper(
          'ApiProperty',
          '@nestjs/swagger',
          JSON.stringify({
            required: false,
          }),
        ),
      );
    }

    return decorators;
  }
}
