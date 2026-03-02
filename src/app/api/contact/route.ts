import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

// "from" must be a verified Resend sender.
// Until you verify your domain at resend.com/domains, use:
//   "CosmicLabs <onboarding@resend.dev>"  (works immediately for testing)
// Once you verify cosmiclabs.in (or any domain you own), change to:
//   "CosmicLabs <hello@cosmiclabs.in>"
const FROM_EMAIL = "CosmicLabs <onboarding@resend.dev>";
const REPLY_TO = "cosmiclabsindia@gmail.com";  // replies land in your Gmail

export async function POST(req: NextRequest) {
  try {
    const { name, email, projectType, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // ── 1. Save to Supabase ──────────────────────────────────
    const { error: dbError } = await supabase.from("contacts").insert([
      {
        name,
        email,
        project_type: projectType || null,
        message,
      },
    ]);

    if (dbError) {
      console.error("Supabase insert error:", dbError.message);
      return NextResponse.json(
        { error: "Failed to save submission." },
        { status: 500 }
      );
    }

    // ── 2. Send confirmation email to the user ───────────────
    await resend.emails.send({
      from: FROM_EMAIL,
      replyTo: REPLY_TO,
      to: email,
      subject: "We received your message — CosmicLabs",
      html: `
        <div style="font-family:sans-serif;background:#000;color:#fff;padding:40px;max-width:560px;margin:0 auto;border:1px solid #222;">
          <h2 style="font-size:22px;font-weight:600;margin-bottom:8px;">Message received, ${name}.</h2>
          <p style="color:#aaa;font-size:14px;line-height:1.7;margin-bottom:24px;">
            Thank you for reaching out to CosmicLabs. We\'ll review your message and get back to you within 24 hours.
          </p>
          <div style="border-top:1px solid #222;padding-top:20px;margin-top:20px;">
            <p style="color:#666;font-size:12px;margin:4px 0;"><strong style="color:#888;">Project Type:</strong> ${projectType || "—"}</p>
            <p style="color:#666;font-size:12px;margin:4px 0;"><strong style="color:#888;">Message:</strong> ${message}</p>
          </div>
          <p style="color:#444;font-size:11px;margin-top:32px;">© ${new Date().getFullYear()} CosmicLabs. Crafted with ∞ precision.</p>
        </div>
      `,
    });

    // ── 3. Send notification email to CosmicLabs team ───────
    await resend.emails.send({
      from: FROM_EMAIL,
      replyTo: email,
      to: "yellapuchandramouli797@gmail.com",
      subject: `New contact: ${name} — ${projectType || "General"}`,
      html: `
        <div style="font-family:sans-serif;background:#000;color:#fff;padding:40px;max-width:560px;margin:0 auto;border:1px solid #222;">
          <h2 style="font-size:20px;font-weight:600;margin-bottom:16px;">New Contact Submission</h2>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr>
              <td style="color:#888;padding:8px 0;border-bottom:1px solid #1a1a1a;width:120px;">Name</td>
              <td style="color:#fff;padding:8px 0;border-bottom:1px solid #1a1a1a;">${name}</td>
            </tr>
            <tr>
              <td style="color:#888;padding:8px 0;border-bottom:1px solid #1a1a1a;">Email</td>
              <td style="color:#fff;padding:8px 0;border-bottom:1px solid #1a1a1a;">
                <a href="mailto:${email}" style="color:#aaa;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="color:#888;padding:8px 0;border-bottom:1px solid #1a1a1a;">Project Type</td>
              <td style="color:#fff;padding:8px 0;border-bottom:1px solid #1a1a1a;">${projectType || "—"}</td>
            </tr>
            <tr>
              <td style="color:#888;padding:8px 8px 8px 0;vertical-align:top;">Message</td>
              <td style="color:#fff;padding:8px 0;white-space:pre-wrap;">${message}</td>
            </tr>
          </table>
          <p style="color:#444;font-size:11px;margin-top:32px;">Submitted at ${new Date().toUTCString()}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
