import "server-only";
import { Resend } from "resend";
import { APP_URL } from "@/lib/env";

// Resend client — re-uses one instance per Node process.
const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_NOTIFICATIONS =
  process.env.RESEND_FROM_NOTIFICATIONS ?? "notifications@boostsmall.com";
const REPLY_TO = process.env.RESEND_REPLY_TO ?? "hello@boostsmall.com";

interface BaseSendArgs {
  to: string;
  toName?: string | null;
}

interface BusinessApprovedArgs extends BaseSendArgs {
  businessName: string;
  businessSlug: string;
  approvedByName?: string | null;
}

interface BusinessRejectedArgs extends BaseSendArgs {
  businessName: string;
  reason: string;
}

interface BusinessClaimedArgs extends BaseSendArgs {
  businessName: string;
  businessSlug: string;
  ownerName: string;
}

export async function sendBusinessApprovedEmail(args: BusinessApprovedArgs) {
  const subject = `${args.businessName} is live on boostsmall`;
  const url = `${APP_URL}/b/${args.businessSlug}`;
  const greeting = args.toName ? `Hi ${args.toName},` : "Hi,";

  return safeSend({
    to: args.to,
    subject,
    html: layout({
      headline: "Your submission is approved.",
      body: `
        <p>${greeting}</p>
        <p>Thanks for submitting <strong>${escapeHtml(args.businessName)}</strong> — a moderator just approved it. It's now live on boostsmall and will start showing up in search.</p>
        <p>${args.approvedByName ? `Approved by ${escapeHtml(args.approvedByName)}.` : ""}</p>
      `,
      ctaLabel: "View the listing",
      ctaUrl: url,
      footerNote:
        "Independent businesses only — that's the whole platform. Thanks for helping us find one more.",
    }),
  });
}

export async function sendBusinessRejectedEmail(args: BusinessRejectedArgs) {
  const subject = `About your boostsmall submission: ${args.businessName}`;
  const greeting = args.toName ? `Hi ${args.toName},` : "Hi,";

  return safeSend({
    to: args.to,
    subject,
    html: layout({
      headline: "Your submission wasn't approved.",
      body: `
        <p>${greeting}</p>
        <p>A moderator reviewed <strong>${escapeHtml(args.businessName)}</strong> and decided not to publish it. Here's the reason:</p>
        <blockquote style="border-left: 3px solid #c97b5a; padding: 8px 16px; margin: 16px 0; color: #6f6a5d; background: #faf5e8;">
          ${escapeHtml(args.reason)}
        </blockquote>
        <p>If you think this was the wrong call, reply to this email and we'll take another look.</p>
      `,
      footerNote:
        "boostsmall is for independent, family-owned businesses with no chain affiliation. We err on the side of strict — sorry if that bit you.",
    }),
  });
}

export async function sendBusinessClaimedEmail(args: BusinessClaimedArgs) {
  const subject = `${args.businessName} just got claimed`;
  const url = `${APP_URL}/b/${args.businessSlug}`;

  return safeSend({
    to: args.to,
    subject,
    html: layout({
      headline: "Heads up — a new owner just verified.",
      body: `
        <p><strong>${escapeHtml(args.ownerName)}</strong> just claimed <strong>${escapeHtml(args.businessName)}</strong> as a verified owner. They can now edit the listing, respond to reviews, and upload photos.</p>
      `,
      ctaLabel: "View the listing",
      ctaUrl: url,
    }),
  });
}

// ─── helpers ────────────────────────────────────────────────────────────────

interface SendArgs {
  to: string;
  subject: string;
  html: string;
}

async function safeSend(args: SendArgs): Promise<{ ok: boolean; error?: string }> {
  if (!process.env.RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY not set — skipping send to", args.to);
    return { ok: false, error: "no-api-key" };
  }
  try {
    const result = await resend.emails.send({
      from: `boostsmall <${FROM_NOTIFICATIONS}>`,
      to: args.to,
      replyTo: REPLY_TO,
      subject: args.subject,
      html: args.html,
    });
    if (result.error) {
      console.error("[email] resend error:", result.error);
      return { ok: false, error: result.error.message };
    }
    return { ok: true };
  } catch (err) {
    console.error("[email] send failed:", err);
    return { ok: false, error: err instanceof Error ? err.message : "unknown" };
  }
}

interface LayoutArgs {
  headline: string;
  body: string;
  ctaLabel?: string;
  ctaUrl?: string;
  footerNote?: string;
}

// Inline-styled HTML — most email clients ignore <style> blocks, so all
// styling has to live on each element. Width 600px is the email standard.
function layout({ headline, body, ctaLabel, ctaUrl, footerNote }: LayoutArgs): string {
  const cta =
    ctaLabel && ctaUrl
      ? `
        <p style="margin: 32px 0;">
          <a href="${ctaUrl}" style="display: inline-block; background: #c97b5a; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 9999px; font-weight: 700; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;">
            ${escapeHtml(ctaLabel)}
          </a>
        </p>
      `
      : "";

  const footer = footerNote
    ? `<p style="color: #6f6a5d; font-size: 13px; margin: 24px 0 0;">${escapeHtml(footerNote)}</p>`
    : "";

  return `
    <!DOCTYPE html>
    <html><head><meta charset="utf-8"/></head>
    <body style="margin: 0; padding: 0; background: #f4ecd8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; color: #2c2a25;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f4ecd8; padding: 32px 16px;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background: #ffffff; border-radius: 16px; padding: 32px; border: 1px solid rgba(44,42,37,0.1);">
            <tr><td>
              <p style="margin: 0 0 24px; font-size: 20px; font-weight: 700; color: #2c2a25;">
                <span style="color: #7d8b5e;">boost</span><span style="color: #c97b5a;">small</span>
              </p>
              <h1 style="margin: 0 0 16px; font-size: 28px; line-height: 1.2; color: #2c2a25; font-weight: 700;">
                ${escapeHtml(headline)}
              </h1>
              <div style="font-size: 16px; line-height: 1.6; color: #2c2a25;">
                ${body}
              </div>
              ${cta}
              ${footer}
            </td></tr>
          </table>
          <p style="color: #6f6a5d; font-size: 12px; margin-top: 16px; max-width: 600px;">
            boostsmall · Houston metro · <a href="${APP_URL}" style="color: #6f6a5d;">${APP_URL.replace(/^https?:\/\//, "")}</a>
          </p>
        </td></tr>
      </table>
    </body></html>
  `;
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
