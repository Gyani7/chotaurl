import { Redis } from "@upstash/redis";

let redis: Redis | null | undefined;

export function getRedis() {
  if (redis !== undefined) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  redis = url && token ? new Redis({ url, token }) : null;
  return redis;
}

export async function checkRateLimit(key: string, limit: number, windowSeconds: number) {
  const client = getRedis();
  if (!client) return { allowed: true, remaining: limit };

  const bucket = `rate:${key}:${Math.floor(Date.now() / (windowSeconds * 1000))}`;
  const count = await client.incr(bucket);
  if (count === 1) await client.expire(bucket, windowSeconds);
  return { allowed: count <= limit, remaining: Math.max(0, limit - count) };
}
