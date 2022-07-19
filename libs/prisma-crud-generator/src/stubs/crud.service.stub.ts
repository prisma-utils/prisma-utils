export const crudServiceStub = `/*
-----------------------------------------------------
THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
-----------------------------------------------------
*/

import { Injectable } from '@nestjs/common';
import { Prisma, #{Model} } from '@prisma/client';
import { PrismaService } from '@prisma-utils/nestjs-prisma';

@Injectable()
export class #{CrudServiceClassName} {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(filter?: Prisma.#{Model}FindManyArgs): Promise<#{Model}[] | null> {
    try {
      return await this.prismaService.#{model}.findMany(filter);
    } catch (e) {
      return null;
    }
  }

  async getById(id: string): Promise<#{Model} | null> {
    try {
      return await this.prismaService.#{model}.findUnique({ where: { id: id } });
    } catch (e) {
      return null;
    }
  }

  async create(data: Prisma.#{Model}CreateInput): Promise<#{Model} | null> {
    try {
      return await this.prismaService.#{model}.create({ data: data });
    } catch (e) {
      return null;
    }
  }

  async update(
    id: string,
    data: Prisma.#{Model}UpdateInput,
  ): Promise<#{Model} | null> {
    try {
      return await this.prismaService.#{model}.update({
        where: { id: id },
        data: data,
      });
    } catch (e) {
      return null;
    }
  }

  async delete(id: string): Promise<#{Model} | null> {
    try {
      return await this.prismaService.#{model}.delete({ where: { id: id } });
    } catch (e) {
      return null;
    }
  }

  async count(filter?: Prisma.#{Model}CountArgs): Promise<number | null> {
    try {
      return await this.prismaService.#{model}.count(filter);
    } catch (e) {
      return null;
    }
  }
}
`;
