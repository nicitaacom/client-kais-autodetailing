Supabase SQL:

```sql
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  timezone VARCHAR(50) NOT NULL,
  note TEXT,
  channel VARCHAR(50) NOT NULL,
  notification_to VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY allow_all ON appointments FOR ALL
  TO PUBLIC
  USING (true);
```
