import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://wrvyxkflqmnknescnlwz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indydnl4a2ZscW1ua25lc2NubHd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NzI0NDEsImV4cCI6MjA2NjM0ODQ0MX0.o6cH6jnfE5DVIeaX_svUYe4VF1KTE9rEFpF1J2VVNT4";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Real-time subscription helpers
export const subscribeToTable = (
  table: string,
  callback: (payload: any) => void,
  filter?: string
) => {
  const channel = supabase
    .channel(`${table}_changes`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: table,
        filter: filter,
      },
      callback
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

// Specific subscription functions
export const subscribeToRegistrations = (callback: (payload: any) => void) => {
  return subscribeToTable('registrations', callback);
};

export const subscribeToCategories = (callback: (payload: any) => void) => {
  return subscribeToTable('categories', callback);
};

export const subscribeToPanchayaths = (callback: (payload: any) => void) => {
  return subscribeToTable('panchayaths', callback);
};

export const subscribeToAnnouncements = (callback: (payload: any) => void) => {
  return subscribeToTable('announcements', callback);
};