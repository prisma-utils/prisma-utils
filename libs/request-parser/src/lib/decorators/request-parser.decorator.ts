import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { RequestParserService } from '../services/request-parser.service';

export const RequestParser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return new RequestParserService().parseQuery(request.query);
  },
);
