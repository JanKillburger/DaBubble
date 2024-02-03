import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { LegalNoticeComponent } from './components/shared/legal-notice/legal-notice.component';
import { PrivacyPolicyComponent } from './components/shared/privacy-policy/privacy-policy.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: "home", component: HomeComponent },
  { path: "imprint", component:  LegalNoticeComponent},
  { path: "privacy-policy", component:  PrivacyPolicyComponent}
];