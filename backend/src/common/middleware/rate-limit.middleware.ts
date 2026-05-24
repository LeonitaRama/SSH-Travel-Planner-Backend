// src/common/middleware/rate-limit.middleware.ts
import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

interface RateLimitEntry {
  count: number;
  firstRequest: number;
}

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private requests: Map<string, RateLimitEntry> = new Map();
  private readonly WINDOW_MS = 60 * 1000; // 1 minutë
  private readonly MAX_REQUESTS = 100; // Maksimumi 100 kërkesa për minutë

  use(req: Request, res: Response, next: NextFunction): void {
    const key = `${req.headers['x-tenant-id'] || 'anonymous'}:${req.ip}`;
    const now = Date.now();

    const entry = this.requests.get(key);

    if (entry) {
      if (now - entry.firstRequest < this.WINDOW_MS) {
        if (entry.count >= this.MAX_REQUESTS) {
          throw new HttpException(
            'Too many requests. Please try again later.',
            HttpStatus.TOO_MANY_REQUESTS,
          );
        }
        entry.count++;
      } else {
        // Reset counter
        this.requests.set(key, { count: 1, firstRequest: now });
      }
    } else {
      this.requests.set(key, { count: 1, firstRequest: now });
    }

    // Clean old entries every minute
    setTimeout(() => {
      this.requests.forEach((value, mapKey) => {
        if (now - value.firstRequest > this.WINDOW_MS) {
          this.requests.delete(mapKey);
        }
      });
    }, this.WINDOW_MS);

    next();
  }
}
