export const crudServiceStub = `/* 
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
export class #{NAME} {
  
  constructor(private readonly prismaClient: PrismaClient) {}

  async aggregate(data: Prisma.#{MODEL}AggregateArgs) {
    try {
      const result = await this.prismaClient.#{model}.aggregate(data);
      return result;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }

  async count(data: Prisma.#{MODEL}CountArgs) {
    try {
      const result = await this.prismaClient.#{model}.count(data);
      return result;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }

  async create(data: Prisma.#{MODEL}CreateArgs) {
    try {
      const result = await this.prismaClient.#{model}.create(data);
      return result;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }

  async delete(data: Prisma.#{MODEL}DeleteArgs) {
    try {
      const result = await this.prismaClient.#{model}.delete(data);
      return result;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }

  async deleteMany(data: Prisma.#{MODEL}DeleteManyArgs) {
    try {
      const result = await this.prismaClient.#{model}.deleteMany(data);
      return result;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }

  async findFirst(data: Prisma.#{MODEL}FindFirstArgs) {
    try {
      const result = await this.prismaClient.#{model}.findFirst(data);
      return result;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }

  async findMany(data: Prisma.#{MODEL}FindManyArgs) {
    try {
      const result = await this.prismaClient.#{model}.findMany(data);
      return result;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }

  async findUnique(data: Prisma.#{MODEL}FindUniqueArgs) {
    try {
      const result = await this.prismaClient.#{model}.findUnique(data);
      return result;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }

  async paginate(data: Prisma.#{MODEL}FindManyArgs) {
    const [items, count] = await this.prismaClient.$transaction([
      this.prismaClient.#{model}.findMany(data),
      this.prismaClient.#{model}.count({ where: data.where }),
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

  async update(data: Prisma.#{MODEL}UpdateArgs) {
    try {
      const result = await this.prismaClient.#{model}.update(data);
      return result;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }

  async updateMany(data: Prisma.#{MODEL}UpdateManyArgs) {
    try {
      const result = await this.prismaClient.#{model}.updateMany(data);
      return result;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }

  async upsert(data: Prisma.#{MODEL}UpsertArgs) {
    try {
      const result = await this.prismaClient.#{model}.upsert(data);
      return result;
    } catch (exception: any) {
      throw new Error(exception);
    }
  }
}
`;
