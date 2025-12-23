# TalentHunt BD - AI Development Guidelines

> **Purpose**: This document provides comprehensive guidelines for AI assistants to efficiently work on the TalentHunt BD project. It covers the project structure, tech stack, coding conventions, and best practices.

---

## 📋 Project Overview

**TalentHunt BD** is a full-stack freelancing marketplace for Bangladesh, modeled after Upwork. It connects Bangladeshi freelancers with employers, providing features for job posting, proposals, contracts, milestone tracking, messaging, and wallet management.

**Live URL**: https://thbd.digitalcare.site

---

## 🏗 Project Structure

```
Talent-hunt/
├── supabase/                  # Legacy Supabase migrations (reference only)
│   └── migrations/
└── web/                       # Main Next.js application
    ├── migrations/            # D1 database migrations
    │   └── 0001_schema.sql    # Complete database schema
    ├── src/
    │   ├── app/               # Next.js App Router pages
    │   │   ├── (auth)/        # Authentication pages (signin, signup)
    │   │   ├── (dashboard)/   # Protected dashboard routes
    │   │   │   ├── admin/     # Admin dashboard
    │   │   │   ├── employer/  # Employer dashboard
    │   │   │   └── freelancer/# Freelancer dashboard
    │   │   ├── api/           # API routes
    │   │   │   ├── ai/        # AI-related endpoints
    │   │   │   ├── auth/      # Auth endpoints (Google OAuth)
    │   │   │   ├── profile/   # Profile API
    │   │   │   └── upload/    # File upload API
    │   │   └── [public pages] # jobs, talent, about, etc.
    │   ├── actions/           # Server Actions
    │   │   ├── admin.ts       # Admin operations
    │   │   ├── jobs.ts        # Job CRUD operations
    │   │   ├── milestones.ts  # Milestone management
    │   │   ├── portfolio.ts   # Portfolio management
    │   │   ├── profile.ts     # Profile updates
    │   │   ├── proposals.ts   # Proposal submissions
    │   │   └── wallet.ts      # Wallet & withdrawals
    │   ├── components/        # React components
    │   │   ├── admin/         # Admin-specific components
    │   │   ├── ai/            # AI-related components
    │   │   ├── contracts/     # Contract components
    │   │   ├── dashboard/     # Dashboard components
    │   │   ├── employer/      # Employer-specific components
    │   │   ├── forms/         # Form components
    │   │   ├── freelancer/    # Freelancer-specific components
    │   │   ├── icons/         # Custom icons
    │   │   ├── layout/        # Layout components (header, footer)
    │   │   ├── messages/      # Messaging components
    │   │   └── ui/            # Base UI components
    │   ├── lib/               # Utility libraries
    │   │   ├── ai/
    │   │   │   └── groq.ts    # Groq AI client & prompts
    │   │   ├── auth/
    │   │   │   ├── authorize.ts   # Authorization helpers
    │   │   │   ├── google.ts      # Google OAuth setup
    │   │   │   ├── lucia.ts       # Lucia Auth initialization
    │   │   │   └── session.ts     # Session management
    │   │   ├── db/
    │   │   │   └── index.ts   # D1 database helpers
    │   │   ├── supabase/      # Legacy Supabase clients (reference)
    │   │   ├── cloudinary.ts  # Cloudinary upload helpers
    │   │   ├── site-url.ts    # Site URL utilities
    │   │   └── utils.ts       # General utilities (cn helper)
    │   └── types/
    │       └── database.ts    # TypeScript type definitions
    ├── middleware.ts          # Next.js middleware (auth)
    ├── wrangler.jsonc         # Cloudflare Workers config
    └── package.json           # Dependencies
```

---

## 🛠 Tech Stack & Context7 Library IDs

Always use **Context7 MCP** to fetch the latest documentation. Never rely on training data.

### Core Technologies

| Technology       | Version | Context7 Library ID     | Purpose                         |
| ---------------- | ------- | ----------------------- | ------------------------------- |
| **Next.js**      | 15+     | `/vercel/next.js`       | React framework with App Router |
| **React**        | 19+     | `/facebook/react`       | UI library                      |
| **Tailwind CSS** | v4      | `/websites/tailwindcss` | Utility-first CSS               |
| **TypeScript**   | 5+      | `/microsoft/typescript` | Type safety                     |

### Backend & Database

| Technology              | Version | Context7 Library ID                                   | Purpose                      |
| ----------------------- | ------- | ----------------------------------------------------- | ---------------------------- |
| **Cloudflare D1**       | -       | `/llmstxt/developers_cloudflare_com-d1-llms-full.txt` | SQLite database              |
| **OpenNext Cloudflare** | 1.14+   | `/opennextjs/opennextjs-cloudflare`                   | Next.js adapter for CF       |
| **Lucia Auth**          | v3      | `/websites/v3_lucia-auth`                             | Session-based authentication |
| **Arctic**              | v3      | -                                                     | OAuth helpers (Google)       |

