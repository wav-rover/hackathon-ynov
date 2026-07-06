import type { NextFunction, Request, Response } from "express";

import { HttpError } from "../errors/http-error.js";

type RateLimitOptions = {
  windowMs: number;
  maxRequests: number;
  message?: string;
};

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

export function createRateLimiter(options: RateLimitOptions) {
  const buckets = new Map<string, RateLimitBucket>();

  return function rateLimit(
    request: Request,
    _response: Response,
    next: NextFunction,
  ) {
    const now = Date.now();
    const key = `${request.ip}:${request.method}:${request.baseUrl}${request.path}`;
    const bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      buckets.set(key, {
        count: 1,
        resetAt: now + options.windowMs,
      });
      next();
      return;
    }

    bucket.count += 1;

    if (bucket.count > options.maxRequests) {
      throw new HttpError(
        429,
        options.message ?? "Too many requests, please try again later",
      );
    }

    if (buckets.size > 1000) {
      for (const [bucketKey, value] of buckets) {
        if (value.resetAt <= now) {
          buckets.delete(bucketKey);
        }
      }
    }

    next();
  };
}
