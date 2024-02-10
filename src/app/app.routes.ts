import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { LegalNoticeComponent } from './components/shared/legal-notice/legal-notice.component';
import { PrivacyPolicyComponent } from './components/shared/privacy-policy/privacy-policy.component';
import { ResetPasswordComponent } from './components/login/reset-password/reset-password.component';
import { SelectAvatarComponent } from './components/login/select-avatar/select-avatar.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'avatarPicker', component: SelectAvatarComponent },
  { path: "reset-passwort/:id", component: ResetPasswordComponent },
  { path: "home", component: HomeComponent },
  { path: "imprint", component:  LegalNoticeComponent},
  { path: "privacy-policy", component:  PrivacyPolicyComponent}
];