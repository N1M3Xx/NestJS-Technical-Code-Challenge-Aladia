import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

@Catch()
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();
      return response.status(status).json(res);
    }

    const error =
      exception instanceof RpcException ? exception.getError() : exception;

    const status =
      typeof error === 'object' && error !== null && 'statusCode' in error
        ? (error as { statusCode: number }).statusCode
        : HttpStatus.BAD_REQUEST;

    response.status(status).json(error);
  }
}
