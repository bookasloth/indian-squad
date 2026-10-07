// One-time: get a Zoho Payments refresh token. Ported from Coffee and Toffee.
//   1) npm run zoho:auth            -> prints a URL; open it, approve
//   2) copy the ?code=... from the page you land on (it expires in ~2 minutes)
//   3) npm run zoho:auth -- <code>  -> prints ZOHO_PAY_REFRESH_TOKEN=...
const {
  ZOHO_PAY_CLIENT_ID: client_id,
  ZOHO_PAY_CLIENT_SECRET: client_secret,
  NEXT_PUBLIC_ZOHO_PAY_ACCOUNT_ID: accountId,
  NEXT_PUBLIC_ZOHO_PAY_SANDBOX: sandbox,
  ZOHO_PAY_REDIRECT_URI: redirect_uri = "http://localhost:3000/",
} = process.env;

const p = sandbox === "true" ? "ZohoPaySandbox" : "ZohoPay";
const scope = `${p}.payments.CREATE,${p}.payments.READ`;
const code = process.argv[2];

if (!client_id || !accountId) throw new Error("Set ZOHO_PAY_CLIENT_ID and NEXT_PUBLIC_ZOHO_PAY_ACCOUNT_ID in .env.local");

if (!code) {
  const q = new URLSearchParams({ scope, client_id, soid: `zohopay.${accountId}`, response_type: "code", redirect_uri, access_type: "offline" });
  console.log(`Open this, approve, then copy the "code" from the redirected URL:\n\nhttps://accounts.zoho.in/oauth/v2/org/auth?${q}\n`);
} else {
  const q = new URLSearchParams({ code, client_id, client_secret, redirect_uri, grant_type: "authorization_code" });
  const data = await (await fetch(`https://accounts.zoho.in/oauth/v2/token?${q}`, { method: "POST" })).json();
  console.log(data.refresh_token ? `Add to .env.local:\nZOHO_PAY_REFRESH_TOKEN=${data.refresh_token}` : data);
}
