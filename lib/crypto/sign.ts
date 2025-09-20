import crypto from "node:crypto";
import { ENV } from '@/lib/env';

export function hmacSHA256(input: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(input).digest("hex");
}

export function signProxyUrl(rawUrl: string, secret = ENV.IMAGE_PROXY_SECRET || "") {
  return hmacSHA256(rawUrl, secret);
}
