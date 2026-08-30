import { NextResponse } from "next/server";
import { getLeadByToken, saveViewingDetails } from "@/supabase/client";
import { sendEmail } from "@/resend/client";
import { getSiteSettings } from "@/sanity/queries";
import { googleCalendarLink } from "@/lib/calendar";

function stripHeaderInjection(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const lead = await getLeadByToken(token);

  if (lead === null) {
    console.error("[viewing] Supabase service-role credentials are not configured.");
    return NextResponse.json({ error: "Server is not configured." }, { status: 500 });
  }
  if (lead === undefined) {
    return NextResponse.json({ error: "Booking link not found." }, { status: 404 });
  }

  return NextResponse.json({
    firstName: lead.first_name,
    lastName: lead.last_name,
    phone: lead.phone,
    property: lead.regarding_property ?? "",
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const viewingDate = String(body.viewingDate ?? "").slice(0, 10);
  const viewingTime = stripHeaderInjection(String(body.viewingTime ?? "")).slice(0, 20);
  const viewingProperty = stripHeaderInjection(String(body.viewingProperty ?? "")).slice(0, 200);
  const phone = stripHeaderInjection(String(body.phone ?? "")).slice(0, 40);
  const rawViewers = body.viewersCount;
  const viewersCount =
    typeof rawViewers === "number" && Number.isFinite(rawViewers) && rawViewers > 0
      ? Math.floor(rawViewers)
      : null;

  const errors: Record<string, string> = {};
  if (!/^\d{4}-\d{2}-\d{2}$/.test(viewingDate)) errors.viewingDate = "Choose a valid date.";
  if (!/^\d{2}:\d{2}$/.test(viewingTime)) errors.viewingTime = "Choose a preferred time.";
  if (!viewingProperty) errors.viewingProperty = "Property is required.";
  if (!phone) errors.phone = "Enter a contact number.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  let updated;
  try {
    updated = await saveViewingDetails(token, {
      viewingDate,
      viewingTime,
      viewingProperty,
      viewersCount,
      phone,
    });
  } catch (error) {
    console.error("[viewing] Supabase update failed:", error);
    return NextResponse.json({ error: "Failed to save." }, { status: 502 });
  }

  if (updated === null) {
    console.error("[viewing] Supabase service-role credentials are not configured.");
    return NextResponse.json({ error: "Server is not configured." }, { status: 500 });
  }
  if (updated === undefined) {
    return NextResponse.json({ error: "Booking link not found." }, { status: 404 });
  }

  const calendarLink = googleCalendarLink({
    title: `Viewing (tentative): ${updated.first_name} ${updated.last_name} - ${viewingProperty}`,
    date: viewingDate,
    time: viewingTime,
    details: `Property: ${viewingProperty}\nContact: ${updated.first_name} ${updated.last_name}, ${phone}`,
  });

  // Both emails are best-effort, same pattern as /api/inquiry: the viewing
  // is already saved above, so a failed send should not turn a successful
  // booking into an error response to the lead.
  try {
    const emailResult = await sendEmail({
      from: "EstateHub.ph <notifications@estatehub.ph>",
      to: updated.email,
      replyTo: "estatehub.ph@gmail.com",
      subject: `We've received your requested viewing, ${updated.first_name}`,
      text: `Hi ${updated.first_name},\n\nWe've received your requested viewing for ${viewingProperty} on ${viewingDate} at ${viewingTime}. Your broker will confirm this with you shortly.\n\nTalk soon,\nThe EstateHub Team`,
    });
    if (emailResult === null) {
      console.error("[viewing] RESEND_API_KEY is not configured - lead confirmation email skipped.");
    }
  } catch (emailError) {
    console.error("[viewing] Lead confirmation email failed to send:", emailError);
  }

  try {
    const settings = await getSiteSettings();
    const brokerEmail = settings?.contactEmail;
    if (brokerEmail) {
      const viewersLine = viewersCount ? `\nViewers: ${viewersCount}` : "";
      const calendarLine = calendarLink ? `\n\nAdd to calendar (tentative): ${calendarLink}` : "";
      const emailResult = await sendEmail({
        from: "EstateHub.ph <notifications@estatehub.ph>",
        to: brokerEmail,
        subject: `Viewing requested: ${updated.first_name} ${updated.last_name} - ${viewingProperty}`,
        text: `${updated.first_name} ${updated.last_name} has requested a viewing:\n\nProperty: ${viewingProperty}\nRequested: ${viewingDate} at ${viewingTime}${viewersLine}\nPhone: ${phone}\n\nConfirm this time with them on Messenger - same conversation you were already in. Call ${phone} instead if that's easier.${calendarLine}`,
      });
      if (emailResult === null) {
        console.error("[viewing] RESEND_API_KEY is not configured - broker notification skipped.");
      }
    } else {
      console.error("[viewing] siteSettings.contactEmail is not configured - broker notification skipped.");
    }
  } catch (emailError) {
    console.error("[viewing] Broker notification email failed to send:", emailError);
  }

  return NextResponse.json({ delivered: true });
}
