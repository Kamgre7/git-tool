import { Request } from 'express';
import { ParsedQs } from 'qs';

export type ExpressRequest<
  T extends {
    query?: Record<string, unknown>;
    body?: Record<string, unknown>;
    params?: Record<string, unknown>;
    locals: Record<string, unknown>;
  }
> = Request<T['params'], {}, T['body'], T['query'] & ParsedQs, T['locals']>;

export type ParsedRequest<
  T extends {
    query?: Record<string, unknown>;
    body?: Record<string, unknown>;
    params?: Record<string, unknown>;
  }
> = ExpressRequest<T & { locals: {} }>;
