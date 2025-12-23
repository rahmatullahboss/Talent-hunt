// D1 Database client for Cloudflare Workers
// This provides a typed interface for D1 database operations

export interface D1Database {
  prepare: (query: string) => D1PreparedStatement;
  batch: <T>(statements: D1PreparedStatement[]) => Promise<D1Result<T>[]>;
  exec: (query: string) => Promise<D1ExecResult>;
}

interface D1PreparedStatement {
  bind: (...args: unknown[]) => D1PreparedStatement;
  run: () => Promise<D1Result<unknown>>;
  first: <T = unknown>(colName?: string) => Promise<T | null>;
  all: <T = unknown>() => Promise<D1Result<T>>;
}

interface D1Result<T> {
  results: T[];
  success: boolean;
  meta: {
    duration: number;
    changes: number;
    last_row_id: number;
  };
}

interface D1ExecResult {
  count: number;
  duration: number;
}

// Helper to get D1 from Cloudflare context
export function getD1(env: { DB: D1Database }): D1Database {
  if (!env.DB) {
    throw new Error("D1 database not configured. Check wrangler.jsonc.");
  }
  return env.DB;
}

// Generate UUID (since SQLite doesn't have uuid-ossp)
export function generateId(): string {
  return crypto.randomUUID();
}

// Get current timestamp in ISO format
export function now(): string {
  return new Date().toISOString().replace("T", " ").split(".")[0];
}

// Helper for JSON array fields (skills, attachments, etc.)
export function toJsonArray(arr: string[]): string {
  return JSON.stringify(arr);
}

export function fromJsonArray(json: string | null): string[] {
  if (!json) return [];
  try {
    return JSON.parse(json);
  } catch {
    return [];
  }
}

// Common database operations
export const db = {
  // Users
  async getUserById(d1: D1Database, id: string) {
    return d1.prepare("SELECT * FROM users WHERE id = ?").bind(id).first();
  },

  async getUserByEmail(d1: D1Database, email: string) {
    return d1.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();
  },

  async createUser(d1: D1Database, user: { id: string; email: string; hashed_password?: string }) {
    return d1
      .prepare("INSERT INTO users (id, email, hashed_password) VALUES (?, ?, ?)")
      .bind(user.id, user.email, user.hashed_password ?? null)
      .run();
  },

  // Profiles
  async getProfileById(d1: D1Database, id: string) {
    return d1.prepare("SELECT * FROM profiles WHERE id = ?").bind(id).first();
  },

  async createProfile(
    d1: D1Database,
    profile: { id: string; full_name: string; role?: string; email?: string }
  ) {
    return d1
      .prepare(
        "INSERT INTO profiles (id, full_name, role) VALUES (?, ?, ?)"
      )
      .bind(profile.id, profile.full_name, profile.role ?? "freelancer")
      .run();
  },

  async updateProfile(d1: D1Database, id: string, updates: Record<string, unknown>) {
    const keys = Object.keys(updates);
    const setClause = keys.map((k) => `${k} = ?`).join(", ");
    const values = keys.map((k) => updates[k]);
    return d1
      .prepare(`UPDATE profiles SET ${setClause}, updated_at = datetime('now') WHERE id = ?`)
      .bind(...values, id)
      .run();
  },

  // OAuth accounts
  async getOAuthAccount(d1: D1Database, providerId: string, providerUserId: string) {
    return d1
      .prepare("SELECT * FROM oauth_accounts WHERE provider_id = ? AND provider_user_id = ?")
      .bind(providerId, providerUserId)
      .first();
  },

  async createOAuthAccount(
    d1: D1Database,
    account: { provider_id: string; provider_user_id: string; user_id: string }
  ) {
    return d1
      .prepare(
        "INSERT INTO oauth_accounts (provider_id, provider_user_id, user_id) VALUES (?, ?, ?)"
      )
      .bind(account.provider_id, account.provider_user_id, account.user_id)
      .run();
  },

  // Jobs
  async getJobs(d1: D1Database, filters?: { status?: string; category?: string; limit?: number }) {
    let query = "SELECT * FROM jobs WHERE 1=1";
    const params: unknown[] = [];

    if (filters?.status) {
      query += " AND status = ?";
      params.push(filters.status);
    }
    if (filters?.category) {
      query += " AND category = ?";
      params.push(filters.category);
    }
    query += " ORDER BY created_at DESC";
    if (filters?.limit) {
      query += ` LIMIT ${filters.limit}`;
    }

    return d1.prepare(query).bind(...params).all();
  },

  async getJobById(d1: D1Database, id: string) {
    return d1.prepare("SELECT * FROM jobs WHERE id = ?").bind(id).first();
  },

  async createJob(
    d1: D1Database,
    job: {
      id: string;
      employer_id: string;
      title: string;
      description: string;
      category: string;
      budget_mode: string;
      budget_min?: number;
      budget_max?: number;
      skills: string[];
      experience_level?: string;
      deadline?: string;
    }
  ) {
    return d1
      .prepare(
        `INSERT INTO jobs (id, employer_id, title, description, category, budget_mode, budget_min, budget_max, skills, experience_level, deadline, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'open')`
      )
      .bind(
        job.id,
        job.employer_id,
        job.title,
        job.description,
        job.category,
        job.budget_mode,
        job.budget_min ?? null,
        job.budget_max ?? null,
        toJsonArray(job.skills),
        job.experience_level ?? "mid",
        job.deadline ?? null
      )
      .run();
  },
};
