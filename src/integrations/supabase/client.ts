// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://igwshpoafqfyemultwgs.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlnd3NocG9hZnFmeWVtdWx0d2dzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0NTkxNzYsImV4cCI6MjA2NTAzNTE3Nn0.HQD1K8EYMEBMu0Chspr3e1RmX9OCiint5Rd5o6q8Yn4";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);