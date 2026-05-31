import { Response } from 'express';

export function success(res: Response, data: any, message?: string) {
  return res.json({ success: true, data, message });
}

export function fail(res: Response, message: string, status = 400) {
  return res.status(status).json({ success: false, message });
}
