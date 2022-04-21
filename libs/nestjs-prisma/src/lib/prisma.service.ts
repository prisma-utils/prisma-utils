import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaService {
  public helloWorld() {
    return 'Hello World';
  }
}
