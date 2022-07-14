import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestQueryOptions } from '../models/request-query.options';

import { RequestParserService } from '../services/request-parser.service';

export const RequestParser = createParamDecorator(
  (data: Partial<RequestQueryOptions>, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return new RequestParserService().parseQuery(request.query, data);
  },
);
