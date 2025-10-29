import { NextResponse } from "next/server";

export const runtime = "edge";

type SubscribeBody = {
  email: string;
  ip?: string;
  ua?: string;
  referrer?: string;
};

function toHex(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    const s = bytes[i].toString(16).padStart(2, "0");
    hex += s;
  }
  return hex;
}

async function hmacSha256Hex(secret: string, message: string) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return toHex(signature);
}

export async function POST(req: Request) {
  try {
    const webhookUrl = process.env.SUSCRIBE_WEBHOOK;
    const secret = process.env.BLOCKCHAIN_CENTER_SECRET;
    if (!webhookUrl) {
      return NextResponse.json(
        { ok: false, error: "Missing SUSCRIBE_WEBHOOK" },
        { status: 500 }
      );
    }
    if (!secret) {
      return NextResponse.json(
        { ok: false, error: "Missing BLOCKCHAIN_CENTER_SECRET" },
        { status: 500 }
      );
    }

    const inbound = (await req.json()) as Partial<SubscribeBody>;
    if (!inbound?.email || typeof inbound.email !== "string" || !inbound.email.includes("@")) {
      return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
    }

    const ipHeader = req.headers.get("x-forwarded-for") || "";
    const ip = (inbound.ip as string | undefined) ?? (ipHeader.split(",")[0] || undefined);
    const ua = (inbound.ua as string | undefined) ?? (req.headers.get("user-agent") ?? undefined);
    const referrer = (inbound.referrer as string | undefined) ?? (req.headers.get("referer") ?? undefined);

    const payload = {
      email: inbound.email,
      ip,
      ua,
      referrer,
    } satisfies SubscribeBody;

    const raw = JSON.stringify(payload);
    const signatureHex = await hmacSha256Hex(secret, raw);

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-signature": signatureHex,
      },
      body: raw,
    });

    if (!res.ok) {
      let errorMessage = `Webhook error (${res.status})`;
      try {
        const j = await res.json();
        if (j?.error) errorMessage = String(j.error);
      } catch {}
      return NextResponse.json({ ok: false, error: errorMessage }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: "Invalid request" },
      { status: 400 }
    );
  }
}


