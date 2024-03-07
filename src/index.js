import React from 'react';
import { createRoot } from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import App from './App';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <SessionContextProvider supabaseClient={supabase}>
    <App />
  </SessionContextProvider>
);