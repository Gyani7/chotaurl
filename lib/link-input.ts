import { z } from "zod";

function isPrivateHostname(hostname: string) {
  const normalized = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (
    normalized === "localhost" ||
    normalized.endsWith(".localhost") ||
    normalized === "::1" ||
    normalized === "0.0.0.0"
  ) {
    return true;
  }
  const parts = normalized.split(".").map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part))) return false;
  return (
    parts[0] === 10 ||
    parts[0] === 127 ||
    (parts[0] === 169 && parts[1] === 254) ||
    (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
    (parts[0] === 192 && parts[1] === 168)
  );
}

export const destinationSchema = z
  .url()
  .refine((value) => {
    const url = new URL(value);
    return (
      ["http:", "https:"].includes(url.protocol) &&
      !url.username &&
      !url.password &&
      !isPrivateHostname(url.hostname)
    );
  }, {
    message: "Use a public HTTP or HTTPS destination without embedded credentials",
  })
  .refine((value) => {
    const appHostname = process.env.NEXT_PUBLIC_APP_URL
      ? new URL(process.env.NEXT_PUBLIC_APP_URL).hostname
      : "chotaurl.pro";
    return new URL(value).hostname !== appHostname;
  }, {
    message: "Short links cannot redirect back to the short-link domain",
  });

export const createLinkSchema = z.object({
  destination: destinationSchema,
  title: z.string().trim().max(120).optional(),
  alias: z
    .string()
    .trim()
    .min(3)
    .max(48)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
  password: z.string().min(6).max(128).optional(),
  expiresAt: z.iso.datetime().optional(),
  maxClicks: z.number().int().positive().max(1_000_000_000).optional(),
  trafficSharePercent: z.number().int().min(0).max(20).optional(),
  targeting: z
    .object({
      countries: z.record(z.string(), destinationSchema).optional(),
      devices: z.record(z.string(), destinationSchema).optional(),
      languages: z.record(z.string(), destinationSchema).optional(),
      fallback: destinationSchema.optional(),
    })
    .optional(),
  utm: z
    .object({
      source: z.string().max(100).optional(),
      medium: z.string().max(100).optional(),
      campaign: z.string().max(100).optional(),
      term: z.string().max(100).optional(),
      content: z.string().max(100).optional(),
    })
    .optional(),
  tags: z.array(z.string().trim().min(1).max(32)).max(20).default([]),
  acceptedTrafficShare: z.literal(true),
});

export type CreateLinkInput = z.infer<typeof createLinkSchema>;
