import "server-only";

import type { EmailCredentials } from "./config";

/**
 * SMTP credentials from env vars. (this site has no admin email-integration
 * UI — the source site's Vault/DB-backed credential store was dropped; set SMTP_*
 * in the environment instead.) Returns null unless host + user + pass are set.
 * `secure` defaults from the port (465 → implicit TLS); SMTP_SECURE overrides.
 */
function credentialsFromEnv(): EmailCredentials | null {
  const e = process.env;
  const host = e.SMTP_HOST?.trim();
  const user = e.SMTP_USER?.trim();
  const pass = e.SMTP_PASS?.trim();
  if (!host || !user || !pass) return null;

  const port = e.SMTP_PORT?.trim() || "465";
  const secure = e.SMTP_SECURE?.trim() || (port === "465" ? "true" : "false");
  return {
    host,
    port,
    secure,
    user,
    pass,
    fromName: e.SMTP_FROM_NAME?.trim() || "",
    fromEmail: e.SMTP_FROM_EMAIL?.trim() || user,
    toEmail: e.SMTP_TO_EMAIL?.trim() || user,
  };
}

export async function getEmailCredentials(): Promise<EmailCredentials | null> {
  return credentialsFromEnv();
}
