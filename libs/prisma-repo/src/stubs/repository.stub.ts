export const repositoryStubWithExceptions = `/* eslint-disable */

/*
-----------------------------------------------------
THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
-----------------------------------------------------
*/

import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { #{Model}, Prisma } from '@prisma/client';
import { PaginationModel } from '@prisma-utils/nestjs-prisma';
import { PrismaService } from 'nestjs-prisma';
import { err, ok, Result } from 'neverthrow';

@Injectable()
export class #{RepositoryClassName} {
  constructor(private readonly prismaService: PrismaService) {}

  get prisma() {
    return this.prismaService;
  }

  async findMany(
    filter?: Prisma.#{Model}FindManyArgs,
  ): Promise<Result<PaginationModel<#{Model}>, Error>> {
    try {
      const [items, count] = await this.prismaService.$transaction([
        this.prismaService.#{moDel}.findMany(filter),
        this.prismaService.#{moDel}.count({ where: filter?.where }),
      ]);

      const take = filter?.take ? filter?.take : count;
      const skip = filter?.skip ? filter?.skip : 0;

      return ok({
        items: items,
        meta: {
          totalItems: count,
          items: items.length,
          totalPages: Math.ceil(count / take),
          page: skip / take + 1,
        },
      });
    } catch (e) {
      return err(
        new InternalServerErrorException(\`Could not get #{Model} Resources.\`),
      );
    }
  }

  async findUnique(
    where: Prisma.#{Model}WhereUniqueInput,
  ): Promise<Result<#{Model}, Error>> {
    try {
      const result = await this.prismaService.#{moDel}.findUniqueOrThrow({
        where: where,
      });
      return ok(result);
    } catch (e) {
      return err(new NotFoundException(\`#{Model} Resource was not found.\`));
    }
  }

  async create(data: Prisma.#{Model}CreateInput): Promise<Result<#{Model}, Error>> {
    try {
      const result = await this.prismaService.#{moDel}.create({ data: data });
      return ok(result);
    } catch (e) {
      return err(
        new InternalServerErrorException(\`Could not create #{Model} Resource.\`),
      );
    }
  }

  async update(
    where: Prisma.#{Model}WhereUniqueInput,
    data: Prisma.#{Model}UpdateInput,
  ): Promise<Result<#{Model}, Error>> {
    try {
      const result = await this.prismaService.#{moDel}.update({
        where: where,
        data: data,
      });
      return ok(result);
    } catch (e) {
      return err(
        new InternalServerErrorException(\`Could not update #{Model} Resource.\`),
      );
    }
  }

  async delete(
    where: Prisma.#{Model}WhereUniqueInput,
  ): Promise<Result<#{Model}, Error>> {
    try {
      const result = await this.prismaService.#{moDel}.delete({
        where: where,
      });
      return ok(result);
    } catch (e) {
      return err(
        new InternalServerErrorException(\`Could not delete #{Model} Resource.\`),
      );
    }
  }
}
`;

export const repositoryStub = `/* eslint-disable */

/*
-----------------------------------------------------
THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
-----------------------------------------------------
*/

import { Injectable } from '@nestjs/common';
import { Prisma, #{Model} } from '@prisma/client';
import { PaginationModel } from '@prisma-utils/nestjs-prisma';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class #{RepositoryClassName} {
  constructor(private readonly prismaService: PrismaService) {}

  getPrisma() {
    return this.prismaService;
  }

  async findMany(
    filter?: Prisma.#{Model}FindManyArgs,
  ): Promise<PaginationModel<#{Model}>> {
    const [items, count] = await this.prismaService.$transaction([
      this.prismaService.#{moDel}.findMany(filter),
      this.prismaService.#{moDel}.count({ where: filter?.where }),
    ]);

    const take = filter?.take ? filter?.take : count;
    const skip = filter?.skip ? filter?.skip : 0;

    return {
      items: items,
      meta: {
        totalItems: count,
        items: items.length,
        totalPages: Math.ceil(count / take),
        page: skip / take + 1,
      },
    };
  }

  async findUnique(where: Prisma.#{Model}WhereUniqueInput): Promise<#{Model}> {
    const result = await this.prismaService.#{moDel}.findUniqueOrThrow({
      where: where
    });
    return result;
  }

  async create(data: Prisma.#{Model}CreateInput): Promise<#{Model}> {
    const result = await this.prismaService.#{moDel}.create({ data: data });
    return result;
  }

  async update(
    where: Prisma.#{Model}WhereUniqueInput
    data: Prisma.#{Model}UpdateInput,
  ): Promise<#{Model}> {
    return await this.prismaService.#{moDel}.update({
      where: where
      data: data,
    });
  }

  async delete(where: Prisma.#{Model}WhereUniqueInput): Promise<#{Model}> {
    return await this.prismaService.#{moDel}.delete({ where: where });
  }
}
`;
