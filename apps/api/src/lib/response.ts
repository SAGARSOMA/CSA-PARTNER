import type { Response } from 'express';

export interface PageMeta {
  page: number;
  pageSize: number;
  total: number;
}

export function sendData<T>(res: Response, data: T, meta?: PageMeta, status = 200): void {
  res.status(status).json(meta ? { data, meta } : { data });
}

export function errorBody(code: string, message: string, details?: unknown) {
  return { error: details === undefined ? { code, message } : { code, message, details } };
}
