import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma-utils/nestjs-prisma';

@Injectable()
export class AppService {
  constructor(private prismaService: PrismaService) {}

  getData() {
    return { message: `Welcome to api!` };
  }

  async getCount() {
    const count = this.prismaService.article.count();
    return count;
  }
}
