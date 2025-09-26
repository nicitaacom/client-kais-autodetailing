"use server"

import { businessInfo } from "@/consts/businessInfo"
import { Resend } from "resend"

export async function contactUsAction(firstName: string, phone: string, message: string): Promise<void | string> {
  // 1. Validate inputs
  if (!firstName || firstName.length < 2) return "Name must be at least 2 characters"
  if (!phone || !/^[+0-9\s]*$/.test(phone)) return "Invalid phone number"
  if (!message || message.length < 3) return "Message must be at least 3 characters"

  const resend = new Resend(process.env.RESEND_SECRET)

  try {
    await resend.emails.send({
      from: `notifications@${process.env.NEXT_PUBLIC_EMAIL_FROM_DOMAIN}`,
      to: businessInfo.email,
      subject: `New form submission`,
      html: `
    <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Form Submission</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #000000; color: #ffffff;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px; background-color: #000000;">
              <tr>
                <td>
                  <!-- Header -->
                  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #d32f2f; border-bottom: 1px solid #d0d0d0;">
                    <tr>
                      <td style="padding: 8px 12px; text-align: center;">
                        <h1 style="margin: 0; font-size: 16px; font-weight: 600; color: #ffffff;">New Form Submission</h1>
                      </td>
                    </tr>
                  </table>

                  <!-- Content -->
                  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="padding: 12px;">
                    <tr>
                      <td>
                        <!-- Contact Details -->
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a; border: 1px solid #d0d0d0; border-radius: 4px; margin-bottom: 8px;">
                          <tr>
                            <td style="padding: 8px 10px; font-size: 13px; font-weight: 600; color: #d32f2f; text-transform: uppercase; letter-spacing: 0.5px;">
                              Contact Details
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 6px 10px;">
                              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                  <td style="color: #a0a0a0; font-size: 12px; width: 80px;">Name:</td>
                                  <td style="color: #ffffff; font-size: 13px; font-weight: 500;">${firstName}</td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 6px 10px;">
                              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                  <td style="color: #a0a0a0; font-size: 12px; width: 80px;">Phone:</td>
                                  <td style="color: #ffffff; font-size: 13px; font-weight: 500;">${phone}</td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>

                        <!-- Message -->
                        ${
                          message
                            ? `
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a; border: 1px solid #d0d0d0; border-radius: 4px;">
                          <tr>
                            <td style="padding: 8px 10px; font-size: 13px; font-weight: 600; color: #d32f2f; text-transform: uppercase; letter-spacing: 0.5px;">
                              Message
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 6px 10px;">
                              <p style="margin: 0; color: #ffffff; font-size: 13px; line-height: 1.3;">${message}</p>
                            </td>
                          </tr>
                        </table>
                        `
                            : ""
                        }
                      </td>
                    </tr>
                  </table>

                  <!-- Footer -->
                  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="border-top: 1px solid #d0d0d0;">
                    <tr>
                      <td style="padding: 8px 12px; text-align: center;">
                        <p style="margin: 0; color: #a0a0a0; font-size: 11px;">This is an automated form submission notification</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    })
  } catch (error) {
    if (error instanceof Error) return error.message
  }
}
