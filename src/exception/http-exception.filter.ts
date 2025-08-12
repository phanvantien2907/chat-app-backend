import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class CatchEverythingFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const res = exception.getResponse();
    const msg =  typeof res === 'string' ? res  : typeof res === 'object' && res['message']   ? res['message']   : res;
    response.status(status).json(
      { statusCode: status,
        timestamp: new Date().toLocaleString('vi-VN', {timeZone: 'Asia/Bangkok'}),
        path: request.url,
        msg
      });
  }
}