### Form & Validation

| Technology              | Version | Context7 Library ID              | Purpose               |
| ----------------------- | ------- | -------------------------------- | --------------------- |
| **React Hook Form**     | 7.65+   | `/react-hook-form/documentation` | Form state management |
| **Zod**                 | v4      | `/colinhacks/zod`                | Schema validation     |
| **@hookform/resolvers** | 5.2+    | -                                | Zod integration       |

### AI & Utilities

| Technology       | Version | Context7 Library ID     | Purpose             |
| ---------------- | ------- | ----------------------- | ------------------- |
| **Groq SDK**     | 0.37+   | `/groq/groq-typescript` | AI chat completions |
| **Lucide React** | 0.546+  | `/lucide-icons/lucide`  | Icons               |
| **Sonner**       | 2.0+    | -                       | Toast notifications |
| **date-fns**     | 4.1+    | `/date-fns/date-fns`    | Date formatting     |

---

## 📝 Coding Conventions

### 1. Server Actions Pattern

All mutations use Server Actions with Zod validation:

```typescript
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getCurrentUser, getDB } from "@/lib/auth/session";
import { generateId } from "@/lib/db";

const schema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  // ... more fields
});

export type ActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function createAction(
  _: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = schema.safeParse({
    title: formData.get("title"),
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message };
  }

  const auth = await getCurrentUser();
  if (!auth?.profile) {
    return { status: "error", message: "Unauthorized" };
  }

  const db = getDB();
  if (!db) {
    return { status: "error", message: "Database not available" };
  }

  try {
    const id = generateId();
    await db
      .prepare(`INSERT INTO table (id, ...) VALUES (?, ?)`)
      .bind(id, parsed.data.title)
      .run();

    revalidatePath("/path");
    return { status: "success", message: "Created successfully" };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Failed",
    };
  }
}
```

### 2. D1 Database Queries

Use prepared statements with `.bind()` for all queries:

```typescript
// SELECT single row
const user = await db
  .prepare("SELECT * FROM users WHERE id = ?")
  .bind(userId)
  .first<UserType>();

// SELECT multiple rows
const { results } = await db
  .prepare("SELECT * FROM jobs WHERE status = ? ORDER BY created_at DESC")
  .bind("open")
  .all<JobType>();

// INSERT
await db
  .prepare(`INSERT INTO profiles (id, full_name, role) VALUES (?, ?, ?)`)
  .bind(id, fullName, "freelancer")
  .run();

// UPDATE
await db
  .prepare(
    `UPDATE profiles SET bio = ?, updated_at = datetime('now') WHERE id = ?`
  )
  .bind(bio, userId)
  .run();

// JSON arrays are stored as TEXT
import { toJsonArray, fromJsonArray } from "@/lib/db";
const skillsJson = toJsonArray(["React", "Next.js"]);
const skillsArray = fromJsonArray(row.skills);
```

### 3. Authentication Flow

```typescript
// Check auth in Server Action
const auth = await getCurrentUser();
if (!auth?.profile) {
  return { status: "error", message: "Please log in" };
}

// Check role
const profile = auth.profile as { role: string; id: string };
if (profile.role !== "employer") {
  return { status: "error", message: "Only employers can perform this action" };
}

// Use profile ID
const userId = profile.id;
```

### 4. Component Patterns

**UI Components**: Located in `src/components/ui/`, use Tailwind CSS v4 with CSS variables:

```tsx
// Button component pattern
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

export function Button({
  className,
  variant = "default",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors",
        variant === "default" &&
          "bg-accent text-accent-foreground hover:bg-accent/90",
        variant === "secondary" && "bg-card text-foreground hover:bg-card/80",
        size === "sm" && "h-8 px-3 text-sm",
        size === "md" && "h-10 px-4",
        size === "lg" && "h-12 px-6 text-lg",
        className
      )}
      {...props}
    />
  );
}
```

### 5. Tailwind CSS v4 Theme Variables

Use the theme variables defined in `globals.css`:

```css
/* Color tokens */
--background: #f2f7f2
--foreground: #001e00
--card: #ffffff
--card-border: #cde7cd
--muted: #3f5c3f
--accent: #14a800
--accent-foreground: #ffffff

/* Usage in Tailwind */
className="bg-background text-foreground"
className="bg-accent text-accent-foreground"
className="border-card-border bg-card"
className="text-muted"
```

---

## 🔧 Common Operations

### Adding a New Feature

1. **Database**: Add migration in `web/migrations/` if schema changes needed
2. **Types**: Update `src/types/database.ts` with new types
3. **Server Action**: Create in `src/actions/` with Zod validation
4. **API Route** (if needed): Add in `src/app/api/`
5. **Components**: Create reusable components in `src/components/`
6. **Page**: Add route in `src/app/`

