import { Router, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { LegalNoticeComponent } from './components/shared/legal-notice/legal-notice.component';
import { PrivacyPolicyComponent } from './components/shared/privacy-policy/privacy-policy.component';
import { ResetPasswordComponent } from './components/login/reset-password/reset-password.component';
import { SelectAvatarComponent } from './components/login/select-avatar/select-avatar.component';
import { inject } from '@angular/core';
import { FirebaseAuthService } from './services/firebase-auth.service';
import { map } from 'rxjs';
import { UploadJsonComponent } from './upload-json/upload-json.component';

function redirectIfNotAuthenticated() {
  const router = inject(Router);
  const as = inject(FirebaseAuthService);

  return as.user$.pipe(
    map((user) => {
      if (user) {
        return true;
      } else {
        return router.parseUrl('login');
      }
    })
  );
}

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [redirectIfNotAuthenticated],
  },
  { path: 'home', redirectTo: '', canActivate: [redirectIfNotAuthenticated] },
  { path: 'login', component: LoginComponent },
  {
    path: 'avatarPicker/:id',
    component: SelectAvatarComponent,
    canActivate: [redirectIfNotAuthenticated],
  },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'imprint', component: LegalNoticeComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  // { path: 'upload-sample-data', component: UploadJsonComponent },
];
