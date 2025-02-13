import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp({"projectId":"converto-xchange","appId":"1:661348704331:web:430201a7a421f16aae6dce","storageBucket":"converto-xchange.firebasestorage.app","apiKey":"AIzaSyDeYTwt-jgEs1ShdGhq9msKmyyL_pL41hI","authDomain":"converto-xchange.firebaseapp.com","messagingSenderId":"661348704331"})),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
