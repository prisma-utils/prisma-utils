import { DMMF } from '@prisma/generator-helper';
import { DecoratorHelper } from './decorator.helper';

interface TypeMap {
  tsType: string;
  validators: DecoratorHelper[];
}

export class PrismaHelper {
  static instance: PrismaHelper;

  private primitiveTypeMap(validatorClass: string): Record<any, TypeMap> {
    return {
      bigint: {
        tsType: 'BigInt',
        validators: [new DecoratorHelper('IsNumber', validatorClass)],
      },
      boolean: {
        tsType: 'boolean',
        validators: [new DecoratorHelper('IsBoolean', validatorClass)],
      },
      bytes: {
        tsType: 'Buffer',
        validators: [],
      },
      datetime: {
        tsType: 'Date',
        validators: [new DecoratorHelper('IsDate', validatorClass)],
      },
      decimal: {
        tsType: 'number',
        validators: [new DecoratorHelper('IsNumber', validatorClass)],
      },
      float: {
        tsType: 'number',
        validators: [new DecoratorHelper('IsNumber', validatorClass)],
      },
      int: {
        tsType: 'number',
        validators: [new DecoratorHelper('IsInt', validatorClass)],
      },
      json: {
        tsType: 'object',
        validators: [new DecoratorHelper('IsObject', validatorClass)],
      },
      string: {
        tsType: 'string',
        validators: [new DecoratorHelper('IsString', validatorClass)],
      },
    };
  }

  static getInstance() {
    if (PrismaHelper.instance) {
      return PrismaHelper.instance;
    }
    PrismaHelper.instance = new PrismaHelper();
    return PrismaHelper.instance;
  }

  public getMapTypeFromDMMF(
    field: DMMF.Field,
    validatorClass = 'class-validator',
  ): TypeMap {
    const mapTypes = this.primitiveTypeMap(validatorClass);
    const mapType = mapTypes[field.type.toLowerCase()];

    if (!mapType) {
      return {
        tsType: 'unknown',
        validators: [new DecoratorHelper('IsDefined', validatorClass)],
      };
    }

    return mapType;
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
