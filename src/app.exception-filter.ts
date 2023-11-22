import {
        ExceptionFilter,
        Catch,
        ArgumentsHost,
        HttpException,
        Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UserAlreadyExistsException } from './users/user-already-exists.exception';
import { InvalidCredentialsException } from './auth/invalid-credentials.exception';

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
        catch(exception: Error, host: ArgumentsHost): void {
                const ctx = host.switchToHttp();
                const response = ctx.getResponse<Response>();
                const request = ctx.getRequest<Request>();

                Logger.error(
                        JSON.stringify({
                                body: request.body,
                                url: request.url,
                                error: exception.message,
                                status:
                                        exception instanceof HttpException
                                                ? exception.getStatus()
                                                : null,
                                stack: exception.stack,
                        }),
                );

                if (exception instanceof HttpException) {
                        const status = exception.getStatus();
                        response.status(status).json({
                                statusCode: status,
                                timestamp: new Date().toISOString(),
                                path: request.url,
                                message: exception.message,
                        });
                        return;
                }

                if (exception instanceof PrismaClientKnownRequestError) {
                        response.status(400).json({
                                statusCode: 400,
                                timestamp: new Date().toISOString(),
                                path: request.url,
                        });
                        return;
                }

                if (exception instanceof UserAlreadyExistsException) {
                        response.status(400).json({
                                statusCode: 400,
                                timestamp: new Date().toISOString(),
                                path: request.url,
                                message: exception.message,
                        });
                        return;
                }

                if (exception instanceof InvalidCredentialsException) {
                        response.status(401).json({
                                statusCode: 401,
                                timestamp: new Date().toISOString(),
                                path: request.url,
                                message: exception.message,
                        });
                        return;
                }

                response.status(500).json({
                        statusCode: 500,
                        timestamp: new Date().toISOString(),
                        path: request.url,
                });
        }
}
