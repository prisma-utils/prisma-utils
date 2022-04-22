import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma-utils/nestjs-prisma';

@Injectable()
export class AppService {
  constructor(private prismaService: PrismaService) {}

  async getData() {
    const amount = await this.prismaService.article.count();

    return { message: `Found ${amount} Articles.` };
  }
}
