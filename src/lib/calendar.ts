// A plain Google Calendar "quick add" URL - no API key, no dependency, no
// .ics file. Covers the common case (Gmail/Google Calendar dominance in
// this audience) for near-zero effort; revisit with real .ics generation
// only if Outlook/Apple Calendar users become an actual observed need.
const VIEWING_DURATION_MINUTES = 60;

function formatGoogleCalendarUtc(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export function googleCalendarLink(params: {
  title: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM", 24-hour, Asia/Manila local (matches <input type="time">)
  details: string;
  location?: string;
}): string | null {
  if (!/^\d{2}:\d{2}$/.test(params.time)) return null;

  const start = new Date(`${params.date}T${params.time}:00+08:00`);
  if (isNaN(start.getTime())) return null;
  const end = new Date(start.getTime() + VIEWING_DURATION_MINUTES * 60_000);

  const url = new URL("https://calendar.google.com/calendar/render");
  url.searchParams.set("action", "TEMPLATE");
  url.searchParams.set("text", params.title);
  url.searchParams.set("dates", `${formatGoogleCalendarUtc(start)}/${formatGoogleCalendarUtc(end)}`);
  url.searchParams.set("details", params.details);
  if (params.location) url.searchParams.set("location", params.location);

  return url.toString();
}
