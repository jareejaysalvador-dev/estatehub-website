import { createClient } from "@sanity/client";

// Public, read-only client - the "production" dataset is intentionally
// public-read (see studio/README or CLAUDE.md), so no token/secret is
// needed here, and none of these values are sensitive.
export const sanityClient = createClient({
  projectId: "0wtk03lk",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});
