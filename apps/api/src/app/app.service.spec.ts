import { Test } from '@nestjs/testing';
import { PrismaModule, PrismaService } from '@prisma-utils/nestjs-prisma';

import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      imports: [PrismaModule.forRoot({ isGlobal: true })],
      providers: [AppService, PrismaService],
    }).compile();

    service = app.get<AppService>(AppService);
  });

  describe('getData', () => {
    it('should return "Welcome to api!"', () => {
      expect(service.getData()).toEqual({ message: 'Welcome to api!' });
    });
  });

  describe('getCount', () => {
    it('should return a count', async () => {
      expect(await service.getCount()).toBeGreaterThanOrEqual(0);
    });
  });
});
