import React from 'react';
import { createRoot } from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import App from './App';

type Env = {
  SUPABASE_URL: string;
  SUPABASE_KEY: string;
};

declare const process: {
  env: Env;
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const container: HTMLElement | null = document.getElementById('root');

if (container) {
  const root = createRoot(container);

  root.render(
    <SessionContextProvider supabaseClient={supabase}>
      <App />
    </SessionContextProvider>
  );
} else {
  console.log('Could not find root container');
}

