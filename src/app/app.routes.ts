import { Routes } from '@angular/router';
import { LoginComponent } from './login-page/login/login.component';
import { SignInComponent } from './login-page/sign-in/sign-in.component';

export const routes: Routes = [
    
    { path: 'login', component: LoginComponent},
    { path: 'signin', component: SignInComponent }
];
