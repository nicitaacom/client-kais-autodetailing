You might need:

env.local

```
RESEND_SECRET='' # domain.com
NEXT_PUBLIC_EMAIL_FROM_DOMAIN=''
```

- update notification server action `sendEmailAction` according to client needs

Supabase SQL:

```sql
-- Create a function to execute arbitrary SQL (restricted to authorized roles)
CREATE OR REPLACE FUNCTION execute_any_sql(query TEXT)
RETURNS VOID AS $$
BEGIN
  EXECUTE query;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to the service_role (used by server-side actions)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_roles
    WHERE rolname = 'service_role'
    AND has_function_privilege('execute_any_sql(TEXT)', 'EXECUTE')
  ) THEN
    GRANT EXECUTE ON FUNCTION execute_any_sql(TEXT) TO service_role;
  END IF;
END $$;

-- Enable pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Grant usage on cron schema to service_role
GRANT USAGE ON SCHEMA cron TO service_role;


CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  timezone VARCHAR(50) NOT NULL,
  first_name VARCHAR(32) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  email VARCHAR(64) NULL,
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- 🔐 RLS Policies for Users
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
-- It's k0n4 cuz when I delete or upadte on client with ANON it doesn't work if it's no select RLS policy


CREATE TABLE email_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  email text NOT NULL,
  appointment_id uuid NOT NULL,
  message text NOT NULL,
  scheduled_for timestamp with time zone NOT NULL
);


-- 🔐 RLS Policies for Users
ALTER TABLE email_notifications ENABLE ROW LEVEL SECURITY;
-- It's k0n4 cuz when I delete or upadte on client with ANON it doesn't work if it's no select RLS policy
```

### Supabase edge function `email-reminder`

```ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "jsr:@supabase/supabase-js@2"
import { Resend } from "npm:resend"

console.info("email reminder started")

Deno.serve(async req => {
  // 1. Initialize Supabase client with service role
  const supabaseUrl = Deno.env.get("SUPABASE_URL")
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
  if (!supabaseUrl || !supabaseKey) return new Response("Missing Supabase credentials", { status: 500 })
  const supabase = createClient(supabaseUrl, supabaseKey)

  // 2. Get Resend credentials
  const resendSecret = Deno.env.get("RESEND_SECRET")
  if (!resendSecret) return new Response("Missing Resend credentials", { status: 500 })

  const resend = new Resend(resendSecret)

  // 3. Find notifications
  const now = new Date()
  const inThirtyMinutes = new Date(now.getTime() + 30 * 60 * 1000)

  const { data, error } = await supabase
    .from("email_notifications")
    .select("id, email, message")
    .lte("scheduled_for", inThirtyMinutes.toISOString())
    .gte("scheduled_for", now.toISOString())

  if (error) {
    console.error("Supabase query error:", error)
    return new Response("Failed to fetch notifications", { status: 500 })
  }

  if (!data?.length) {
    return new Response(JSON.stringify({ message: "No notifications to send" }), {
      headers: { "Content-Type": "application/json" },
    })
  }

  // 4. Send Emails
  const results = await Promise.all(
    data.map(async ({ id, email, message }) => {
      try {
        await resend.emails.send({
          from: "notifications@yourdomain.com", // TODO - update domain
          to: email,
          subject: "Appointment Reminder",
          text: message,
        })

        await supabase.from("email_notifications").delete().eq("id", id)
        return { id, status: "Email sent successfully" }
      } catch (err) {
        console.error(`Resend error for notification ${id}:`, err)
        return { id, status: "Failed to send Email" }
      }
    }),
  )

  return new Response(JSON.stringify({ notifications: results }), {
    headers: { "Content-Type": "application/json" },
  })
})
```

SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY

RESEND_SECRET
