"use server"

import { Resend } from "resend"

export async function sendEmailAction(
  body: string,
  subject: string,
  selectedDate: string | null,
  atMSK: string,
  emailTo: string | undefined,
) {
  const resend = new Resend(process.env.RESEND_SECRET)

  if (!selectedDate) return "it's no selected date to send email"
  if (!emailTo) return "it's no emailTo to send email"

  await resend.emails.send({
    from: `notifications@${process.env.NEXT_PUBLIC_EMAIL_FROM_DOMAIN}`,
    to: emailTo,
    subject: subject,
    html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Booking Confirmation</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #000000; color: #ffffff;">
            <div style="max-width: 500px; margin: 0 auto; background-color: #000000;">
              
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #7c3aed, #a855f7); padding: 16px 20px; text-align: center;">
                <h1 style="margin: 0; font-size: 18px; font-weight: 600; color: #ffffff;">New Booking</h1>
              </div>
              
              <!-- Content -->
              <div style="padding: 20px; background-color: #000000;">
                
                <!-- Booking Details -->
                <div style="background-color: #111111; border-radius: 6px; padding: 16px; margin-bottom: 16px; border-left: 3px solid #7c3aed;">
                  <h2 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #a855f7; text-transform: uppercase; letter-spacing: 0.5px;">Booking Details</h2>
                  
                  <div style="margin-bottom: 8px;">
                    <span style="color: #888888; font-size: 13px;">Date:</span>
                    <span style="color: #ffffff; font-size: 14px; margin-left: 8px; font-weight: 500;">${selectedDate}</span>
                  </div>
                  
                  <div style="margin-bottom: 8px;">
                    <span style="color: #888888; font-size: 13px;">Time (MSK):</span>
                    <span style="color: #ffffff; font-size: 14px; margin-left: 8px; font-weight: 500;">${atMSK}</span>
                  </div>
               
                </div>
                
             
                ${
                  body
                    ? `
                <div style="background-color: #111111; border-radius: 6px; padding: 16px; border-left: 3px solid #7c3aed;">
                  <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #a855f7; text-transform: uppercase; letter-spacing: 0.5px;">Message</h3>
                  <p style="margin: 0; color: #ffffff; font-size: 14px; line-height: 1.4;">${body}</p>
                </div>
                `
                    : ""
                }
                
              </div>
              
              <!-- Footer -->
              <div style="padding: 16px 20px; text-align: center; border-top: 1px solid #333333;">
                <p style="margin: 0; color: #666666; font-size: 12px;">
                  This is an automated booking notification
                </p>
              </div>
              
            </div>
          </body>
        </html>
      `,
  })
}
