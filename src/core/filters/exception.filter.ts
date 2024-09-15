import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
} from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { I18nService } from 'nestjs-i18n';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(private readonly i18nService: I18nService) {}

    async catch(exception: unknown, host: ArgumentsHost) {
        const gqlHost = GqlArgumentsHost.create(host);
        const request = gqlHost.getContext().req;

        if (exception instanceof HttpException) {
            const message = await this.i18nService.translate(
                exception.message,
                {
                    lang: request?.headers['accept-language'] || 'en',
                }
            );

            const updatedException = new HttpException(
                message,
                exception.getStatus()
            );

            return updatedException;
        } else {
            return exception;
        }
    }
}
