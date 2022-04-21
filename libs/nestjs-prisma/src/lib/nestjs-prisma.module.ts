import { Module } from '@nestjs/common';
import { NestjsPrismaService } from './nestjs-prisma.service';

@Module({
  controllers: [],
  providers: [NestjsPrismaService],
  exports: [NestjsPrismaService],
})
export class NestjsPrismaModule {}
