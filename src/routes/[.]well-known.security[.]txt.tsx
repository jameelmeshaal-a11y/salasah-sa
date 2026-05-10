import { createFileRoute } from "@tanstack/react-router";

const SECURITY_TXT = `Contact: mailto:security@salasah.sa
Contact: mailto:info@salasah.sa
Expires: 2027-12-31T23:59:59.000Z
Preferred-Languages: ar, en
Canonical: https://salasah-sa.lovable.app/.well-known/security.txt
Policy: https://salasah-sa.lovable.app/security
`;

export const Route = createFileRoute("/[.]well-known/security[.]txt")({
  server: {
    handlers: {
      GET: async () => {
        return new Response(SECURITY_TXT, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=86400",
          },
        });
      },
    },
  },
});
