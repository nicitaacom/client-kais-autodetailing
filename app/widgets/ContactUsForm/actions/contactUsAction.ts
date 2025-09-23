"use server"

import { Twilio } from "twilio"

export async function contactUsAction(firstName: string, phone: string, message: string): Promise<void | string> {
  // 1. Validate inputs
  if (!firstName || firstName.length < 2) return "Name must be at least 2 characters"
  if (!phone || !/^[+0-9\s]*$/.test(phone)) return "Invalid phone number"
  if (!message || message.length < 3) return "Message must be at least 3 characters"

  // 2. Get Twilio credentials from environment
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_ACCOUNT_TOKEN
  const fromPhone = process.env.TWILIO_PHONE_NUMBER
  if (!accountSid || !authToken || !fromPhone) return "Missing Twilio credentials"

  // 3. Initialize Twilio client
  const client = new Twilio(accountSid, authToken)

  try {
    // 4. Send SMS
    await client.messages.create({
      body: `${firstName} want ${message}`,
      from: fromPhone,
      to: phone,
    })
  } catch (error) {
    // 5. Handle errors
    console.error("Twilio error:", error)
    return "Failed to send SMS"
  }
}
