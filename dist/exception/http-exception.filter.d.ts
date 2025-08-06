import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
export declare class CatchEverythingFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost): void;
}
