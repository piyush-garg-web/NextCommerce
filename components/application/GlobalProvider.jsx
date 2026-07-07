'use client';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthSync from './AuthSync';

const queryClient = new QueryClient();

export default function GlobalProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AuthSync>
            {children}
          </AuthSync>
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  );
}
