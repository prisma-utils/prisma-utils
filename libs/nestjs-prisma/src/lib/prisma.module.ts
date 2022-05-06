import { DynamicModule, Module } from '@nestjs/common';
import { PRISMA_SERVICE_OPTIONS } from './constants';
import { PrismaModuleOptions } from './interfaces/prisma-module.options';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {
  static forRoot(options: PrismaModuleOptions = {}): DynamicModule {
    return {
      global: options.isGlobal,
      module: PrismaModule,
      providers: [
        {
          provide: PRISMA_SERVICE_OPTIONS,
          useValue: PrismaService,
        },
      ],
    };
  }
}
