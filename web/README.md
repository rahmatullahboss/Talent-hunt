# TalentHunt BD

TalentHunt BD is a full-stack marketplace for Bangladeshi freelancers and employers modelled after platforms such as Upwork. It implements dedicated experiences for freelancers, employers, and administrators, with Supabase providing authentication, database, realtime messaging, and storage.

## Features

### Freelancers
- Email/password authentication with onboarding workflow
- Profile management (bio, skills, rates, portfolio uploads)
- Job search with keyword, budget, and experience filters
- Proposal submission and tracking
- Contract workspace with milestone submissions and realtime chat
- Wallet overview plus manual withdrawal requests

### Employers
- Guided onboarding for company profiles
- Job publishing and editing
- Proposal review with inline hiring (contract creation + escrow notes)
- Freelancer discovery directory
- Contract dashboard and escrow-style milestone approvals
- Manual funding instructions and payout logs

### Administrators
- Global dashboard with platform metrics
- User suspension/reactivation
- Job moderation and removal
- Dispute triage with resolution notes
- Commission & payout settings management

## Tech Stack
- [Next.js 16](https://nextjs.org/) (App Router) + React Server Components
- [Supabase](https://supabase.com/) (Postgres, Auth, Realtime, Storage)
- Tailwind CSS v4
- `sonner`, `react-hook-form`, `zod`, `lucide-react`

## Prerequisites
- Node.js 18 or newer
- Supabase CLI (`npm install -g supabase`)
- A Supabase project (self-hosted or hosted)

## Local Setup

1. **Install dependencies**
   ```bash
   cd web
   npm install
   ```

2. **Create `.env.local`**
   ```bash
   cp .env.example .env.local
   ```
   Fill with your Supabase project values:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-side actions, admin utilities)
   - `SUPABASE_JWT_SECRET`
   - `NEXT_PUBLIC_SITE_URL` (e.g. `http://localhost:3000`)

3. **Link Supabase project**
   ```bash
   supabase login       # once
   supabase link --project-ref <your-project-ref>
   ```

4. **Run migrations & seed data**
   ```bash
   supabase db push
   supabase db seed
   ```

5. **Storage bucket**
   - In the Supabase dashboard create a storage bucket named `avatars`.
   - Set it to `public` and grant authenticated users `INSERT`, `UPDATE`, `SELECT` to upload profile images.

6. **Realtime**
   - Ensure the `messages` table has Realtime enabled (toggle in Supabase dashboard > Database > Realtime).

7. **Create an admin**
   - Sign up through the app (employer/freelancer).
   - In Supabase SQL editor promote the user:
     ```sql
     update public.profiles set role = 'admin' where email = 'your-admin@email';
     ```

8. **Development server**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000`.

## Scripts
| Command         | Description                      |
|-----------------|----------------------------------|
| `npm run dev`   | Start local dev server           |
| `npm run build` | Build for production             |
| `npm run start` | Start production build           |
| `npm run lint`  | Run ESLint (TypeScript + React)  |

## Manual Payment Flow
Manual payouts are recorded inside the application and executed offline:
1. Employer funds job by sending money to bank/wallet defined in **Admin → Settings**.
2. Admin marks receipt (optional notes in contract).
3. Freelancer submits milestone deliverables inside contract workspace.
4. Employer approves milestone → system logs a `wallet_transaction` (status `pending`).
5. Admin processes payout in real life then marks `withdrawal_request` as `completed`.

The above keeps a verifiable ledger while actual transfers happen through local banks (e.g., bKash).

## Project Structure (selected)
```
web/
  src/
    app/               # App Router routes per role
    actions/           # Server actions (auth, jobs, admin, milestones)
    components/        # Shared/UI components
    lib/               # Supabase clients, auth helpers
    types/             # Generated Supabase types
supabase/
  migrations/          # SQL schema + RLS policies
  seed.sql             # Optional starting data
```

## Useful Notes
- RLS is enforced across tables; all Supabase mutations happen through server actions.
- Production deployment requires setting environment variables and running migrations on Supabase before deploying the Next.js app.
- To keep email sending optional, the current build uses password-based auth only; consider enabling SMTP for real projects.

Enjoy building with TalentHunt BD! 🎉
