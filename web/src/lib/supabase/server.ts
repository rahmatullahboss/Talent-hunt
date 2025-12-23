// Stub file - Supabase has been replaced with D1
// This file exists for backward compatibility during migration
// Pages using this stub will show empty data - they need full migration

import "server-only";

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

type SelectResult<T = any> = {
  data: T[] | null;
  error: any;
  count: number | null;
  eq: (col: string, val: any) => SelectResult<T>;
  neq: (col: string, val: any) => SelectResult<T>;
  in: (col: string, vals: any[]) => SelectResult<T>;
  or: (filter: string) => SelectResult<T>;
  gte: (col: string, val: any) => SelectResult<T>;
  lte: (col: string, val: any) => SelectResult<T>;
  like: (col: string, val: any) => SelectResult<T>;
  ilike: (col: string, val: any) => SelectResult<T>;
  is: (col: string, val: any) => SelectResult<T>;
  contains: (col: string, val: any) => SelectResult<T>;
  containedBy: (col: string, val: any) => SelectResult<T>;
  order: (col: string, opts?: any) => SelectResult<T>;
  limit: (n: number) => SelectResult<T>;
  range: (start: number, end: number) => SelectResult<T>;
  overlaps: (col: string, vals: any[]) => SelectResult<T>;
  maybeSingle: () => Promise<{ data: T | null; error: any }>;
  single: () => Promise<{ data: T | null; error: any }>;
  then: (resolve: (value: { data: T[] | null; error: any; count: number | null }) => void) => void;
};

function createSelectResult<T = any>(): SelectResult<T> {
  const result: SelectResult<T> = {
    data: [] as T[],
    error: null,
    count: 0,
    eq: function(_col, _val) { return this; },
    neq: function(_col, _val) { return this; },
    in: function(_col, _vals) { return this; },
    or: function(_filter) { return this; },
    gte: function(_col, _val) { return this; },
    lte: function(_col, _val) { return this; },
    like: function(_col, _val) { return this; },
    ilike: function(_col, _val) { return this; },
    is: function(_col, _val) { return this; },
    contains: function(_col, _val) { return this; },
    containedBy: function(_col, _val) { return this; },
    order: function(_col, _opts) { return this; },
    limit: function(_n) { return this; },
    range: function(_start, _end) { return this; },
    overlaps: function(_col, _vals) { return this; },
    maybeSingle: async function() { return { data: null, error: null }; },
    single: async function() { return { data: null, error: null }; },
    then: function(resolve) { resolve({ data: [] as T[], error: null, count: 0 }); },
  };
  return result;
}

export function createSupabaseServerClient() {
  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
    },
    from: (_table: string) => ({
      select: (_columns?: string, _options?: { count?: string; head?: boolean }) => createSelectResult(),
      insert: async (_data: any) => ({ data: null, error: null }),
      update: (_data: any) => ({
        eq: async (_col: string, _val: any) => ({ data: null, error: null }),
        match: async (_criteria: any) => ({ data: null, error: null }),
      }),
      delete: () => ({
        eq: async (_col: string, _val: any) => ({ data: null, error: null }),
        match: async (_criteria: any) => ({ data: null, error: null }),
      }),
      upsert: async (_data: any) => ({ data: null, error: null }),
    }),
  };
}
