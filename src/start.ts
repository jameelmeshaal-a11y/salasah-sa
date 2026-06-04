import { createMiddleware, createStart } from "@tanstack/react-start";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

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
    h.set(
      "Content-Security-Policy",
      "frame-ancestors 'self' https://*.lovable.app https://lovable.dev https://*.lovable.dev",
    );
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
  functionMiddleware: [attachSupabaseAuth],
  requestMiddleware: [securityHeaders],
}));
