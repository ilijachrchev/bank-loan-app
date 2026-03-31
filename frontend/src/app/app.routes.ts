import { Routes } from '@angular/router';
import { customerGuard } from './core/guards/customer.guard';
import { bankerGuard } from './core/guards/banker.guard';

import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { NotFoundComponent } from './features/not-found/not-found.component';

import { CustomerLayoutComponent } from './features/customer/customer-layout/customer-layout.component';
import { CustomerDashboardComponent } from './features/customer/dashboard/customer-dashboard.component';
import { ApplyLoanComponent } from './features/customer/apply-loan/apply-loan.component';
import { MyApplicationsComponent } from './features/customer/my-applications/my-applications.component';
import { ApplicationDetailComponent } from './features/customer/application-detail/application-detail.component';

import { BankerLayoutComponent } from './features/banker/banker-layout/banker-layout.component';
import { BankerDashboardComponent } from './features/banker/dashboard/banker-dashboard.component';
import { ApplicationsListComponent } from './features/banker/applications-list/applications-list.component';
import { BankerApplicationDetailComponent } from './features/banker/application-detail/banker-application-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'customer',
    component: CustomerLayoutComponent,
    canActivate: [customerGuard],
    children: [
      { path: 'dashboard', component: CustomerDashboardComponent },
      { path: 'apply', component: ApplyLoanComponent },
      { path: 'applications', component: MyApplicationsComponent },
      { path: 'applications/:id', component: ApplicationDetailComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: 'banker',
    component: BankerLayoutComponent,
    canActivate: [bankerGuard],
    children: [
      { path: 'dashboard', component: BankerDashboardComponent },
      { path: 'applications', component: ApplicationsListComponent },
      { path: 'applications/:id', component: BankerApplicationDetailComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', component: NotFoundComponent }
];
