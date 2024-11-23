import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideFirebaseApp(() =>
      initializeApp({
        apiKey: "AIzaSyDOnSteBgs7gDR6lvOGmlzuuzQyZM_J-pU",
        authDomain: "da-bubble-1ecc6.firebaseapp.com",
        projectId: "da-bubble-1ecc6",
        storageBucket: "da-bubble-1ecc6.firebasestorage.app",
        messagingSenderId: "985917454287",
        appId: "1:985917454287:web:d8adc94be02ed0473204ba"
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())
  ]
};
