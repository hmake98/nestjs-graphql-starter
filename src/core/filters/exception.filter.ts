import {
    ArgumentsHost,
    BadRequestException,
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
        const { req } = gqlHost.getContext();
        const lang = req?.headers['accept-language'] || 'en';

        if (exception instanceof HttpException) {
            if (exception instanceof BadRequestException) {
                const exceptionResponse = exception.getResponse();

                if (
                    typeof exceptionResponse === 'object' &&
                    exceptionResponse !== null
                ) {
                    const translatedResponse =
                        await this.translateStructuredResponse(
                            exceptionResponse,
                            lang
                        );
                    return new BadRequestException(translatedResponse);
                } else {
                    const message = await this.i18nService.translate(
                        exception.message,
                        { lang }
                    );
                    return new BadRequestException(message);
                }
            } else {
                const message = await this.i18nService.translate(
                    exception.message,
                    { lang }
                );
                return new HttpException(message, exception.getStatus());
            }
        }

        return exception;
    }

    private async translateStructuredResponse(
        response: Record<string, any>,
        lang: string
    ): Promise<Record<string, any>> {
        const translatedResponse = { ...response };

        if (Array.isArray(response.message)) {
            translatedResponse.message = await Promise.all(
                response.message.map((msg: string) =>
                    this.i18nService.translate(msg, { lang })
                )
            );
        } else if (typeof response.message === 'string') {
            translatedResponse.message = await this.i18nService.translate(
                response.message,
                { lang }
            );
        }

        return translatedResponse;
    }
}
