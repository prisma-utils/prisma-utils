import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma-utils/nestjs-prisma';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [
          async (params, next) => {
            const before = Date.now();
            const result = await next(params);
            const after = Date.now();

            console.log(
              `Query ${params.model}.${params.action} took ${after - before}ms`,
            );

            return result;
          },
        ],
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
