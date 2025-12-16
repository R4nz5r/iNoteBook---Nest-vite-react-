/* eslint-disable @typescript-eslint/no-require-imports */

import type { VercelRequest, VercelResponse } from '@vercel/node';

const { createApp } = require('../dist/main');

let server: any;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!server) {
    server = await createApp();
  }
  return server(req, res);
}
