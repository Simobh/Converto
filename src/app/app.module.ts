import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { Router, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule } from '@angular/forms';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { ChartComponent } from './chart/chart.component';
import { FavorisComponent } from './favoris/favoris.component';
import { AlertComponent } from './alert/alert.component';
import { TravelComponent } from './travel/travel.component';
import { BudgetComponent } from './budget/budget.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    DashboardComponent,
    ResetPasswordComponent,
    HomeComponent,
    ChartComponent,
    FavorisComponent,
    AlertComponent,
    TravelComponent,
    BudgetComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([]),
    AppRoutingModule,
    HttpClientModule,
    provideFirebaseApp(() => initializeApp({"projectId":"converto-xchange","appId":"1:661348704331:web:430201a7a421f16aae6dce","storageBucket":"converto-xchange.firebasestorage.app","apiKey":"AIzaSyDeYTwt-jgEs1ShdGhq9msKmyyL_pL41hI","authDomain":"converto-xchange.firebaseapp.com","messagingSenderId":"661348704331"})),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
