// Pure helper. Lives in lib/ (not server/actions/) because "use server"
// files are restricted to async exports — and this is sync.

export function emailDomainMatchesWebsite(
  email: string | null | undefined,
  websiteUrl: string | null | undefined
): boolean {
  if (!email || !websiteUrl) return false;
  const emailDomain = email.split("@")[1]?.toLowerCase().trim();
  if (!emailDomain) return false;
  try {
    const u = new URL(websiteUrl);
    const webDomain = u.hostname.replace(/^www\./, "").toLowerCase();
    return emailDomain === webDomain || emailDomain.endsWith(`.${webDomain}`);
  } catch {
    return false;
  }
}