### Adding a New Page

```tsx
// src/app/[route]/page.tsx
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Page Title",
  description: "Page description",
};

export default async function PageName() {
  const auth = await getCurrentUser();
  if (!auth?.profile) {
    redirect("/signin");
  }

  return (
    <div className="container mx-auto px-4 py-8">{/* Page content */}</div>
  );
}
```

### Database Migrations

```bash
# Local development
npm run db:migrate

# Production (Cloudflare D1)
npm run db:migrate:prod
```

### Deployment

```bash
# Build and deploy to Cloudflare Workers
npm run cf:deploy
```

---

## 🤖 AI Content Generation (Groq)

The project uses Groq AI for content generation:

```typescript
import { createGroqClient, generateContent, ContentType } from "@/lib/ai/groq";

// Available content types: 'bio' | 'job_description' | 'proposal' | 'message'
const client = createGroqClient(process.env.GROQ_API_KEY!);

// Stream content generation
for await (const chunk of generateContent(
  client,
  "bio",
  contextInfo,
  userInstructions
)) {
  yield chunk;
}

// Chat completions
for await (const chunk of generateChatResponse(client, messages, userContext)) {
  yield chunk;
}
```

---

## ⚠️ Important Notes

### Must Remember

1. **Always use Context7 MCP** for fetching latest library docs - never rely on training data
2. **D1 uses SQLite syntax** - not PostgreSQL (no `uuid_generate_v4()`, use `generateId()`)
3. **JSON arrays stored as TEXT** - use `toJsonArray()` and `fromJsonArray()`
4. **SQLite booleans are INTEGER** - 0 = false, 1 = true
5. **Always use prepared statements** - no string concatenation in SQL
6. **Use Server Actions** for mutations - not API routes
7. **Revalidate paths** after mutations using `revalidatePath()`

### Common Gotchas

1. **Cloudflare context**: Use `getCloudflareContext()` sync for API routes, async for pages
2. **Cookie operations**: Wrap in try-catch as they may fail during render
3. **Date format**: Use `datetime('now')` for SQLite timestamps
4. **Profile type casting**: Cast `auth.profile` to correct type for role checking

### Environment Variables

- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` - Google OAuth
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` - Media uploads
- `NEXT_PUBLIC_SITE_URL` - Site URL for OAuth callbacks
- `GROQ_API_KEY` - AI content generation

---

## 📚 Quick Reference - Context7 Usage

```bash
# Before working with any library, resolve the library ID first:
mcp_context7_resolve-library-id libraryName="Next.js"

# Then fetch documentation:
mcp_context7_get-library-docs context7CompatibleLibraryID="/vercel/next.js" topic="server actions" mode="code"

# Important library IDs for this project:
# Next.js:      /vercel/next.js
# Tailwind v4:  /websites/tailwindcss
# Lucia Auth:   /websites/v3_lucia-auth
# D1:           /llmstxt/developers_cloudflare_com-d1-llms-full.txt
# React Hook Form: /react-hook-form/documentation
# Zod:          /colinhacks/zod
# Groq:         /groq/groq-typescript
```

---

## 🗃 Database Schema Reference

### Main Tables

| Table                 | Purpose               | Key Columns                                                   |
| --------------------- | --------------------- | ------------------------------------------------------------- |
| `users`               | Auth users            | id, email, email_verified, hashed_password                    |
| `sessions`            | Auth sessions (Lucia) | id, user_id, expires_at                                       |
| `oauth_accounts`      | OAuth providers       | provider_id, provider_user_id, user_id                        |
| `profiles`            | User profiles         | id, full_name, role, avatar_url, bio, skills, hourly_rate     |
| `jobs`                | Job postings          | id, employer_id, title, description, budget_mode, status      |
| `proposals`           | Job proposals         | id, job_id, freelancer_id, cover_letter, bid_amount, status   |
| `contracts`           | Active contracts      | id, job_id, employer_id, freelancer_id, escrow_amount, status |
| `contract_milestones` | Milestones            | id, contract_id, title, amount, status                        |
| `messages`            | Contract messages     | id, contract_id, sender_id, content                           |
| `wallet_transactions` | Payments              | id, user_id, type, amount, status                             |
| `withdrawal_requests` | Payout requests       | id, freelancer_id, amount, bank_name, status                  |
| `reviews`             | User reviews          | id, contract_id, reviewer_id, rating, comment                 |
| `disputes`            | Contract disputes     | id, contract_id, reason, status                               |
| `admin_settings`      | Platform settings     | commission_percentage, bank details                           |

---

## 🔄 Git Workflow

After making changes:

```bash
# Always commit after changes
git add .
git commit -m "feat: descriptive commit message"
git push origin main
```

---

_Last updated: December 2024_
_Project: TalentHunt BD - Bangladesh's Upwork-style Freelancing Platform_
