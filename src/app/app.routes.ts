import { Routes } from '@angular/router';

import { LoginComponent } from './login-page/login/login.component';
import { SignInComponent } from './login-page/sign-in/sign-in.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { MainPageComponent } from './main-page/main-page.component';

export const routes: Routes = [
    { path: '' , component: LoginPageComponent},
    { path: 'login', component: LoginComponent},
    { path: 'signin', component: SignInComponent },
    
    { path: 'main-page' , component: MainPageComponent}

];
