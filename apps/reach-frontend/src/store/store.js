import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import logger from 'redux-logger';
import { encryptTransform } from 'redux-persist-transform-encrypt';

import reducers from './rootReducers';
const { VITE_APP_ENCRYPT_KEY, VITE_APP_ENVIRONMENT = 'local' } = import.meta.env || {};

const encryptor = encryptTransform({
  secretKey: VITE_APP_ENCRYPT_KEY,
  onError: function (error) {
    console.error('Encryption Error:', error);
  },
});

const persistConfig = {
  key: 'root',
  storage,
  transforms: [encryptor]
};

const persistedReducers = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducers,
  middleware: (getDefaultMiddleware) => VITE_APP_ENVIRONMENT === 'local' ? getDefaultMiddleware().concat(logger) : getDefaultMiddleware(),
  devTools: VITE_APP_ENVIRONMENT !== 'production'
});

if (VITE_APP_ENVIRONMENT !== 'production' && module.hot) {
  module.hot.accept('./rootReducers', () => store.replaceReducer(persistedReducers))
}

const persistor = persistStore(store);

export { store, persistor };