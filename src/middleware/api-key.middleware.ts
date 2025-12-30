import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
    constructor(private configService: ConfigService) { }

    use(req: Request, res: Response, next: NextFunction) {
        const apiKey = req.headers['x-api-key'];
        const validApiKey = this.configService.get<string>('API_KEY');

        if (!validApiKey) {
            throw new UnauthorizedException('API Key validation failed');
        }

        if (apiKey !== validApiKey) {
            throw new UnauthorizedException('Invalid API Key');
        }

        next();
    }
}
