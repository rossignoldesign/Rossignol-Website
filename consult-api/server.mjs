import cors from "cors";
import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PORT = Number(process.env.PORT) || 8787;
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const DEFAULT_FROM = "Rossignol Design <hello@mail.rossignoldesign.com>";
const MAIL_FROM = resolveMailFrom(process.env.MAIL_FROM);
const MAIL_TO = process.env.MAIL_TO || "";
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SLOT_RE = /^\d{4}-\d{2}-\d{2}T(09|1[0-7])$/;
const MAX_OVERVIEW = 8000;
const BOOKINGS_PATH = process.env.BOOKINGS_PATH || path.join(path.dirname(fileURLToPath(import.meta.url)), "bookings.json");

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "32kb" }));
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }
      if (ALLOWED_ORIGINS.length === 0 || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
  })
);

app.get("/health", (_req, res) => {
  const fromDomain = (MAIL_FROM.match(/@([^>\s]+)/) || [])[1] || "unset";
  res.json({ ok: true, fromDomain });
});

app.get("/consult/slots", (_req, res) => {
  res.json({ ok: true, slots: readSlots() });
});

app.post("/consult", async (req, res) => {
  try {
    if (typeof req.body?.website === "string" && req.body.website.trim()) {
      res.json({ ok: true });
      return;
    }

    const payload = normalize(req.body);
    const errors = validate(payload);
    if (errors.length) {
      res.status(400).json({ ok: false, errors });
      return;
    }
    if (!RESEND_API_KEY || !MAIL_TO) {
      res.status(503).json({ ok: false, errors: ["Mail is not configured."] });
      return;
    }
    if (payload.scheduleSlot && !SLOT_RE.test(payload.scheduleSlot)) {
      res.status(400).json({ ok: false, errors: ["Please choose a valid time."] });
      return;
    }
    if (payload.scheduleSlot && readSlots().includes(payload.scheduleSlot)) {
      res.status(409).json({ ok: false, errors: ["That time is no longer available. Please choose another."] });
      return;
    }

    await sendMail({
      to: MAIL_TO,
      replyTo: payload.email,
      subject: `Consultation request — ${payload.name}`,
      html: studioHtml(payload),
      text: studioText(payload),
    });

    try {
      await sendMail({
        to: payload.email,
        subject: "We received your Rossignol Design consultation request",
        html: visitorHtml(payload),
        text: visitorText(payload),
      });
    } catch (error) {
      console.error("Visitor confirmation failed:", error);
    }

    if (payload.scheduleSlot) {
      const taken = readSlots();
      if (!taken.includes(payload.scheduleSlot)) {
        taken.push(payload.scheduleSlot);
        writeSlots(taken);
      }
    }

    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, errors: [publicMailError(error)] });
  }
});

app.listen(PORT, () => {
  const fromDomain = (MAIL_FROM.match(/@([^>\s]+)/) || [])[1] || "unset";
  console.log(`Consult API listening on ${PORT}; from domain ${fromDomain}`);
});

function resolveMailFrom(raw) {
  const value = String(raw || "").trim().replace(/^["']|["']$/g, "");
  const domain = ((value.match(/@([^>\s]+)/) || [])[1] || "").toLowerCase();
  if (domain === "mail.rossignoldesign.com" || domain === "rossignoldesign.com") {
    return value;
  }
  return DEFAULT_FROM;
}

function normalize(body) {
  const read = (key) => (typeof body?.[key] === "string" ? body[key].trim() : "");
  return {
    name: read("name"),
    email: read("email"),
    organization: read("organization"),
    grantType: read("grantType"),
    timeline: read("timeline"),
    schedule: read("schedule"),
    scheduleSlot: read("scheduleSlot"),
    overview: read("overview").slice(0, MAX_OVERVIEW),
  };
}

function readSlots() {
  try {
    const raw = fs.readFileSync(BOOKINGS_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed?.slots) ? parsed.slots.filter((slot) => SLOT_RE.test(slot)) : [];
  } catch {
    return [];
  }
}

function writeSlots(slots) {
  fs.mkdirSync(path.dirname(BOOKINGS_PATH), { recursive: true });
  fs.writeFileSync(BOOKINGS_PATH, JSON.stringify({ slots }, null, 2));
}

function validate(payload) {
  const errors = [];
  if (!payload.name) errors.push("Name is required.");
  if (!EMAIL_RE.test(payload.email)) errors.push("A valid email is required.");
  if (!payload.organization) errors.push("Please tell us what best describes you.");
  return errors;
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function row(label, value) {
  const display = value || "—";
  return `<tr><th align="left" style="padding:6px 12px 6px 0;font-weight:600;color:#32615F;vertical-align:top;">${label}</th><td style="padding:6px 0;color:#0D1B31;">${escapeHtml(display)}</td></tr>`;
}

function studioHtml(payload) {
  return `<div style="font-family:Lexend,Helvetica,Arial,sans-serif;background:#F4F4E8;color:#0D1B31;padding:24px;">
  <h1 style="font-size:20px;margin:0 0 16px;">New consultation request</h1>
  <table style="font-size:15px;line-height:1.5;">
    ${row("Name", payload.name)}
    ${row("Email", payload.email)}
    ${row("Describes", payload.organization)}
    ${row("Help with", payload.grantType)}
    ${row("Timeline", payload.timeline)}
    ${row("Schedule", payload.schedule)}
    ${row("Overview", payload.overview)}
  </table>
</div>`;
}

function studioText(payload) {
  return [
    "New consultation request",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Describes: ${payload.organization || "—"}`,
    `Help with: ${payload.grantType || "—"}`,
    `Timeline: ${payload.timeline || "—"}`,
    `Schedule: ${payload.schedule || "—"}`,
    `Overview: ${payload.overview || "—"}`,
  ].join("\n");
}

function visitorHtml(payload) {
  return `<div style="font-family:Lexend,Helvetica,Arial,sans-serif;background:#F4F4E8;color:#0D1B31;padding:24px;line-height:1.6;">
  <p style="margin:0 0 12px;">Hello ${escapeHtml(payload.name)},</p>
  <p style="margin:0 0 12px;">Thank you for writing to Rossignol Design. We have received your consultation request and will follow up shortly.</p>
  <p style="margin:0;">In the meantime, keep notes on your objectives, audiences, and timeline — that will make the discovery conversation more useful.</p>
  <p style="margin:24px 0 0;color:#32615F;">Rossignol Design<br>Knowledge Translation &amp; Mobilization</p>
</div>`;
}

function visitorText(payload) {
  return `Hello ${payload.name},

Thank you for writing to Rossignol Design. We have received your consultation request and will follow up shortly.

In the meantime, keep notes on your objectives, audiences, and timeline — that will make the discovery conversation more useful.

Rossignol Design
Knowledge Translation & Mobilization`;
}

async function sendMail({ to, subject, html, text, replyTo }) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: MAIL_FROM,
      to: [to],
      subject,
      html,
      text,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Resend ${response.status}: ${detail}`);
  }
}

function publicMailError(error) {
  const detail = String(error?.message || "");
  if (detail.includes("Resend 401") || detail.includes("Resend 403")) {
    return "Mail was rejected. Check the Resend API key, and send only to the email on that Resend account until the domain is verified.";
  }
  if (detail.includes("Resend 422") || /from/i.test(detail)) {
    return "Mail was rejected. Check MAIL_FROM is Rossignol Design <hello@mail.rossignoldesign.com>.";
  }
  return "Could not send the request. Please try again.";
}
