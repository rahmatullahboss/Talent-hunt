-- Talent Hunt D1 Schema (SQLite)
-- Converted from PostgreSQL

-- ============================================
-- Auth tables (for Lucia Auth)
-- ============================================

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  email_verified INTEGER DEFAULT 0,
  hashed_password TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS oauth_accounts (
  provider_id TEXT NOT NULL,
  provider_user_id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TEXT DEFAULT (datetime('now')),
  PRIMARY KEY (provider_id, provider_user_id)
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_oauth_accounts_user_id ON oauth_accounts(user_id);

-- ============================================
-- Application tables
-- ============================================

-- Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'freelancer' CHECK (role IN ('freelancer', 'employer', 'admin')),
  avatar_url TEXT,
  title TEXT,
  company_name TEXT,
  bio TEXT,
  hourly_rate REAL,
  skills TEXT DEFAULT '[]', -- JSON array stored as text
  location TEXT,
  phone TEXT,
  website TEXT,
  onboarding_complete INTEGER DEFAULT 0,
  is_suspended INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_profiles_role ON profiles(role);

-- Portfolio Items
CREATE TABLE IF NOT EXISTS portfolio_items (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  external_link TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_portfolio_items_profile ON portfolio_items(profile_id);

-- Jobs
CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,
  employer_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  budget_mode TEXT NOT NULL CHECK (budget_mode IN ('fixed', 'hourly')),
  budget_min REAL,
  budget_max REAL,
  skills TEXT DEFAULT '[]', -- JSON array
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('draft', 'open', 'in_progress', 'completed', 'cancelled')),
  location TEXT,
  deadline TEXT,
  experience_level TEXT DEFAULT 'mid' CHECK (experience_level IN ('entry', 'mid', 'expert')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_jobs_employer ON jobs(employer_id);
CREATE INDEX idx_jobs_category ON jobs(category);
CREATE INDEX idx_jobs_status ON jobs(status);

-- Proposals
CREATE TABLE IF NOT EXISTS proposals (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  freelancer_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  cover_letter TEXT NOT NULL,
  bid_amount REAL NOT NULL,
  bid_type TEXT NOT NULL CHECK (bid_type IN ('fixed', 'hourly')),
  estimated_hours INTEGER,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'shortlisted', 'hired', 'declined', 'withdrawn')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE (job_id, freelancer_id)
);

CREATE INDEX idx_proposals_job ON proposals(job_id);
CREATE INDEX idx_proposals_freelancer ON proposals(freelancer_id);
CREATE INDEX idx_proposals_status ON proposals(status);

-- Contracts
CREATE TABLE IF NOT EXISTS contracts (
  id TEXT PRIMARY KEY,
  proposal_id TEXT REFERENCES proposals(id) ON DELETE SET NULL,
  job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  employer_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  freelancer_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'submitted', 'completed', 'cancelled', 'disputed')),
  escrow_amount REAL,
  start_date TEXT,
  end_date TEXT,
  notes TEXT,
  manual_payment_reference TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_contracts_employer ON contracts(employer_id);
CREATE INDEX idx_contracts_freelancer ON contracts(freelancer_id);

-- Contract Milestones
CREATE TABLE IF NOT EXISTS contract_milestones (
  id TEXT PRIMARY KEY,
  contract_id TEXT NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  amount REAL NOT NULL,
  due_date TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'approved', 'rejected', 'released')),
  deliverable_url TEXT,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_milestones_contract ON contract_milestones(contract_id);
CREATE INDEX idx_milestones_status ON contract_milestones(status);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  contract_id TEXT NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  sender_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  attachments TEXT DEFAULT '[]', -- JSON array
  read_by TEXT DEFAULT '[]', -- JSON array of user IDs
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_messages_contract ON messages(contract_id);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  payload TEXT NOT NULL, -- JSON object
  read INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_notifications_user ON notifications(user_id);

-- Wallet Transactions
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('deposit', 'escrow_fund', 'release', 'withdrawal', 'adjustment')),
  amount REAL NOT NULL,
  reference TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'cleared', 'failed')),
  metadata TEXT, -- JSON object
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_wallet_user ON wallet_transactions(user_id);

-- Withdrawal Requests
CREATE TABLE IF NOT EXISTS withdrawal_requests (
  id TEXT PRIMARY KEY,
  freelancer_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount REAL NOT NULL,
  bank_account_name TEXT NOT NULL,
  bank_account_number TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  mobile_wallet_number TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
  admin_notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_withdrawal_freelancer ON withdrawal_requests(freelancer_id);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  contract_id TEXT NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  reviewer_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reviewee_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE (contract_id, reviewer_id)
);

-- Disputes
CREATE TABLE IF NOT EXISTS disputes (
  id TEXT PRIMARY KEY,
  contract_id TEXT NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  opened_by TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'under_review', 'resolved', 'closed')),
  resolution TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Admin Settings
CREATE TABLE IF NOT EXISTS admin_settings (
  id TEXT PRIMARY KEY,
  commission_percentage REAL NOT NULL DEFAULT 10,
  bank_account_name TEXT,
  bank_account_number TEXT,
  bank_name TEXT,
  mobile_wallet_provider TEXT,
  mobile_wallet_number TEXT,
  updated_at TEXT DEFAULT (datetime('now'))
);
