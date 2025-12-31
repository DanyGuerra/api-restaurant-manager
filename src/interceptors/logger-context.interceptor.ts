
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class LoggerContextInterceptor implements NestInterceptor {
    constructor(private readonly logger: PinoLogger) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const className = context.getClass().name;
        this.logger.assign({ context: className });

        return next.handle();
    }
}
