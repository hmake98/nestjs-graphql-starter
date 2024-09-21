import { Query, Resolver } from '@nestjs/graphql';
import { Public } from 'src/core/decorators/public.decorator';

@Resolver()
export class PingResolver {
    @Public()
    @Query(() => String)
    ping(): string {
        return 'pong!';
    }
}
