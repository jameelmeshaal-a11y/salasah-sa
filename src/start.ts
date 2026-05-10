import { createMiddleware, createStart } from "@tanstack/react-start";

/**
 * Adds security headers to every server response (HTML, server fn, server route).
 */
const securityHeaders = createMiddleware({ type: "request" }).server(
  async ({ next }) => {
    const result = await next();
    const h = result.response.headers;

    // HSTS — 2 years, includeSubDomains, preload-ready
    h.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload",
    );
    h.set("X-Content-Type-Options", "nosniff");
    h.set("X-Frame-Options", "SAMEORIGIN");
    h.set("Referrer-Policy", "strict-origin-when-cross-origin");
    h.set(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=(), interest-cohort=()",
    );
    h.set("X-DNS-Prefetch-Control", "on");

    return result;
  },
);

export const startInstance = createStart(() => ({
  requestMiddleware: [securityHeaders],
}));
