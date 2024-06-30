import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
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
  transforms: [encryptor],
};

const persistedReducers = persistReducer(persistConfig, reducers);

const customizedMiddleware = getDefaultMiddleware({
  serializableCheck: false, // Disables serializable check entirely
});

const store = configureStore({
  reducer: persistedReducers,
  middleware: (getDefaultMiddleware) =>
    VITE_APP_ENVIRONMENT === 'local'
      ? customizedMiddleware.concat(logger)
      : customizedMiddleware,
  devTools: VITE_APP_ENVIRONMENT !== 'production',
});

if (import.meta.hot) {
  import.meta.hot.accept('./rootReducers', async () => {
    const newRootReducer = (await import('./rootReducers')).default;
    store.replaceReducer(persistReducer(persistConfig, newRootReducer));
  });
}

const persistor = persistStore(store);

export { store, persistor };
