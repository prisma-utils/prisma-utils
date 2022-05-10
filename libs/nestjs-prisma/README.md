# @prisma-utils/nestjs-prisma

Add Prisma Support to your NestJS application.

## Installation

```bash
# npm
npm install @prisma-utils/nestjs-prisma

# yarn
yarn add @prisma-utils/nestjs-prisma
```

## Usage

Add `PrismaModule` to the `imports` section in your `AppModule` or other modules to gain access to `PrismaService`.

```ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma-utils/nestjs-prisma';

@Module({
  imports: [PrismaModule.forRoot()],
})
export class AppModule {}
```

#### Shutdown Hook

Handle Prisma [shutdown](https://docs.nestjs.com/recipes/prisma#issues-with-enableshutdownhooks) signal to shutdown your Nest application.

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from '@prisma-utils/nestjs-prisma';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // enable shutdown hook
  const prismaService: PrismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);

  await app.listen(3000);
}
bootstrap();
```

#### Prisma Middleware

Apply [Prisma Middlewares](https://www.prisma.io/docs/concepts/components/prisma-client/middleware) with `PrismaModule`

```ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma-utils/nestjs-prisma';
import { loggingMiddleware } from './logging-middleware';

@Module({
  imports: [
    PrismaModule.forRoot({
      prismaServiceOptions: {
        middlewares: [
          async (params, next) => {
            // Before query: change params
            const result = await next(params);
            // After query: result
            return result;
          },
        ], // see example loggingMiddleware below
      },
    }),
  ],
})
export class AppModule {}
```

Here is an example for using a [Logging middleware](https://www.prisma.io/docs/concepts/components/prisma-client/middleware/logging-middleware).

Create your Prisma Middleware and export it as a `function`

```ts
// src/logging-middleware.ts
import { Prisma } from '@prisma/client';

export function loggingMiddleware(): Prisma.Middleware {
  return async (params, next) => {
    const before = Date.now();

    const result = await next(params);

    const after = Date.now();

    console.log(
      `Query ${params.model}.${params.action} took ${after - before}ms`,
    );

    return result;
  };
}
```

Now import your Middleware and add the function into the `middlewares` array.

```ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma-utils/nestjs-prisma';
import { loggingMiddleware } from './logging-middleware';

@Module({
  imports: [
    PrismaModule.forRoot({
      prismaServiceOptions: {
        middlewares: [loggingMiddleware()],
      },
    }),
  ],
})
export class AppModule {}
```

#### `PrismaModule` configuration

`PrismaModule` allows to be used [globally](https://docs.nestjs.com/modules#global-modules) and to pass options to the `PrismaClient`.

```ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma-utils/nestjs-prisma';

@Module({
  imports: [
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        prismaOptions: { log: ['info'] },
        explicitConnect: true,
      },
    }),
  ],
})
export class AppModule {}
```

Additionally, `PrismaModule` provides a `forRootAsync` to pass options asynchronously. One option is to use a factory function:

```ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma-utils/nestjs-prisma';

@Module({
  imports: [
    PrismaModule.forRootAsync({
      isGlobal: true,
      useFactory: () => ({
        prismaOptions: {
          log: ['info', 'query'],
        },
        explicitConnect: false,
      }),
    }),
  ],
})
export class AppModule {}
```

You can inject dependencies such as `ConfigModule` to load options from .env files.

```ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from '@prisma-utils/nestjs-prisma';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule.forRootAsync({
      isGlobal: true,
      useFactory: async (configService: ConfigService) => {
        return {
          prismaOptions: {
            log: [configService.get('log')],
            datasources: {
              db: {
                url: configService.get('DATABASE_URL'),
              },
            },
          },
          explicitConnect: configService.get('explicit'),
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

Alternatively, you can use a class instead of a factory:

```ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma-utils/nestjs-prisma';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule.forRootAsync({
      isGlobal: true,
      useClass: PrismaConfigService,
    }),
  ],
})
export class AppModule {}
```

Create the `PrismaConfigService` and extend it with the `PrismaOptionsFactory`

```ts
import { Injectable } from '@nestjs/common';
import {
  PrismaOptionsFactory,
  PrismaServiceOptions,
} from '@prisma-utils/nestjs-prisma';

@Injectable()
export class PrismaConfigService implements PrismaOptionsFactory {
  constructor() {
    // TODO inject any other service here like the `ConfigService`
  }

  createPrismaOptions(): PrismaServiceOptions | Promise<PrismaServiceOptions> {
    return {
      prismaOptions: {
        log: ['info', 'query'],
      },
      explicitConnect: true,
    };
  }
}
```

## Contribution

You can easily create an issue and request additional features or fix bugs.

### Building

Run `nx build nestjs-prisma` to build the library.

### Running unit tests

Run `nx test nestjs-prisma` to execute the unit tests via [Jest](https://jestjs.io).

### Running lint

Run `nx lint nestjs-prisma` to execute the lint via [ESLint](https://eslint.org/).
