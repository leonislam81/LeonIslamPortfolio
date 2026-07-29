# Dashboard setup

1. Create a Supabase project and create your administrator user in **Authentication > Users**.
2. Run [`supabase/schema.sql`](../supabase/schema.sql) in the Supabase SQL editor.
3. Add these Vercel environment values for Production, Preview, and Development:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-side only; never expose it in the browser)
   - `DASHBOARD_OWNER_ID` (the UUID of the administrator user)
4. Visit `/dashboard/login` and sign in with the administrator account.

Every new free-audit report request is now saved to `audit_leads` after its confirmation email is delivered. The service role key is used only by the server and must never be added to a public variable or pasted into client-side code.
