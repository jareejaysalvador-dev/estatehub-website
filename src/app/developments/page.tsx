import { redirect } from "next/navigation";

// No standalone developments index exists - /properties is the one browse
// surface for both listings and developments. This exists purely so a
// trimmed URL (someone editing /developments/some-slug down to /developments)
// lands somewhere real instead of a 404.
export default function DevelopmentsIndexPage() {
  redirect("/properties");
}
