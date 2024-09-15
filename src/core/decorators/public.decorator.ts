import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const Public = (): CustomDecorator<string> =>
    SetMetadata('PUBLIC_ROUTE_KEY', true);
