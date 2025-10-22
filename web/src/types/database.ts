export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          role: "freelancer" | "employer" | "admin";
          avatar_url: string | null;
          title: string | null;
          company_name: string | null;
          bio: string | null;
          hourly_rate: number | null;
          skills: string[];
          location: string | null;
          phone: string | null;
          website: string | null;
          created_at: string;
          updated_at: string;
          onboarding_complete: boolean;
          is_suspended: boolean;
        };
        Insert: {
          id: string;
          full_name: string;
          role?: "freelancer" | "employer" | "admin";
          avatar_url?: string | null;
          title?: string | null;
          company_name?: string | null;
          bio?: string | null;
          hourly_rate?: number | null;
          skills?: string[];
          location?: string | null;
          phone?: string | null;
          website?: string | null;
          onboarding_complete?: boolean;
          is_suspended?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      portfolio_items: {
        Row: {
          id: string;
          profile_id: string;
          title: string;
          description: string | null;
          image_url: string | null;
          external_link: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          title: string;
          description?: string | null;
          image_url?: string | null;
          external_link?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["portfolio_items"]["Insert"]>;
      };
      jobs: {
        Row: {
          id: string;
          employer_id: string;
          title: string;
          description: string;
          category: string;
          budget_mode: "fixed" | "hourly";
          budget_min: number | null;
          budget_max: number | null;
          skills: string[];
          status: "draft" | "open" | "in_progress" | "completed" | "cancelled";
          location: string | null;
          created_at: string;
          updated_at: string;
          deadline: string | null;
          experience_level: "entry" | "mid" | "expert";
        };
        Insert: {
          id?: string;
          employer_id: string;
          title: string;
          description: string;
          category: string;
          budget_mode: "fixed" | "hourly";
          budget_min?: number | null;
          budget_max?: number | null;
          skills?: string[];
          status?: "draft" | "open" | "in_progress" | "completed" | "cancelled";
          location?: string | null;
          deadline?: string | null;
          experience_level?: "entry" | "mid" | "expert";
        };
        Update: Partial<Database["public"]["Tables"]["jobs"]["Insert"]>;
      };
      proposals: {
        Row: {
          id: string;
          job_id: string;
          freelancer_id: string;
          cover_letter: string;
          bid_amount: number;
          bid_type: "fixed" | "hourly";
          estimated_hours: number | null;
          status: "submitted" | "shortlisted" | "hired" | "declined" | "withdrawn";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          freelancer_id: string;
          cover_letter: string;
          bid_amount: number;
          bid_type: "fixed" | "hourly";
          estimated_hours?: number | null;
          status?: "submitted" | "shortlisted" | "hired" | "declined" | "withdrawn";
        };
        Update: Partial<Database["public"]["Tables"]["proposals"]["Insert"]>;
      };
      contracts: {
        Row: {
          id: string;
          proposal_id: string;
          job_id: string;
          employer_id: string;
          freelancer_id: string;
          status: "pending" | "active" | "submitted" | "completed" | "cancelled" | "disputed";
          escrow_amount: number | null;
          start_date: string | null;
          end_date: string | null;
          notes: string | null;
          manual_payment_reference: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          proposal_id: string;
          job_id: string;
          employer_id: string;
          freelancer_id: string;
          status?: "pending" | "active" | "submitted" | "completed" | "cancelled" | "disputed";
          escrow_amount?: number | null;
          start_date?: string | null;
          end_date?: string | null;
          notes?: string | null;
          manual_payment_reference?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["contracts"]["Insert"]>;
      };
      contract_milestones: {
        Row: {
          id: string;
          contract_id: string;
          title: string;
          amount: number;
          due_date: string | null;
          status: "pending" | "in_review" | "approved" | "rejected" | "released";
          deliverable_url: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          contract_id: string;
          title: string;
          amount: number;
          due_date?: string | null;
          status?: "pending" | "in_review" | "approved" | "rejected" | "released";
          deliverable_url?: string | null;
          notes?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["contract_milestones"]["Insert"]>;
      };
      messages: {
        Row: {
          id: string;
          contract_id: string;
          sender_id: string;
          content: string;
          attachments: Json;
          created_at: string;
          read_by: string[];
        };
        Insert: {
          id?: string;
          contract_id: string;
          sender_id: string;
          content: string;
          attachments?: Json;
          read_by?: string[];
        };
        Update: Partial<Database["public"]["Tables"]["messages"]["Insert"]>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          payload: Json;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          payload: Json;
          read?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>;
      };
      wallet_transactions: {
        Row: {
          id: string;
          user_id: string;
          type: "deposit" | "escrow_fund" | "release" | "withdrawal" | "adjustment";
          amount: number;
          reference: string | null;
          status: "pending" | "cleared" | "failed";
          created_at: string;
          metadata: Json | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: "deposit" | "escrow_fund" | "release" | "withdrawal" | "adjustment";
          amount: number;
          reference?: string | null;
          status?: "pending" | "cleared" | "failed";
          metadata?: Json | null;
        };
        Update: Partial<Database["public"]["Tables"]["wallet_transactions"]["Insert"]>;
      };
      withdrawal_requests: {
        Row: {
          id: string;
          freelancer_id: string;
          amount: number;
          bank_account_name: string;
          bank_account_number: string;
          bank_name: string;
          mobile_wallet_number: string | null;
          status: "pending" | "processing" | "completed" | "rejected";
          admin_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          freelancer_id: string;
          amount: number;
          bank_account_name: string;
          bank_account_number: string;
          bank_name: string;
          mobile_wallet_number?: string | null;
          status?: "pending" | "processing" | "completed" | "rejected";
          admin_notes?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["withdrawal_requests"]["Insert"]>;
      };
      reviews: {
        Row: {
          id: string;
          contract_id: string;
          reviewer_id: string;
          reviewee_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          contract_id: string;
          reviewer_id: string;
          reviewee_id: string;
          rating: number;
          comment?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
      };
      disputes: {
        Row: {
          id: string;
          contract_id: string;
          opened_by: string;
          reason: string;
          status: "open" | "under_review" | "resolved" | "closed";
          resolution: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          contract_id: string;
          opened_by: string;
          reason: string;
          status?: "open" | "under_review" | "resolved" | "closed";
          resolution?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["disputes"]["Insert"]>;
      };
      admin_settings: {
        Row: {
          id: string;
          commission_percentage: number;
          bank_account_name: string | null;
          bank_account_number: string | null;
          bank_name: string | null;
          mobile_wallet_provider: string | null;
          mobile_wallet_number: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          commission_percentage?: number;
          bank_account_name?: string | null;
          bank_account_number?: string | null;
          bank_name?: string | null;
          mobile_wallet_provider?: string | null;
          mobile_wallet_number?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["admin_settings"]["Insert"]>;
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Update"];
