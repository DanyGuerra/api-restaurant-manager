import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { businessIdHeader } from 'src/types/headers';
import { validate as isUuid } from 'uuid';

export const BusinessIdHeader = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const id = request.headers[businessIdHeader];

    if (!id) {
      throw new BadRequestException('Business id not provided');
    }
    if (!isUuid(id)) {
      throw new BadRequestException('Invalid business id, must be a UUID');
    }
    return id;
  },
);
