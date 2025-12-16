import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApp } from '../src/main';

let server: any;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!server) {
    server = await createApp();
  }
  server(req, res);
}
