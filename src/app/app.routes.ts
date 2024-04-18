import { Routes } from '@angular/router';

import { LoginComponent } from './login-page/login/login.component';
import { SignInComponent } from './login-page/sign-in/sign-in.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { MainPageComponent } from './main-page/main-page.component';
import { ResetPasswordComponent } from './login-page/reset-password/reset-password.component';
import { AvatarComponent } from './login-page/avatar/avatar.component';
import { SentEmailComponent } from './login-page/sent-email/sent-email.component';

export const routes: Routes = [

    { path: 'login-page' , component: LoginPageComponent, children: [
        { path: 'login', component: LoginComponent},
        { path: 'signin', component: SignInComponent },
        { path: 'reset-password', component: ResetPasswordComponent },
        { path: 'avatar', component: AvatarComponent },
        { path: 'sent-mail', component: SentEmailComponent },
    ]
    },
    
    { path: 'main-page' , component: MainPageComponent}

];
