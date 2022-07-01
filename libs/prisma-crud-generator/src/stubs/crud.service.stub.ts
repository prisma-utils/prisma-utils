export const defaultCrudServiceStub = `/*
-----------------------------------------------------
THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
-----------------------------------------------------
*/
import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
const defaultPaginationOptions = {
  take: 20,
  skip: 0,
};
@Injectable()
export class __Class__CrudService {

  constructor(private readonly prismaClient: PrismaClient) {}
  async aggregate(data: Prisma.__Class__AggregateArgs) {
    try {
      const result = await this.prismaClient.__class__.aggregate(data);
      return result;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }
  async count(data: Prisma.__Class__CountArgs) {
    try {
      const result = await this.prismaClient.__class__.count(data);
      return result;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }
  async create(data: Prisma.__Class__CreateArgs) {
    try {
      const result = await this.prismaClient.__class__.create(data);
      return result;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }
  async delete(data: Prisma.__Class__DeleteArgs) {
    try {
      const result = await this.prismaClient.__class__.delete(data);
      return result;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }
  async deleteMany(data: Prisma.__Class__DeleteManyArgs) {
    try {
      const result = await this.prismaClient.__class__.deleteMany(data);
      return result;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }
  async findFirst(data: Prisma.__Class__FindFirstArgs) {
    try {
      const result = await this.prismaClient.__class__.findFirst(data);
      return result;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }
  async findMany(data: Prisma.__Class__FindManyArgs) {
    try {
      const result = await this.prismaClient.__class__.findMany(data);
      return result;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }
  async findUnique(data: Prisma.__Class__FindUniqueArgs) {
    try {
      const result = await this.prismaClient.__class__.findUnique(data);
      return result;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }
  async paginate(data: Prisma.__Class__FindManyArgs) {
    const [items, count] = await this.prismaClient.$transaction([
      this.prismaClient.__class__.findMany(data),
      this.prismaClient.__class__.count({ where: data.where }),
    ]);
    data.take = data.take || defaultPaginationOptions.take;
    data.skip = data.skip || defaultPaginationOptions.skip;
    return {
      data: items,
      meta: {
        totalCount: count,
        count: items.length,
        totalPages: Math.ceil(count / data.take),
        page: data.skip / data.take + 1,
      },
    };
  }
  async update(data: Prisma.__Class__UpdateArgs) {
    try {
      const result = await this.prismaClient.__class__.update(data);
      return result;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }
  async updateMany(data: Prisma.__Class__UpdateManyArgs) {
    try {
      const result = await this.prismaClient.__class__.updateMany(data);
      return result;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }
  async upsert(data: Prisma.__Class__UpsertArgs) {
    try {
      const result = await this.prismaClient.__class__.upsert(data);
      return result;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }
}
`;
