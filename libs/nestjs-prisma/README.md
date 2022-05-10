# nestjs-prisma

Add Prisma Support to your NestJS application.

## Installation

Install the library by running

```bash
npm install @prisma-utils/nestjs-prisma
```

## Usage

The library provides two main classes, the `PrismaModule` and the `PrismaService`.

Add the `PrismaModule` to the `imports` section of your main `AppModule` (or any other module) in the NestJS application.

```ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma-utils/nestjs-prisma';

@Module({
  imports: [PrismaModule.forRoot()],
})
export class AppModule {}
```

### Configuration

The `PrismaModule` offers some configuration options that can be passed to the `forRoot()` method and are forwarded to the `PrismaClient`.

#### Make the Module globally available

Simply pass the `isGlobal` parameter and set it to true. This will register the module as a [global module](https://docs.nestjs.com/modules#global-modules) (i.e., the module context is available in all other sub modules).

```ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma-utils/nestjs-prisma';

@Module({
  imports: [PrismaModule.forRoot({ isGlobal: true })],
})
export class AppModule {}
```

## Contribution

You can easily create an issue and request additional features or fix bugs.

### Building

Run `nx build nestjs-prisma` to build the library.

### Running unit tests

Run `nx test nestjs-prisma` to execute the unit tests via [Jest](https://jestjs.io).

### Running lint

Run `nx lint nestjs-prisma` to execute the lint via [ESLint](https://eslint.org/).
