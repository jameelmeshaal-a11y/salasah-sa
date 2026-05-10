import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/sector")({
  beforeLoad: () => {
    throw redirect({ to: "/sectors", statusCode: 301 });
  },
});
