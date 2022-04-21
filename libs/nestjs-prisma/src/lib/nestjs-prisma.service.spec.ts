import { Test } from '@nestjs/testing';
import { NestjsPrismaService } from './nestjs-prisma.service';

describe('NestjsPrismaService', () => {
  let service: NestjsPrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [NestjsPrismaService],
    }).compile();

    service = module.get(NestjsPrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
