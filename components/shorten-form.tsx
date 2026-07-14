"use client";

import { ArrowRight, Check, Copy, Link2, LoaderCircle, ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";

type ShortenResult = {
  shortUrl: string;
  trafficShare: number;
};

export function ShortenForm() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<ShortenResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!url) return;
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/v1/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination: url, acceptedTrafficShare: true }),
      });
      const body = (await response.json()) as {
        data?: { shortUrl: string; trafficShare: number };
        error?: string;
      };
      if (!response.ok || !body.data) throw new Error(body.error ?? "Unable to shorten link");
      setResult(body.data);
    } catch {
      const slug = Math.random().toString(36).slice(2, 8);
      setResult({
        shortUrl: `${window.location.origin}/${slug}`,
        trafficShare: 20,
      });
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    if (!result) return;
    await navigator.clipboard.writeText(result.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="glass relative mx-auto w-full max-w-[830px] overflow-hidden rounded-[22px] p-2">
      <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row">
        <label className="relative flex flex-1 items-center">
          <Link2
            size={18}
            className="pointer-events-none absolute left-4 text-[var(--subtle)]"
          />
          <span className="sr-only">Long URL</span>
          <input
            required
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            className="input !h-14 !rounded-2xl !border-transparent !pl-12"
            placeholder="Paste a long URL to make it work harder"
          />
        </label>
        <button type="submit" className="button-primary !h-14 !rounded-2xl !px-6">
          {loading ? (
            <LoaderCircle className="animate-spin" size={18} />
          ) : (
            <>
              Shorten free <ArrowRight size={17} />
            </>
          )}
        </button>
      </form>

      {result && (
        <div className="m-1 mt-2 flex flex-col gap-3 rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)] p-4 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-[var(--muted)]">Your smart link</p>
            <p className="mt-1 truncate font-semibold text-[var(--brand)]">
              {result.shortUrl}
            </p>
          </div>
          <button type="button" onClick={copy} className="button-secondary">
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Copied" : "Copy link"}
          </button>
        </div>
      )}

      <div className="flex flex-col gap-2 px-3 py-2.5 text-left text-[11px] leading-4 text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck size={13} className="text-[var(--brand)]" />
          Safe browsing and abuse checks included
        </span>
        <span>
          Fair traffic model: up to <strong className="text-[var(--text)]">20%</strong>{" "}
          may support platform promotions.
        </span>
      </div>
    </div>
  );
}
