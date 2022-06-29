import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '@prisma-utils/nestjs-prisma';

import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [PrismaModule.forRoot({ isGlobal: true })],
      controllers: [AppController],
      providers: [AppService],
    }).compile();
  });

  describe('getData', () => {
    it('should return "Welcome to api!"', () => {
      const appController = app.get<AppController>(AppController);
      expect(
        appController.getData({
          page: 1,
          skip: 0,
          sort: [],
          take: 10,
        }),
      ).toEqual({ message: 'Welcome to api!' });
    });
  });
});
