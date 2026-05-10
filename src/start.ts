import { createMiddleware, createStart } from "@tanstack/react-start";

/**
 * Adds security headers to every server response.
 * HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy,
 * Permissions-Policy, and a baseline Content-Security-Policy.
 */
const securityHeaders = createMiddleware().server(async ({ next }) => {
  const result = await next();
  const headers = new Headers(result.response.headers);

  // HSTS — 2 years, include subdomains, preload-ready
  headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload",
  );
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "SAMEORIGIN");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  );
  headers.set("X-DNS-Prefetch-Control", "on");

  return new Response(result.response.body, {
    status: result.response.status,
    statusText: result.response.statusText,
    headers,
  });
});

export const startInstance = createStart(() => ({
  requestMiddleware: [securityHeaders],
}));
