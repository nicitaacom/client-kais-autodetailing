You might need:

- update notification server action `sendEmailAction` according to client needs

Supabase SQL:

```sql
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  timezone VARCHAR(50) NOT NULL,
  first_name VARCHAR(32) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  email VARCHAR(64) NULL,
  channel VARCHAR(50) NOT NULL,
  note TEXT,
  notification_to VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- 🔐 RLS Policies for Users
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

 -- Don't allow to select because it should be on server only because in that way hacker can access public supabase keys
 -- and select all then .delete .eq some selected id
CREATE POLICY "Allow insert for everyone" ON appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update for everyone" ON appointments FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete for everyone" ON appointments FOR DELETE USING (true);






CREATE TABLE email_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  subject text NOT NULL,
  html text NOT NULL,
  scheduled_for timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);


-- 🔐 RLS Policies for Users
ALTER TABLE email_notifications ENABLE ROW LEVEL SECURITY;
 -- Don't allow to select because it should be on server only because in that way hacker can access public supabase keys
 -- and select all then .delete .eq some selected id
CREATE POLICY "Allow insert for everyone" ON email_notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update for everyone" ON email_notifications FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow delete for everyone" ON email_notifications FOR DELETE USING (true);
```
