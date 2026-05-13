import "server-only";
import { Resend } from "resend";
import { APP_URL } from "@/lib/env";

// Resend client is lazy-initialized: the SDK throws synchronously if you
// `new Resend(undefined)`, which would crash the Vercel build's
// page-data-collection phase on preview deploys that lack the env var.
// Constructed on first send instead, after the env-var guard in safeSend.
let resendInstance: Resend | null = null;
function getResend(): Resend {
  if (!resendInstance) {
    resendInstance = new Resend(process.env.RESEND_API_KEY);
  }
  return resendInstance;
}

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

interface NewReviewArgs extends BaseSendArgs {
  businessName: string;
  businessSlug: string;
  reviewId: string;
  rating: number;
  reviewerName: string;
  bodyExcerpt: string;
}

// Sent to verified owners when a new review lands on their business.
export async function sendNewReviewEmail(args: NewReviewArgs) {
  const subject = `New ${args.rating}★ review on ${args.businessName}`;
  const url = `${APP_URL}/b/${args.businessSlug}#review-${args.reviewId}`;
  const greeting = args.toName ? `Hi ${args.toName},` : "Hi,";
  const stars = "★".repeat(args.rating) + "☆".repeat(5 - args.rating);

  return safeSend({
    to: args.to,
    subject,
    html: layout({
      headline: `${args.rating}★ on ${args.businessName}.`,
      body: `
        <p>${greeting}</p>
        <p><strong>${escapeHtml(args.reviewerName)}</strong> just left a ${stars} review on <strong>${escapeHtml(args.businessName)}</strong>.</p>
        <blockquote style="margin:18px 0;padding:14px 16px;border-left:3px solid #c97b5a;background:#faf5e8;color:#2c2a25;font-style:italic;font-size:15px;line-height:1.5;">
          ${escapeHtml(args.bodyExcerpt)}
        </blockquote>
        <p>You can respond directly from the review.</p>
      `,
      ctaLabel: "Read it & respond",
      ctaUrl: url,
      footerNote: "You're getting this because you're a verified owner of this business on boostsmall.",
    }),
  });
}

interface OwnerResponseEmailArgs extends BaseSendArgs {
  businessName: string;
  businessSlug: string;
  reviewId: string;
  ownerExcerpt: string;
}

// Sent to a reviewer when the owner responds to their review.
export async function sendOwnerResponseEmail(args: OwnerResponseEmailArgs) {
  const subject = `${args.businessName} replied to your review`;
  const url = `${APP_URL}/b/${args.businessSlug}#review-${args.reviewId}`;
  const greeting = args.toName ? `Hi ${args.toName},` : "Hi,";

  return safeSend({
    to: args.to,
    subject,
    html: layout({
      headline: `${args.businessName} just replied.`,
      body: `
        <p>${greeting}</p>
        <p>The verified owner of <strong>${escapeHtml(args.businessName)}</strong> responded to the review you left.</p>
        <blockquote style="margin:18px 0;padding:14px 16px;border-left:3px solid #7d8b5e;background:#faf5e8;color:#2c2a25;font-size:15px;line-height:1.5;">
          ${escapeHtml(args.ownerExcerpt)}
        </blockquote>
      `,
      ctaLabel: "See the full thread",
      ctaUrl: url,
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
    const result = await getResend().emails.send({
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
