import { DynamicModule, Module, Provider } from '@nestjs/common';
import {
  PrismaModuleAsyncOptions,
  PrismaModuleOptions,
  PrismaOptionsFactory,
} from './interfaces/prisma-module.options';
import { PRISMA_SERVICE_OPTIONS } from './constants';
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
          useValue: options.prismaServiceOptions,
        },
      ],
    };
  }

  static forRootAsync(options: PrismaModuleAsyncOptions): DynamicModule {
    return {
      global: options.isGlobal,
      module: PrismaModule,
      imports: options.imports || [],
      providers: this.createAsyncProviders(options),
    };
  }

  private static createAsyncProviders(
    options: PrismaModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return this.createAsyncOptionsProvider(options);
    }

    if (options.useClass) {
      return [
        ...this.createAsyncOptionsProvider(options),
        {
          provide: options.useClass,
          useClass: options.useClass,
        },
      ];
    }
    return [...this.createAsyncOptionsProvider(options)];
  }

  private static createAsyncOptionsProvider(
    options: PrismaModuleAsyncOptions,
  ): Provider[] {
    if (options.useFactory) {
      return [
        {
          provide: PRISMA_SERVICE_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
      ];
    }

    if (options.useExisting) {
      return [
        {
          provide: PRISMA_SERVICE_OPTIONS,
          useFactory: async (optionsFactory: PrismaOptionsFactory) =>
            await optionsFactory.createPrismaOptions(),
          inject: [options.useExisting],
        },
      ];
    }

    if (options.useClass) {
      return [
        {
          provide: PRISMA_SERVICE_OPTIONS,
          useFactory: async (optionsFactory: PrismaOptionsFactory) =>
            await optionsFactory.createPrismaOptions(),
          inject: [options.useClass],
        },
      ];
    }

    return [
      {
        provide: PRISMA_SERVICE_OPTIONS,
        useFactory: async (optionsFactory: PrismaOptionsFactory) =>
          await optionsFactory.createPrismaOptions(),
        inject: [],
      },
    ];
  }
}
