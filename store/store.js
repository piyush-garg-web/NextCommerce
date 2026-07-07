import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import authReducer from './reducer/authReducer';
import cartReducer from './reducer/cartReducer';

const rootReducer = combineReducers({
  authStore: authReducer,
  cartStore: cartReducer
});

const createNoopStorage = () => ({
  getItem: (_key) => Promise.resolve(null),
  setItem: (_key, value) => Promise.resolve(value),
  removeItem: (_key) => Promise.resolve(),
});

const storage = typeof window !== 'undefined' 
  ? require('redux-persist/lib/storage').default 
  : createNoopStorage();

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);



