const RECIPIENT = "info@pas-drone.com";
const SENDER = "info@pas-drone.com";

const clean = (value, max = 3000) =>
  String(value ?? "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max);

const escapeHtml = (value) =>
  clean(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

export async function onRequestPost(context) {
  try {
    const request = context.request;
    const origin = request.headers.get("Origin");
    const allowedOrigins = new Set([
      "https://pas-drone.com",
      "https://www.pas-drone.com"
    ]);

    if (origin && !allowedOrigins.has(origin)) {
      return Response.json({ message: "Invalid form origin." }, { status: 403 });
    }

    const form = await request.formData();

    // Honeypot field: legitimate visitors never fill this in.
    if (clean(form.get("website"), 200)) {
      return Response.json({ ok: true });
    }

    const name = clean(form.get("name"), 100);
    const email = clean(form.get("email"), 150);
    const phone = clean(form.get("phone"), 40);
    const propertyAddress = clean(form.get("property_address"), 200);
    const service = clean(form.get("service"), 100);
    const timeline = clean(form.get("timeline"), 100);
    const details = clean(form.get("details"), 3000);

    if (!name || !email || !service || !details) {
      return Response.json(
        { message: "Please complete your name, email, service and project details." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ message: "Please enter a valid email address." }, { status: 400 });
    }

    const subject = `New PAS quote request: ${service} — ${name}`;
    const text = [
      "NEW PATRIOT AERIAL SOLUTIONS QUOTE REQUEST",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone || "Not provided"}`,
      `Property/location: ${propertyAddress || "Not provided"}`,
      `Service: ${service}`,
      `Timeline: ${timeline || "Not provided"}`,
      "",
      "PROJECT DETAILS",
      details,
      "",
      `Submitted from: ${request.headers.get("CF-Connecting-IP") || "Unknown IP"}`
    ].join("\n");

    const html = `
      <h2>New Patriot Aerial Solutions Quote Request</h2>
      <table cellpadding="7" cellspacing="0" style="border-collapse:collapse">
        <tr><td><strong>Name</strong></td><td>${escapeHtml(name)}</td></tr>
        <tr><td><strong>Email</strong></td><td>${escapeHtml(email)}</td></tr>
        <tr><td><strong>Phone</strong></td><td>${escapeHtml(phone || "Not provided")}</td></tr>
        <tr><td><strong>Property/location</strong></td><td>${escapeHtml(propertyAddress || "Not provided")}</td></tr>
        <tr><td><strong>Service</strong></td><td>${escapeHtml(service)}</td></tr>
        <tr><td><strong>Timeline</strong></td><td>${escapeHtml(timeline || "Not provided")}</td></tr>
      </table>
      <h3>Project details</h3>
      <p style="white-space:pre-wrap">${escapeHtml(details)}</p>
    `;

    await context.env.EMAIL.send({
      to: RECIPIENT,
      from: { email: SENDER, name: "Patriot Aerial Solutions Website" },
      replyTo: { email, name },
      subject,
      text,
      html
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Quote form error:", error);
    return Response.json(
      { message: "The request could not be sent right now. Please call or email PAS directly." },
      { status: 500 }
    );
  }
}

export function onRequestGet() {
  return Response.json({ message: "Method not allowed." }, { status: 405 });
}
