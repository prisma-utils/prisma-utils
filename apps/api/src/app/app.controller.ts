import { Controller, Get } from '@nestjs/common';
import {
  ParsedQueryModel,
  RequestParser,
} from '@prisma-utils/nestjs-request-parser';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData(@RequestParser() foo: ParsedQueryModel) {
    return this.appService.getData();
  }

  @Get('count')
  getCount() {
    return this.appService.getCount();
  }
}
