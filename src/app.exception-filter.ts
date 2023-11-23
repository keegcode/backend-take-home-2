import {
        ExceptionFilter,
        Catch,
        ArgumentsHost,
        HttpException,
        Logger,
} from '@nestjs/common';
import e, { Request, Response } from 'express';
import { SessionEntity } from './auth/domain/session.entity';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UserAlreadyExistsException } from './auth/domain/user-already-exists.exception';
import { InvalidCredentialsException } from './auth/domain/invalid-credentials.exception';

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
        catch(exception: Error, host: ArgumentsHost): void {
                const ctx = host.switchToHttp();
                const response = ctx.getResponse<Response>();
                const request: Request & { session?: SessionEntity } =
                        ctx.getRequest<Request>();

                Logger.error(this.stringifyException(exception, request));

                if (exception instanceof HttpException) {
                        response.status(exception.getStatus()).json({
                                statusCode: exception.getStatus(),
                                timestamp: new Date().toISOString(),
                                path: request.url,
                                message: exception.message,
                        });
                        return;
                }

                const httpException = this.getHttpException(exception);

                response.status(httpException.statusCode).json({
                        ...httpException,
                        timestamp: new Date().toISOString(),
                        path: request.url,
                });
        }

        private getHttpException(exception: Error): {
                statusCode: number;
                message?: string;
        } {
                switch (exception.constructor.name) {
                        case UserAlreadyExistsException.name:
                                return {
                                        statusCode: 400,
                                        message: exception.message,
                                };
                        case InvalidCredentialsException.name:
                                return {
                                        statusCode: 400,
                                        message: exception.message,
                                };
                        default:
                                return { statusCode: 500 };
                }
        }

        private stringifyException(
                exception: Error,
                request: Request & { session?: SessionEntity },
        ): string {
                return JSON.stringify({
                        body: request.body,
                        url: request.url,
                        error: exception.message,
                        status:
                                exception instanceof HttpException
                                        ? exception.getStatus()
                                        : null,
                        stack: exception.stack,
                        response:
                                exception instanceof HttpException
                                        ? exception.getResponse()
                                        : null,
                });
        }
}
