import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApp } from '../main';

let server: any;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!server) {
    server = await createApp();
  }
  return server(req, res);
}
