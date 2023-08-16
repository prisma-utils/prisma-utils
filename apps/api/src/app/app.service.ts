import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getData() {
    return { message: `Welcome to api!` };
  }

  async getCount() {
    const count = 5;
    return count;
  }
}
